import { NextRequest } from "next/server";
import { articles } from "@/data/blog";
import { importArticle } from "@/lib/cms/import";
import { toRow, postSchema } from "@/lib/cms/model";
import { guard, reply } from "@/lib/cms/http";
export async function POST(req: NextRequest) {
  const access = await guard(req);
  if (access.error) return access.error;
  const rows = articles.map((a) => toRow(postSchema.parse(importArticle(a))));
  // Existing slugs are never overwritten: this is safe to retry after a network interruption.
  const { data, error } = await access
    .auth!.db.from("blog_posts")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: true })
    .select("id");
  return error
    ? reply(
        {
          error: "Import failed. Check the database migration before retrying.",
        },
        503,
      )
    : reply({ imported: data?.length || 0 });
}
