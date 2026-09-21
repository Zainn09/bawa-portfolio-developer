import { getPublishedArticles } from "@/lib/cms/public";
export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return url
    ? [
        {
          url: url.replace(/\/$/, ""),
          changeFrequency: "monthly",
          priority: 1,
        },
        {
          url: `${url.replace(/\/$/, "")}/blogs`,
          changeFrequency: "monthly",
          priority: 0.8,
        },
        ...articles.map((article) => ({
          url: `${url.replace(/\/$/, "")}/blogs/${article.slug}`,
          lastModified: new Date(
            `${article.updatedAt || article.publishedAt}T12:00:00Z`,
          ),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ]
    : [];
}
