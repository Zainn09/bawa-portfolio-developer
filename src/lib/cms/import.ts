import type { Article } from "@/data/blog";
import type { PostInput, RichNode, RichDoc } from "./model";
const paragraph = (text: string): RichNode => ({
  type: "paragraph",
  content: text ? [{ type: "text", text }] : [],
});
export function importArticle(a: Article): PostInput {
  const content: RichNode[] = [paragraph(a.intro)];
  a.sections.forEach((s, i) => {
    content.push(
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: s.heading }],
      },
      ...s.paragraphs.map(paragraph),
    );
    if (a.inlineImages[i]?.src)
      content.push({ type: "image", attrs: { ...a.inlineImages[i] } });
  });
  content.push({ type: "blockquote", content: [paragraph(a.takeaway)] });
  if (a.mobileImages.some((m) => m.src))
    content.push(
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The same store. A smaller canvas." }],
      },
      ...a.mobileImages
        .filter((m) => m.src)
        .map((m) => ({ type: "image", attrs: { ...m, layout: "mobile" } })),
    );
  if (a.comparisonImages.some((m) => m.src))
    content.push(
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Documented comparison" }],
      },
      ...a.comparisonImages
        .filter((m) => m.src)
        .map((m) => ({ type: "image", attrs: { ...m } })),
    );
  return {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    project: a.project,
    category: a.category,
    tags: a.tags,
    content: { type: "doc", content } as RichDoc,
    cover: a.featuredImage.src ? (a.featuredImage as PostInput["cover"]) : null,
    status: "published",
    publishedAt: a.publishedAt,
    seoTitle: a.seoTitle.slice(0, 70),
    seoDescription: a.seoDescription.slice(0, 180),
    featured: [
      "prime-baby-gear-navigation",
      "ollie-burwell-styling-guide",
      "nokoluxe-outdoor-living-navigation",
    ].includes(a.slug),
    sources: a.sources,
    sourceNotes:
      a.project === "vintage-art-garage"
        ? "No accepted storefront captures were supplied for Vintage Art Garage. This is a planning note, not an account of unseen pages or completed work."
        : "Based on supplied storefront captures dated 20 September 2026 and public content. Recommendations are distinguished from observations; implementation ownership and commercial results are not inferred.",
  };
}
