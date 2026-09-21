import { NextRequest } from "next/server";
import { guard, reply, readJSON, inputError } from "@/lib/cms/http";
import { postSchema, toRow } from "@/lib/cms/model";
type Context = { params: Promise<{ id: string }> };
export async function GET(req: NextRequest, { params }: Context) {
  const access = await guard(req);
  if (access.error) return access.error;
  const { id } = await params;
  const { data, error } = await access
    .auth!.db.from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return error
    ? reply({ error: "Could not load this article." }, 503)
    : data
      ? reply({ post: data })
      : reply({ error: "Article not found." }, 404);
}
export async function PUT(req: NextRequest, { params }: Context) {
  const access = await guard(req);
  if (access.error) return access.error;
  try {
    const { id } = await params;
    const body = await readJSON(req);
    const parsed = postSchema.safeParse(body);
    if (!parsed.success)
      return reply(
        {
          error: parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("\n"),
        },
        400,
      );
    if (typeof body.version !== "string")
      return reply({ error: "Reload this article before saving." }, 400);
    const { data, error } = await access
      .auth!.db.from("blog_posts")
      .update(toRow(parsed.data))
      .eq("id", id)
      .eq("updated_at", body.version)
      .select()
      .maybeSingle();
    if (error)
      return reply(
        {
          error:
            error.code === "23505"
              ? "That URL is already used."
              : error.code === "P0001"
                ? "Published URLs are locked to preserve links."
                : "The article could not be saved.",
        },
        error.code === "23505" || error.code === "P0001" ? 409 : 503,
      );
    if (!data)
      return reply(
        {
          error:
            "This article changed in another session. Reload before saving; your unsaved text has not been submitted.",
        },
        409,
      );
    return reply({ post: data });
  } catch (e) {
    return inputError(e);
  }
}
