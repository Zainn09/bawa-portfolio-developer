import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { adminSession } from "./server";
import { cmsConfigured } from "./config";
export const reply = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export function sameOrigin(req: NextRequest) {
  try {
    const origin = new URL(req.headers.get("origin") || "");
    return (
      origin.host === req.headers.get("host") ||
      origin.host === req.nextUrl.host ||
      origin.host === req.headers.get("x-forwarded-host")?.split(",")[0].trim()
    );
  } catch {
    return false;
  }
}
export async function guard(req: NextRequest) {
  if (req.method !== "GET" && !sameOrigin(req))
    return { error: reply({ error: "Submit from this website." }, 403) };
  if (!cmsConfigured())
    return {
      error: reply(
        { error: "Blog administration is not configured yet." },
        503,
      ),
    };
  const auth = await adminSession();
  if (!auth)
    return { error: reply({ error: "Administrator access required." }, 401) };
  return { auth };
}
export async function boundedBody(req: NextRequest, limit = 1_000_000) {
  if (Number(req.headers.get("content-length")) > limit)
    throw new Error("BODY_TOO_LARGE");
  const reader = req.body?.getReader();
  if (!reader) throw new Error("EMPTY_BODY");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new Error("BODY_TOO_LARGE");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
export async function readJSON(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new Error("INVALID_JSON");
  return JSON.parse((await boundedBody(req)).toString("utf8"));
}
export const inputError = (e: unknown) =>
  reply(
    {
      error:
        e instanceof Error && e.message === "BODY_TOO_LARGE"
          ? "This request is too large."
          : "Check the submitted fields.",
    },
    e instanceof Error && e.message === "BODY_TOO_LARGE" ? 413 : 400,
  );
