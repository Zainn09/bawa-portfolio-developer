import { NextRequest } from "next/server";
import { guard, reply, readJSON, inputError } from "@/lib/cms/http";
import { postSchema, toRow } from "@/lib/cms/model";
export async function GET(req: NextRequest) {
  const access = await guard(req);
  if (access.error) return access.error;
  const { data, error } = await access
    .auth!.db.from("blog_posts")
    .select("id,title,slug,status,category,published_at,updated_at,featured")
    .order("updated_at", { ascending: false })
    .limit(500);
  return error
    ? reply(
        { error: "Could not load articles. Check the database migration." },
        503,
      )
    : reply({ posts: data });
}
export async function POST(req: NextRequest) {
  const access = await guard(req);
  if (access.error) return access.error;
  try {
    const parsed = postSchema.safeParse(await readJSON(req));
    if (!parsed.success)
      return reply(
        {
          error: parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("\n"),
        },
        400,
      );
    const { data, error } = await access
      .auth!.db.from("blog_posts")
      .insert(toRow(parsed.data))
      .select()
      .single();
    if (error)
      return reply(
        {
          error:
            error.code === "23505"
              ? "That URL is already used. Choose another slug."
              : "The article could not be saved.",
        },
        error.code === "23505" ? 409 : 503,
      );
    return reply({ post: data }, 201);
  } catch (e) {
    return inputError(e);
  }
}
