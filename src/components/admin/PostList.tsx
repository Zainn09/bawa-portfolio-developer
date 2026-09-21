"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, ArrowUpRight } from "lucide-react";
export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  updated_at: string;
  featured: boolean;
};
export default function PostList({
  posts,
  loadError,
}: {
  posts: PostSummary[];
  loadError?: string;
}) {
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [busy, setBusy] = useState(false),
    [feedback, setFeedback] = useState("");
  const router = useRouter();
  const filtered = posts.filter(
    (p) =>
      (status === "all" || p.status === status) &&
      `${p.title} ${p.category} ${p.slug}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  async function importPosts() {
    if (
      !confirm(
        "Import the 35 supplied articles? Existing slugs will be left untouched.",
      )
    )
      return;
    setBusy(true);
    setFeedback("");
    try {
      const r = await fetch("/api/admin/import", { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setFeedback(
        `${d.imported} articles imported. Existing articles were not overwritten.`,
      );
      router.refresh();
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header className="cms-page-heading">
        <div>
          <span className="cms-eyebrow">THE COMMERCE JOURNAL</span>
          <h1>Articles</h1>
          <p>Your ideas, from the first draft to the published page.</p>
        </div>
        <Link href="/admin/posts/new" className="cms-primary">
          <Plus size={18} /> New article
        </Link>
      </header>
      <div className="cms-stats">
        {["published", "draft", "archived"].map((s) => (
          <div key={s}>
            <strong>{posts.filter((p) => p.status === s).length}</strong>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <section className="cms-card">
        <div className="cms-list-tools">
          <label className="cms-search">
            <Search size={18} />
            <input
              aria-label="Search articles"
              placeholder="Search title, category, or URL…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {loadError ? (
          <p role="alert" className="cms-error">
            {loadError}
          </p>
        ) : filtered.length ? (
          <div className="cms-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Last edited</th>
                  <th>
                    <span className="cms-visually-hidden">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/posts/${p.id}`}>{p.title}</Link>
                      <small>
                        /blogs/{p.slug}
                        {p.featured ? " · Featured" : ""}
                      </small>
                    </td>
                    <td>
                      <span className={`cms-badge ${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      {new Date(p.updated_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </td>
                    <td>
                      <Link
                        aria-label={`Edit ${p.title}`}
                        href={`/admin/posts/${p.id}`}
                      >
                        <ArrowUpRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="cms-empty">
            <h2>
              {posts.length
                ? "No matching articles."
                : "Your next chapter starts here."}
            </h2>
            <p>
              {posts.length
                ? "Try another search or status."
                : "Create an article, or import the 35 supplied notes to edit your existing journal."}
            </p>
          </div>
        )}
      </section>
      <div className="cms-import">
        <p>
          Existing journal content can be imported once, then edited here.
          Repeating the import never overwrites an existing slug.
        </p>
        <button
          className="cms-secondary"
          disabled={busy || !!loadError}
          onClick={importPosts}
        >
          {busy ? "Importing…" : "Import supplied articles"}
        </button>
        {feedback && <p role="status">{feedback}</p>}
      </div>
    </>
  );
}
