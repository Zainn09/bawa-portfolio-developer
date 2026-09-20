import { NextRequest, NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();
export async function POST(request: NextRequest) {
  const response = (body: object, status: number) =>
    NextResponse.json(body, {
      status,
      headers: { "Cache-Control": "no-store" },
    });
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  if (origin) {
    try {
      if (
        ![
          request.nextUrl.host,
          request.headers.get("host"),
          forwardedHost,
        ].includes(new URL(origin).host)
      )
        return response({ error: "Please submit from this website." }, 403);
    } catch {
      return response({ error: "Invalid request origin." }, 403);
    }
  }
  if (!request.headers.get("content-type")?.includes("application/json"))
    return response({ error: "Unsupported request format." }, 415);
  if (Number(request.headers.get("content-length")) > 20000)
    return response({ error: "Your message is too large." }, 413);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.expires <= now) attempts.delete(key);
  const current = attempts.get(ip);
  if (current && current.count >= 5)
    return response(
      { error: "Too many attempts. Please try again in 10 minutes." },
      429,
    );
  if (attempts.size >= 10000 && !current)
    return response(
      { error: "The form is busy. Please try again later." },
      503,
    );
  attempts.set(ip, {
    count: (current?.count || 0) + 1,
    expires: current?.expires || now + 600000,
  });
  let input: unknown;
  try {
    // Bound the request as it streams; do not buffer an unbounded body.
    const reader = request.body?.getReader();
    if (!reader) return response({ error: "Empty request." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 20000) {
        await reader.cancel();
        return response({ error: "Your message is too large." }, 413);
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response({ error: "Please check your project details." }, 400);
  }
  const { data, errors } = validateContact(input);
  if (!data)
    return response(
      { error: "Please check the highlighted fields.", errors },
      400,
    );
  if (
    data.website ||
    !data.startedAt ||
    now - data.startedAt < 2500 ||
    data.startedAt > now
  )
    return response({ error: "Please take a moment and try again." }, 400);
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook)
    return response(
      {
        error:
          "This portfolio’s contact delivery is not connected yet. Your message has not been sent. Please keep your draft and try again once the owner adds their contact service.",
      },
      503,
    );
  try {
    const url = new URL(webhook);
    if (url.protocol !== "https:") throw new Error("HTTPS required");
    const { website: _website, startedAt: _startedAt, ...payload } = data;
    const delivered = await fetch(url, {
      method: "POST",
      redirect: "error",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        ...payload,
        source: "portfolio",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!delivered.ok) throw new Error("Delivery failed");
    return response(
      {
        success: true,
        message:
          "Your project details have been sent. Thank you for getting in touch.",
      },
      200,
    );
  } catch {
    return response(
      {
        error:
          "Your message could not be delivered. Your draft is still here—please try again shortly.",
      },
      502,
    );
  }
}
