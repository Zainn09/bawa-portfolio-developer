"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, Search, X } from "lucide-react";
import type { ArticleSummary } from "@/data/blog";
import { blogProjects } from "@/data/blog/catalog";
import { track } from "@/lib/analytics";
import BlogImage from "./BlogImage";

export default function JournalIndex({ items }: { items: ArticleSummary[] }) {
  const [project, setProject] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(8);
  const categories = useMemo(
    () => [...new Set(items.map((a) => a.category))].sort(),
    [items],
  );
  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(location.search);
      const p = params.get("project") || "";
      setProject(blogProjects.some((x) => x.slug === p) ? p : "");
      setQuery((params.get("q") || "").slice(0, 120));
      const c = params.get("category") || "";
      setCategory(categories.includes(c) ? c : "");
      setLimit(8);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [categories]);
  function update(p = project, q = query, c = category) {
    setProject(p);
    setQuery(q);
    setCategory(c);
    setLimit(8);
    const params = new URLSearchParams();
    if (p) params.set("project", p);
    if (q) params.set("q", q);
    if (c) params.set("category", c);
    history.replaceState(
      null,
      "",
      `${location.pathname}${params.size ? `?${params}` : ""}`,
    );
  }
  const filtered = items.filter(
    (a) =>
      (!project || a.project === project) &&
      (!category || a.category === category) &&
      `${a.title} ${a.excerpt} ${a.tags.join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="journal-catalogue">
      <div className="journal-filters">
        <div
          className="journal-store-filters"
          aria-label="Filter articles by store"
        >
          <button aria-pressed={!project} onClick={() => update("")}>
            All stores <span>{items.length}</span>
          </button>
          {blogProjects.map((p) => (
            <button
              key={p.slug}
              aria-pressed={project === p.slug}
              onClick={() => {
                update(p.slug);
                track("blog_filter", { project: p.slug });
              }}
            >
              {p.name}
              <span>{items.filter((a) => a.project === p.slug).length}</span>
            </button>
          ))}
        </div>
        <div className="journal-search-row">
          <label className="journal-search">
            <Search size={18} />
            <span className="journal-sr-only">Search articles</span>
            <input
              type="search"
              placeholder="A topic, a question, a detail…"
              value={query}
              onChange={(e) => update(project, e.target.value)}
              maxLength={120}
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => update(project, "")}
              >
                <X size={17} />
              </button>
            )}
          </label>
          <label className="journal-category">
            <span>TOPIC</span>
            <select
              aria-label="Filter articles by topic"
              value={category}
              onChange={(e) => update(project, query, e.target.value)}
            >
              <option value="">All topics</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="journal-results-line">
        <p role="status">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {project
            ? ` / ${blogProjects.find((p) => p.slug === project)?.name}`
            : " / All stores"}
        </p>
        {(project || category || query) && (
          <button onClick={() => update("", "", "")}>
            Reset filters <X size={12} />
          </button>
        )}
        <span>OBSERVATIONS, NOT INVENTED OUTCOMES</span>
      </div>
      {filtered.length ? (
        <div className="journal-card-grid">
          {filtered.slice(0, limit).map((a) => (
            <article className="journal-card" key={a.slug}>
              <Link
                href={`/blogs/${a.slug}`}
                onClick={() => track("blog_open", { article: a.slug })}
              >
                <BlogImage
                  media={a.featuredImage}
                  sizes="(max-width:767px) 90vw, (max-width:1600px) 43vw, 650px"
                />
                <div className="journal-card-copy">
                  <div className="journal-meta">
                    <span>
                      {blogProjects.find((p) => p.slug === a.project)?.name}
                    </span>
                    <span>{a.category}</span>
                  </div>
                  <h2>{a.title}</h2>
                  <p>{a.excerpt}</p>
                  <div className="journal-card-bottom">
                    <span>{a.readingMinutes} MIN READ</span>
                    <ArrowUpRight size={21} />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="journal-empty">
          <span>NOTHING ON THIS SHELF. YET.</span>
          <h2>No notes match that search.</h2>
          <p>Try another topic, or return to the full journal.</p>
          <button
            className="button button-outline"
            onClick={() => update("", "", "")}
          >
            Show all articles <ArrowUpRight size={16} />
          </button>
        </div>
      )}
      {filtered.length > limit && (
        <div className="journal-load-more">
          <button
            className="button button-outline"
            onClick={() => setLimit((n) => n + 8)}
          >
            More from the journal <ArrowDown size={17} />
          </button>
          <span>
            {Math.min(limit, filtered.length)} OF {filtered.length} ARTICLES
          </span>
        </div>
      )}
    </div>
  );
}
