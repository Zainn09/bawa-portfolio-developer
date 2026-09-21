import { test, expect } from "@playwright/test";
import { articles } from "../src/data/blog";
import { importArticle } from "../src/lib/cms/import";
import {
  postSchema,
  toRow,
  toInput,
  safeLink,
  safeImage,
  validDocument,
  editorialDate,
  type PostRow,
} from "../src/lib/cms/model";

test("all 35 baseline articles import with valid rich content, dates, sources, and genuine media", () => {
  expect(articles).toHaveLength(35);
  for (const article of articles) {
    const input = importArticle(article);
    const parsed = postSchema.safeParse(input);
    expect(
      parsed.success,
      `${article.slug}: ${!parsed.success ? JSON.stringify(parsed.error.issues) : ""}`,
    ).toBe(true);
    expect(JSON.stringify(input.content)).toContain(article.intro);
    expect(input.publishedAt).toBe(article.publishedAt);
    expect(input.sources).toEqual(article.sources);
    expect(JSON.stringify(input.content)).toContain(article.takeaway);
  }
});
test("unsafe links and unapproved image origins are rejected", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "//attacker.test",
    "/\\attacker.test",
    "https://good.test\nhello",
  ])
    expect(safeLink(url), url).toBe(false);
  for (const url of [
    "https://example.com/a",
    "mailto:hi@example.com",
    "/blogs/article",
    "#heading",
  ])
    expect(safeLink(url), url).toBe(true);
  for (const url of [
    "https://untrusted.test/image.webp",
    "data:image/svg+xml,hi",
    "/images/../secret",
    "/images/test.webp?bad=1",
  ])
    expect(safeImage(url)).toBe(false);
  expect(safeImage("/images/blog/test.webp")).toBe(true);
});
test("document validation rejects unknown nodes, script links, missing image alt, and excessive nesting", () => {
  const doc = (node: unknown) => ({ type: "doc", content: [node] });
  expect(validDocument(doc({ type: "script", text: "alert(1)" }))).toBe(false);
  expect(
    validDocument(
      doc({
        type: "text",
        text: "link",
        marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
      }),
    ),
  ).toBe(false);
  expect(
    validDocument(
      doc({ type: "image", attrs: { src: "/images/test.webp", alt: "" } }),
    ),
  ).toBe(false);
  let nested: any = { type: "paragraph" };
  for (let i = 0; i < 24; i++)
    nested = { type: "blockquote", content: [nested] };
  expect(validDocument(doc(nested))).toBe(false);
});
test("drafts can start small; publishing requires content, excerpt, and a nonfuture date", () => {
  const draft = {
    ...importArticle(articles[0]),
    status: "draft",
    publishedAt: null,
    content: { type: "doc", content: [{ type: "paragraph" }] },
    excerpt: "",
  };
  expect(postSchema.safeParse(draft).success).toBe(true);
  expect(postSchema.safeParse({ ...draft, status: "published" }).success).toBe(
    false,
  );
  expect(
    postSchema.safeParse({
      ...importArticle(articles[0]),
      publishedAt: "2099-01-01",
    }).success,
  ).toBe(false);
  expect(
    postSchema.safeParse({ ...draft, publishedAt: "2026-02-31" }).success,
  ).toBe(false);
});
test("editorial dates round-trip in Asia/Karachi without shifting at UTC midnight", () => {
  expect(editorialDate("2026-09-21T21:00:00Z")).toBe("2026-09-22");
  const input = importArticle(articles[0]);
  input.publishedAt = "2026-09-22";
  const row = toRow(input);
  expect(new Date(row.published_at!).toISOString()).toBe(
    "2026-09-21T19:00:00.000Z",
  );
  expect(
    toInput({
      ...row,
      published_at: new Date(row.published_at!).toISOString(),
    } as PostRow).publishedAt,
  ).toBe("2026-09-22");
});
