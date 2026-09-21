import { z } from "zod";
import type { BlogMedia } from "@/data/blog";
import { blogProjects } from "@/data/blog/catalog";

export type RichNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: RichNode[];
};
export type RichDoc = RichNode & { type: "doc" };
export const editorialDate = (value: string | Date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
export const emptyDocument: RichDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
export const richText = (node: RichNode): string =>
  [node.text || "", ...(node.content || []).map(richText)].join(" ");
export function safeLink(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length > 2000 ||
    /[\u0000-\u0020\\]/.test(value)
  )
    return false;
  if (/^https?:\/\//i.test(value)) {
    try {
      return !!new URL(value).hostname;
    } catch {
      return false;
    }
  }
  return (
    /^mailto:[^@]+@[^@]+$/.test(value) ||
    /^\/(?!\/)/.test(value) ||
    /^#[\w-]+$/.test(value)
  );
}
export function safeImage(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (/^\/images\/[a-zA-Z0-9/_\-.]+$/.test(value) && !value.includes(".."))
    return true;
  try {
    const url = new URL(value);
    const host = new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://unconfigured.invalid",
    );
    return (
      url.protocol === "https:" &&
      url.origin === host.origin &&
      /^\/storage\/v1\/object\/public\/blog-media\/[\w/-]+\.webp$/.test(
        url.pathname,
      ) &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}
const nodeTypes = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "blockquote",
  "bulletList",
  "orderedList",
  "listItem",
  "image",
  "hardBreak",
  "horizontalRule",
  "codeBlock",
]);
const markTypes = new Set([
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "link",
]);
export function validDocument(value: unknown): value is RichDoc {
  let count = 0,
    length = 0;
  function visit(n: unknown, depth: number): boolean {
    if (
      !n ||
      typeof n !== "object" ||
      Array.isArray(n) ||
      depth > 20 ||
      ++count > 5000
    )
      return false;
    const node = n as RichNode;
    if (!nodeTypes.has(node.type) || (depth > 0 && node.type === "doc"))
      return false;
    if (node.text !== undefined) {
      if (typeof node.text !== "string") return false;
      length += node.text.length;
      if (length > 200000) return false;
    }
    if (node.type === "text" && typeof node.text !== "string") return false;
    if (
      node.attrs !== undefined &&
      (!node.attrs ||
        typeof node.attrs !== "object" ||
        Array.isArray(node.attrs))
    )
      return false;
    if (
      node.type === "heading" &&
      ![2, 3, 4].includes(Number(node.attrs?.level))
    )
      return false;
    if (
      node.type === "image" &&
      (!safeImage(node.attrs?.src) ||
        typeof node.attrs?.alt !== "string" ||
        !node.attrs.alt.trim() ||
        node.attrs.alt.length > 500 ||
        (node.attrs.caption !== undefined &&
          (typeof node.attrs.caption !== "string" ||
            node.attrs.caption.length > 1000)))
    )
      return false;
    if (
      node.marks !== undefined &&
      (!Array.isArray(node.marks) ||
        node.marks.length > 10 ||
        !node.marks.every(
          (m) =>
            m &&
            markTypes.has(m.type) &&
            (m.type !== "link" || safeLink(m.attrs?.href)),
        ))
    )
      return false;
    return (
      node.content === undefined ||
      (Array.isArray(node.content) &&
        node.content.every((child) => visit(child, depth + 1)))
    );
  }
  return !!value && (value as RichNode).type === "doc" && visit(value, 0);
}
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    "Use a valid date",
  );
const mediaSchema = z.object({
  src: z.string().refine(safeImage, "Upload an image to this project first"),
  alt: z.string().trim().min(1).max(500),
  width: z.number().int().min(1).max(20000),
  height: z.number().int().min(1).max(20000),
  caption: z.string().max(1000).optional(),
  smallSrc: z.string().refine(safeImage).optional(),
  smallWidth: z.number().int().positive().optional(),
  avifSrc: z.string().refine(safeImage).optional(),
});
export const postSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase words separated by hyphens",
      ),
    excerpt: z.string().trim().max(500),
    category: z.string().trim().min(1).max(80),
    project: z
      .string()
      .refine(
        (v) => !v || blogProjects.some((p) => p.slug === v),
        "Choose a listed store or general editorial",
      ),
    tags: z.array(z.string().trim().min(1).max(40)).max(15),
    content: z.custom<RichDoc>(
      validDocument,
      "Invalid article formatting, link, or image. Use the editor and uploaded images.",
    ),
    cover: mediaSchema.nullable(),
    status: z.enum(["draft", "published", "archived"]),
    publishedAt: date.nullable(),
    seoTitle: z.string().trim().max(70),
    seoDescription: z.string().trim().max(180),
    featured: z.boolean(),
    sourceNotes: z.string().trim().max(3000),
    sources: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(160),
          url: z.string().max(2000).refine(safeLink, "Use a valid link"),
        }),
      )
      .max(20),
  })
  .superRefine((p, ctx) => {
    if (p.status === "published") {
      if (!p.publishedAt)
        ctx.addIssue({
          code: "custom",
          path: ["publishedAt"],
          message: "Set the publication date",
        });
      if (p.publishedAt && p.publishedAt > editorialDate())
        ctx.addIssue({
          code: "custom",
          path: ["publishedAt"],
          message: "Scheduling is not enabled; choose today or an earlier date",
        });
      if (p.excerpt.length < 20)
        ctx.addIssue({
          code: "custom",
          path: ["excerpt"],
          message: "Add a useful excerpt (at least 20 characters)",
        });
      if (richText(p.content).trim().length < 80)
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message:
            "Add article text before publishing (at least 80 characters)",
        });
    }
  });
export type PostInput = z.infer<typeof postSchema>;
export type PostRow = {
  url_locked: boolean;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  project: string;
  tags: string[];
  content: RichDoc;
  cover: BlogMedia | null;
  status: PostInput["status"];
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  featured: boolean;
  source_notes: string;
  sources: PostInput["sources"];
  created_at: string;
  updated_at: string;
};
export function toInput(row: PostRow): PostInput {
  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    category: row.category,
    project: row.project,
    tags: row.tags,
    content: row.content,
    cover: row.cover?.src ? (row.cover as PostInput["cover"]) : null,
    status: row.status,
    publishedAt: row.published_at ? editorialDate(row.published_at) : null,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    featured: row.featured,
    sourceNotes: row.source_notes,
    sources: row.sources,
  };
}
export function toRow(p: PostInput) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    project: p.project,
    tags: [...new Set(p.tags)],
    content: p.content,
    cover: p.cover,
    status: p.status,
    published_at: p.publishedAt ? `${p.publishedAt}T00:00:00+05:00` : null,
    seo_title: p.seoTitle || p.title.slice(0, 70),
    seo_description: p.seoDescription || p.excerpt.slice(0, 180),
    featured: p.featured,
    source_notes: p.sourceNotes,
    sources: p.sources,
  };
}
