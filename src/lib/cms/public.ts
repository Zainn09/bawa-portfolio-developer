import "server-only";
import { cache } from "react";
import { articles as supplied, type Article } from "@/data/blog";
import { cmsConfigured } from "./config";
import { publicClient } from "./server";
import {
  richText,
  validDocument,
  editorialDate,
  safeImage,
  type PostRow,
} from "./model";
export const databasePublishing = () =>
  process.env.BLOG_CONTENT_SOURCE === "database";
export const getPublishedArticles = cache(async (): Promise<Article[]> => {
  if (!databasePublishing()) return supplied;
  if (!cmsConfigured())
    throw new Error("Journal database configuration is incomplete.");
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(500);
  // Never resurrect file-backed drafts/archived entries on a database error or empty result.
  if (error) throw new Error("The journal is temporarily unavailable.");
  return (data as PostRow[])
    .filter((p) => validDocument(p.content))
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      project: p.project,
      category: p.category,
      tags: p.tags,
      excerpt: p.excerpt,
      intro: "",
      sections: [],
      takeaway: "",
      mobileGallery: false,
      publishedAt: editorialDate(p.published_at!),
      updatedAt: editorialDate(p.updated_at),
      status: p.status,
      seoTitle: p.seo_title || p.title,
      seoDescription: p.seo_description || p.excerpt,
      featuredImage:
        p.cover && safeImage(p.cover.src)
          ? p.cover
          : { width: 1600, height: 1000, alt: "Article image placeholder" },
      inlineImages: [],
      comparisonImages: [],
      mobileImages: [],
      readingMinutes: Math.max(
        1,
        Math.ceil(richText(p.content).trim().split(/\s+/).length / 200),
      ),
      sources: p.sources,
      richContent: p.content,
      sourceNotes: p.source_notes,
      featured: p.featured,
    }));
});
export async function publishedArticle(slug: string) {
  return (await getPublishedArticles()).find((p) => p.slug === slug);
}
