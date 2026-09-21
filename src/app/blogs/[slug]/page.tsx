import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { blogProjects, dateLabel } from "@/data/blog";
import { profile } from "@/data/portfolio";
import BlogImage from "@/components/blog/BlogImage";
import ArticleTools from "@/components/blog/ArticleTools";

import { getPublishedArticles, publishedArticle } from "@/lib/cms/public";
import RichContent, { richHeadings } from "@/components/blog/RichContent";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await publishedArticle(slug);
  if (!a)
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    };
  const image = a.featuredImage.src;
  return {
    title: `${a.seoTitle} | The Commerce Journal`,
    description: a.seoDescription,
    ...(site ? { alternates: { canonical: `/blogs/${slug}` } } : {}),
    openGraph: {
      type: "article",
      title: a.seoTitle,
      description: a.seoDescription,
      publishedTime: a.publishedAt,
      ...(a.updatedAt ? { modifiedTime: a.updatedAt } : {}),
      authors: [profile.name],
      ...(site
        ? {
            url: `/blogs/${slug}`,
            ...(image
              ? {
                  images: [
                    {
                      url: image,
                      width: a.featuredImage.width,
                      height: a.featuredImage.height,
                      alt: a.featuredImage.alt,
                    },
                  ],
                }
              : { images: [] }),
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: a.seoTitle,
      description: a.seoDescription,
      images: site && image ? [image] : [],
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = await publishedArticle(slug);
  if (!a) notFound();
  const project = blogProjects.find((p) => p.slug === a.project) || {
    name: "commerce",
    slug: "",
    url: "",
  };
  const related = (await getPublishedArticles())
    .filter((p) => p.slug !== a.slug && p.project === a.project)
    .slice(0, 3);
  const vintage = a.project === "vintage-art-garage";
  const jsonLd = site
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "@id": `${site}/blogs/${slug}#article`,
            headline: a.title,
            description: a.seoDescription,
            datePublished: a.publishedAt,
            ...(a.updatedAt ? { dateModified: a.updatedAt } : {}),
            author: { "@type": "Person", name: profile.name, url: site },
            mainEntityOfPage: `${site}/blogs/${slug}`,
            articleSection: a.category,
            ...(a.featuredImage.src
              ? { image: [new URL(a.featuredImage.src, site).href] }
              : {}),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blogs",
                item: `${site}/blogs`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: a.title,
                item: `${site}/blogs/${slug}`,
              },
            ],
          },
        ],
      }
    : null;
  return (
    <main id="main" className="journal-article">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <article>
        <header className="article-header container">
          <div className="article-breadcrumb">
            <Link href="/blogs">
              <ArrowLeft size={15} /> The journal
            </Link>
            <span>/</span>
            <Link href={`/blogs?project=${a.project}`}>{project.name}</Link>
          </div>
          <div className="article-category">
            <span className="journal-kicker">{a.category}</span>
            <span>
              {vintage
                ? "PLANNING NOTE"
                : a.project
                  ? "STOREFRONT NOTE"
                  : "EDITORIAL NOTE"}
            </span>
          </div>
          <h1>{a.title}</h1>
          <p className="article-deck">{a.excerpt}</p>
          <div className="article-byline">
            <div className="article-author-mark" aria-hidden="true">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <strong>{profile.name}</strong>
              <span>{profile.title}</span>
            </div>
            <div className="article-date">
              <time dateTime={a.publishedAt}>{dateLabel(a.publishedAt)}</time>
              <span>
                {a.readingMinutes} min read
                {a.updatedAt ? ` · Updated ${dateLabel(a.updatedAt)}` : ""}
              </span>
            </div>
            <ArticleTools slug={slug} />
          </div>
        </header>
        <div className="article-feature container">
          <BlogImage media={a.featuredImage} priority caption zoom />
        </div>
        <div className="article-layout container">
          <aside className="article-sidebar">
            <span className="journal-kicker">IN THIS NOTE</span>
            <nav aria-label="Article contents">
              {(a.richContent
                ? richHeadings(a.richContent).map((h) => ({
                    heading: h.text,
                    id: h.id,
                  }))
                : a.sections.map((s, i) => ({ ...s, id: `section-${i}` }))
              ).map((s, i) => (
                <a key={s.id} href={`#${s.id}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </a>
              ))}
              <a href="#article-sources">
                <span>↗</span>Sources & context
              </a>
            </nav>
            <Link
              className="article-store-index"
              href={`/blogs?project=${a.project}`}
            >
              More on {project.name}
              <ArrowUpRight size={16} />
            </Link>
          </aside>
          <div className="article-prose" id="article-body">
            {a.richContent ? (
              <RichContent document={a.richContent} />
            ) : (
              <>
                <div className="article-scope">
                  <span>
                    {vintage
                      ? "A CLEAR SOURCE BOUNDARY"
                      : "OBSERVATION + PRACTICE"}
                  </span>
                  <p>
                    {vintage
                      ? "The supplied repository contains no accepted storefront captures for Vintage Art Garage. This is a planning note based on the documented business category and closure, not an account of unseen pages or completed work."
                      : "Based on supplied storefront captures and public content. Recommendations are distinguished from observations; implementation ownership and commercial results are not inferred."}
                  </p>
                </div>
                <p className="article-intro">{a.intro}</p>
                {a.sections.map((s, i) => (
                  <section key={s.heading} id={`section-${i}`}>
                    <h2>{s.heading}</h2>
                    {s.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {a.inlineImages[i] && (
                      <BlogImage
                        media={a.inlineImages[i]}
                        caption
                        zoom
                        sizes="(max-width:767px) 90vw, 760px"
                      />
                    )}
                  </section>
                ))}
                <aside className="article-takeaway">
                  <span>THE DETAIL TO KEEP</span>
                  <p>{a.takeaway}</p>
                </aside>
                {a.mobileImages.length > 0 && (
                  <section className="article-mobile-section">
                    <div>
                      <span className="journal-kicker">THE NARROWER VIEW</span>
                      <h2>
                        {vintage
                          ? "Space for approved mobile captures."
                          : "The same store. A smaller canvas."}
                      </h2>
                      <p>
                        {vintage
                          ? "These slots are ready for genuine mobile screenshots when they become available."
                          : "Two supplied mobile views from this store. Open either image to inspect it at its original resolution."}
                      </p>
                    </div>
                    <div className="article-mobile-pair">
                      {a.mobileImages.map((image, i) => (
                        <BlogImage
                          key={image.src || i}
                          media={image}
                          caption
                          zoom
                          sizes="(max-width:479px) 90vw, (max-width:767px) 43vw, 360px"
                        />
                      ))}
                    </div>
                  </section>
                )}
                {a.comparisonImages.length > 0 && (
                  <section>
                    <h2>Documented comparison</h2>
                    <div className="article-comparison">
                      {a.comparisonImages.map((media, i) => (
                        <BlogImage
                          key={media.src || i}
                          media={media}
                          caption
                          zoom
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
            <section className="article-sources" id="article-sources">
              <span className="journal-kicker">SOURCES & CONTEXT</span>
              <ul>
                {a.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                ))}
              </ul>
              {a.richContent ? (
                a.sourceNotes && <p>{a.sourceNotes}</p>
              ) : (
                <p>
                  Source captures are dated 20 September 2026. A screenshot
                  documents a visible state, not its author, source code,
                  measured performance, or current availability. No sales,
                  ranking, or conversion result is claimed.
                </p>
              )}
              <div className="article-tags">
                {a.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </section>
            <div className="article-cta">
              <span>PUT THE QUESTION TO WORK</span>
              <h2>
                Have a similar detail
                <br />
                to figure out?
              </h2>
              <Link href="/#contact">
                Let’s look at your store <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </article>
      <section
        className="article-related container"
        aria-labelledby="related-title"
      >
        <div>
          <span className="journal-kicker">KEEP EXPLORING</span>
          <h2 id="related-title">Another angle on {project.name}.</h2>
          <Link href={`/blogs?project=${a.project}`}>
            More articles <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="article-related-grid">
          {related.map((r) => (
            <article key={r.slug}>
              <Link href={`/blogs/${r.slug}`}>
                <BlogImage
                  media={r.featuredImage}
                  sizes="(max-width: 767px) 90vw, (max-width: 1600px) 28vw, 430px"
                />
                <span className="article-related-meta">
                  {r.category} / {r.readingMinutes} MIN READ
                </span>
                <div className="article-related-title">
                  <h3>{r.title}</h3>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
