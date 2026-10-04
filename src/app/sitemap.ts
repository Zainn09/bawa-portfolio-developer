import { getPublishedArticles } from "@/lib/cms/public";
import { servicePages } from "@/data/services";
import { caseStudySlugs } from "@/data/case-studies";
export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return [];
  const base = url.replace(/\/$/, "");
  return [
    {
      url: base,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/blogs`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...servicePages.map((service) => ({
      url: `${base}/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${base}/case-studies`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...caseStudySlugs.map((slug) => ({
      url: `${base}/case-studies/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: `${base}/blogs/${article.slug}`,
      lastModified: new Date(
        `${article.updatedAt || article.publishedAt}T12:00:00Z`,
      ),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
