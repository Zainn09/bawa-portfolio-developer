import "server-only";
import { getPublishedArticles } from "@/lib/cms/public";
import { profile } from "@/data/portfolio";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 feed of published journal articles at /feed.xml, using the
 * canonical site URL (see src/lib/site.ts) for absolute links.
 */
export async function GET() {
  const base = siteUrl;
  const articles = await getPublishedArticles();
  const items = articles
    .map((a) => {
      const pubDate = new Date(`${a.publishedAt}T12:00:00Z`).toUTCString();
      const categories = [a.project, ...a.tags.slice(0, 3)]
        .map((c) => `      <category>${esc(c)}</category>`)
        .join("\n");
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${base}/blogs/${a.slug}</link>
      <guid isPermaLink="true">${base}/blogs/${a.slug}</guid>
      <description>${esc(a.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
${categories}
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${profile.name} — Journal`)}</title>
    <link>${base}</link>
    <description>Shopify development notes, storefront stories, and journal entries.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
