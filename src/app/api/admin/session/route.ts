import { NextRequest } from "next/server";
import { cmsConfigured } from "@/lib/cms/config";
import { adminSession, sessionClient } from "@/lib/cms/server";
import { reply, sameOrigin, readJSON, inputError } from "@/lib/cms/http";
export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return reply({ error: "Submit from this website." }, 403);
  if (!cmsConfigured())
    return reply(
      { error: "Supabase is not configured. Follow the setup guide first." },
      503,
    );
  try {
    const body = await readJSON(req);
    if (
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      body.email.length > 254 ||
      body.password.length > 256
    )
      return reply({ error: "Enter your administrator credentials." }, 400);
    const db = await sessionClient();
    const { error } = await db.auth.signInWithPassword({
      email: body.email.trim(),
      password: body.password,
    });
    if (error)
      return reply(
        { error: "Sign-in failed. Check your credentials or try again later." },
        401,
      );
    if (!(await adminSession())) {
      await db.auth.signOut();
      return reply(
        { error: "This account does not have administrator access." },
        403,
      );
    }
    return reply({ ok: true });
  } catch (e) {
    return inputError(e);
  }
}
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req))
    return reply({ error: "Submit from this website." }, 403);
  if (cmsConfigured()) {
    const db = await sessionClient();
    await db.auth.signOut();
  }
  return reply({ ok: true });
}
