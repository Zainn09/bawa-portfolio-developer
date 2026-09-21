"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, PenLine, ImagePlus, Save, ArrowLeft } from "lucide-react";
import { blogProjects } from "@/data/blog/catalog";
import {
  emptyDocument,
  editorialDate,
  toInput,
  type PostInput,
  type PostRow,
} from "@/lib/cms/model";
import RichEditor from "./RichEditor";
import MediaPicker from "./MediaPicker";
import RichContent from "@/components/blog/RichContent";
import BlogImage from "@/components/blog/BlogImage";
const fresh: PostInput = {
  title: "",
  slug: "",
  excerpt: "",
  category: "Editorial",
  project: "",
  tags: [],
  content: emptyDocument,
  cover: null,
  status: "draft",
  publishedAt: null,
  seoTitle: "",
  seoDescription: "",
  featured: false,
  sourceNotes: "",
  sources: [],
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
export default function PostEditor({ initial }: { initial?: PostRow }) {
  const router = useRouter();
  const [data, setData] = useState<PostInput>(
      initial ? toInput(initial) : fresh,
    ),
    [saved, setSaved] = useState(initial),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(false),
    [mediaOpen, setMediaOpen] = useState(false),
    [slugEdited, setSlugEdited] = useState(!!initial);
  const baseline = useRef(JSON.stringify(initial ? toInput(initial) : fresh));
  const dirty = JSON.stringify(data) !== baseline.current;
  function field<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setData((p) => ({ ...p, [key]: value }));
    setMessage("");
  }
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const click = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a") : null;
      if (
        a &&
        a.target !== "_blank" &&
        a.href !== location.href &&
        !a.getAttribute("href")?.startsWith("#") &&
        !confirm("Leave this page? Your unsaved changes will be lost.")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const leave = (e: Event) => {
      if (!confirm("Sign out and discard unsaved changes?")) e.preventDefault();
    };
    window.addEventListener("cms:before-leave", leave);
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("cms:before-leave", leave);
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", click, true);
    };
  }, [dirty]);
  async function save() {
    if (busy) return;
    if (
      saved?.status === "published" &&
      data.status !== "published" &&
      !confirm(
        "This will remove the article from the public journal. Continue?",
      )
    )
      return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const r = await fetch(
        saved ? `/api/admin/posts/${saved.id}` : "/api/admin/posts",
        {
          method: saved ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            tags: data.tags.map((t) => t.trim()).filter(Boolean),
            version: saved?.updated_at,
          }),
        },
      );
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      baseline.current = JSON.stringify(toInput(result.post));
      setSaved(result.post);
      setData(toInput(result.post));
      setMessage(
        data.status === "published"
          ? "Published version saved."
          : data.status === "archived"
            ? "Article archived."
            : "Draft saved.",
      );
      if (!saved) router.replace(`/admin/posts/${result.post.id}`);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save. Your text is still here.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link className="cms-back" href="/admin">
        <ArrowLeft size={16} /> All articles
      </Link>
      <header className="cms-page-heading cms-editor-heading">
        <div>
          <span className="cms-eyebrow">
            {initial ? "REFINE THE NOTE" : "A NEW CHAPTER"}
          </span>
          <h1>{initial ? "Edit article" : "New article"}</h1>
          <p role="status">
            {busy
              ? "Saving…"
              : dirty
                ? "Unsaved changes"
                : saved
                  ? "All changes saved"
                  : "Not saved yet"}
          </p>
        </div>
        <div className="cms-header-actions">
          <button
            className="cms-secondary"
            type="button"
            disabled={busy}
            onClick={() => setPreview((v) => !v)}
          >
            {preview ? <PenLine size={16} /> : <Eye size={16} />}{" "}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            className="cms-primary"
            type="button"
            disabled={busy}
            onClick={save}
          >
            <Save size={16} />
            {busy
              ? "Saving…"
              : data.status === "published"
                ? saved?.status === "published"
                  ? "Save changes"
                  : "Publish article"
                : data.status === "archived"
                  ? "Archive article"
                  : "Save draft"}
          </button>
        </div>
      </header>
      {error && (
        <div className="cms-error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="cms-success" role="status">
          {message}
        </div>
      )}
      <fieldset
        className="cms-editor-layout"
        disabled={busy}
        aria-label="Article fields"
      >
        <div className="cms-editor-main">
          {preview ? (
            <section className="cms-card cms-preview">
              <span className="cms-eyebrow">
                UNSAVED PREVIEW · ONLY VISIBLE HERE
              </span>
              <h1>{data.title || "Untitled article"}</h1>
              <p className="cms-preview-deck">{data.excerpt}</p>
              {data.cover && <BlogImage media={data.cover} />}
              <RichContent document={data.content} />
            </section>
          ) : (
            <>
              <section className="cms-card cms-field-stack">
                <label>
                  Title
                  <input
                    value={data.title}
                    maxLength={160}
                    placeholder="Give the article a clear, specific title"
                    onChange={(e) => {
                      const title = e.target.value;
                      setData((p) => ({
                        ...p,
                        title,
                        ...(!slugEdited && !saved?.url_locked
                          ? { slug: slugify(title) }
                          : {}),
                      }));
                    }}
                  />
                </label>
                <label>
                  Excerpt
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={data.excerpt}
                    onChange={(e) => field("excerpt", e.target.value)}
                    placeholder="A short introduction for the journal cards and article header"
                  />
                </label>
                <div className="cms-field-heading">
                  <label id="content-label">Article content</label>
                  <small>Rich text · images can sit between paragraphs</small>
                </div>
                <RichEditor
                  disabled={busy}
                  value={data.content}
                  onChange={(content) => field("content", content)}
                />
              </section>
              <section className="cms-card cms-field-stack">
                <h2>Search engine listing</h2>
                <label>
                  URL slug
                  <div className="cms-slug">
                    <span>/blogs/</span>
                    <input
                      value={data.slug}
                      readOnly={saved?.url_locked}
                      maxLength={120}
                      onChange={(e) => {
                        setSlugEdited(true);
                        field("slug", e.target.value);
                      }}
                    />
                  </div>
                </label>
                <small>
                  {saved?.url_locked
                    ? "The URL is locked after publication to preserve existing links."
                    : "Use lowercase words and hyphens. The URL is reserved when you save."}
                </small>
                <label>
                  SEO title <small>{data.seoTitle.length}/70</small>
                  <input
                    value={data.seoTitle}
                    maxLength={70}
                    onChange={(e) => field("seoTitle", e.target.value)}
                    placeholder={data.title || "Defaults to the article title"}
                  />
                </label>
                <label>
                  SEO description{" "}
                  <small>{data.seoDescription.length}/180</small>
                  <textarea
                    rows={3}
                    value={data.seoDescription}
                    maxLength={180}
                    onChange={(e) => field("seoDescription", e.target.value)}
                    placeholder={data.excerpt || "Defaults to the excerpt"}
                  />
                </label>
              </section>
              <section className="cms-card cms-field-stack">
                <h2>Sources & context</h2>
                <label>
                  Editorial context
                  <textarea
                    rows={3}
                    value={data.sourceNotes}
                    maxLength={3000}
                    onChange={(e) => field("sourceNotes", e.target.value)}
                    placeholder="Clarify sources, observations, or planning notes when needed"
                  />
                </label>
                {data.sources.map((source, index) => (
                  <div className="cms-source-row" key={index}>
                    <label>
                      Source label
                      <input
                        value={source.label}
                        maxLength={160}
                        onChange={(e) =>
                          field(
                            "sources",
                            data.sources.map((s, i) =>
                              i === index ? { ...s, label: e.target.value } : s,
                            ),
                          )
                        }
                      />
                    </label>
                    <label>
                      Source URL
                      <input
                        value={source.url}
                        maxLength={2000}
                        onChange={(e) =>
                          field(
                            "sources",
                            data.sources.map((s, i) =>
                              i === index ? { ...s, url: e.target.value } : s,
                            ),
                          )
                        }
                      />
                    </label>
                    <button
                      className="cms-secondary"
                      onClick={() =>
                        field(
                          "sources",
                          data.sources.filter((_, i) => i !== index),
                        )
                      }
                      aria-label={`Remove source ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="cms-secondary"
                  disabled={data.sources.length >= 20}
                  onClick={() =>
                    field("sources", [...data.sources, { label: "", url: "" }])
                  }
                >
                  Add source
                </button>
              </section>
            </>
          )}
        </div>
        <aside className="cms-editor-aside" aria-label="Article settings">
          <section className="cms-card cms-field-stack">
            <h2>Publishing</h2>
            <label>
              Status
              <select
                value={data.status}
                onChange={(e) => {
                  const status = e.target.value as PostInput["status"];
                  setData((p) => ({
                    ...p,
                    status,
                    publishedAt:
                      status === "published" && !p.publishedAt
                        ? editorialDate()
                        : p.publishedAt,
                  }));
                }}
              >
                <option value="draft">Draft — private</option>
                <option value="published">Published — public</option>
                <option value="archived">Archived — hidden</option>
              </select>
            </label>
            <label>
              Publication date
              <input
                type="date"
                value={data.publishedAt || ""}
                max={editorialDate()}
                onChange={(e) => field("publishedAt", e.target.value || null)}
              />
            </label>
            <small>
              Dates are editorial dates, not a scheduler. Changes go live only
              after saving.
            </small>
            <label className="cms-checkbox">
              <input
                type="checkbox"
                checked={data.featured}
                onChange={(e) => field("featured", e.target.checked)}
              />
              Feature on the homepage
            </label>
            <small>
              Author: Ahmad Abdullah. The current account’s access does not
              change the public byline.
            </small>
            {saved?.status === "published" && (
              <Link
                href={`/blogs/${saved.slug}`}
                target="_blank"
                className="cms-text-link"
              >
                View published article ↗
              </Link>
            )}
          </section>
          <section className="cms-card cms-field-stack">
            <h2>Organization</h2>
            <label>
              Project
              <select
                value={data.project}
                onChange={(e) => field("project", e.target.value)}
              >
                <option value="">General editorial</option>
                {blogProjects.map((p) => (
                  <option value={p.slug} key={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <input
                value={data.category}
                maxLength={80}
                onChange={(e) => field("category", e.target.value)}
              />
            </label>
            <label>
              Tags
              <input
                value={data.tags.join(", ")}
                onChange={(e) =>
                  field(
                    "tags",
                    e.target.value.split(",").map((t) => t.trimStart()),
                  )
                }
                placeholder="Shopify, UX, Product content"
              />
            </label>
            <small>Separate up to 15 tags with commas.</small>
          </section>
          <section className="cms-card cms-field-stack">
            <h2>Featured image</h2>
            {data.cover && (
              <>
                <BlogImage media={data.cover} />
                <label>
                  Alternative text
                  <input
                    value={data.cover.alt}
                    maxLength={500}
                    onChange={(e) =>
                      field("cover", { ...data.cover!, alt: e.target.value })
                    }
                  />
                </label>
              </>
            )}
            <button
              className="cms-secondary"
              onClick={() => setMediaOpen(true)}
            >
              <ImagePlus size={16} />
              {data.cover ? "Replace image" : "Upload image"}
            </button>
            {data.cover && (
              <button
                className="cms-text-link"
                onClick={() => field("cover", null)}
              >
                Remove featured image
              </button>
            )}
            <small>
              Use genuine project imagery or your own editorial visuals. No
              image is better than an unrelated substitute.
            </small>
          </section>
        </aside>
      </fieldset>
      {mediaOpen && (
        <MediaPicker
          onClose={() => setMediaOpen(false)}
          onChoose={(media) => {
            field("cover", media as PostInput["cover"]);
            setMediaOpen(false);
          }}
        />
      )}
    </>
  );
}
