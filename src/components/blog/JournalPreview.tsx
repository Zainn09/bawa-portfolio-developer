import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles, blogProjects } from "@/data/blog";
import BlogImage from "./BlogImage";

export default function JournalPreview() {
  const featured = [
    articles.find((a) => a.slug === "prime-baby-gear-navigation"),
    articles.find((a) => a.slug === "ollie-burwell-styling-guide"),
    articles.find((a) => a.slug === "nokoluxe-outdoor-living-navigation"),
  ].filter((a) => a !== undefined);
  if (!articles.length)
    return (
      <section className="journal-preview container" id="blogs">
        <h2>The commerce journal.</h2>
        <p>More Shopify insights are coming soon.</p>
      </section>
    );
  return (
    <section
      className="journal-preview"
      id="blogs"
      aria-labelledby="journal-preview-title"
    >
      <div className="container">
        <div className="journal-preview-heading">
          <div>
            <span className="journal-kicker">THE COMMERCE JOURNAL</span>
            <h2 id="journal-preview-title">
              A closer look.
              <br />
              <span>Beyond the storefront.</span>
            </h2>
          </div>
          <div>
            <p>
              Notes on the decisions behind a useful store.
              <br />
              Five brands. Different questions. Details worth exploring.
            </p>
            <Link href="/blogs" className="journal-text-link">
              Explore all {articles.length} articles <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="journal-preview-grid">
          {featured.map((a, i) => (
            <article
              key={a.slug}
              className={
                i === 0 ? "journal-preview-lead" : "journal-preview-note"
              }
            >
              <Link href={`/blogs/${a.slug}`} className="journal-story-link">
                <BlogImage
                  media={a.featuredImage}
                  sizes={
                    i === 0
                      ? "(max-width:767px) 90vw, 55vw"
                      : "(max-width:767px) 90vw, 220px"
                  }
                />
                <div>
                  <div className="journal-meta">
                    <span>
                      {blogProjects.find((p) => p.slug === a.project)?.name}
                    </span>
                    <span>{a.readingMinutes} MIN READ</span>
                  </div>
                  <h3>{a.title}</h3>
                  {i === 0 && <p>{a.excerpt}</p>}
                  <span className="journal-read">
                    Read the note <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="journal-brand-index">
          <span>READ BY STORE</span>
          {blogProjects.map((p) => (
            <Link key={p.slug} href={`/blogs?project=${p.slug}`}>
              {p.name}
              <small>
                {articles
                  .filter((a) => a.project === p.slug)
                  .length.toString()
                  .padStart(2, "0")}
              </small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
