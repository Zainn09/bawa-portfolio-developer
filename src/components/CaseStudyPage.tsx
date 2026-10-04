import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { dateLabel } from "@/data/blog";
import { profile, projects } from "@/data/portfolio";
import type { CaseStudy } from "@/data/case-studies";

interface Props {
  data: CaseStudy;
  site?: string;
}

export default function CaseStudyPage({ data, site }: Props) {
  const project = projects.find((p) => p.slug === data.project)!;
  const jsonLd = site
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            name: `${data.projectTitle} — Shopify development & QA case study`,
            url: `${site}/case-studies/${data.project}`,
            description: `${data.projectDescription} Documented through the journal with captured storefront evidence.`,
            isPartOf: { "@type": "WebSite", name: profile.name, url: site },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: site,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Case studies",
                item: `${site}/case-studies`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: data.projectTitle,
                item: `${site}/case-studies/${data.project}`,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <main id="main" className="service-page case-study-page">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <header className="service-header container">
        <nav className="service-breadcrumb" aria-label="Breadcrumb">
          <a href="/">
            <ArrowLeft size={15} /> Home
          </a>
          <span>/</span>
          <a href="/case-studies">Case studies</a>
          <span>/</span>
          <span>{data.projectTitle}</span>
        </nav>
        <span className="journal-kicker">
          CASE STUDY / {project.industry.toUpperCase()}
        </span>
        <h1>
          {data.h1}
          <br />
          <span>{data.h1Accent}</span>
        </h1>
        <p className="service-lede">{data.projectDescription}</p>
        {data.note && (
          <p className="case-study-note">
            <strong>Note:</strong> {data.note}
          </p>
        )}
      </header>
      <div className="service-body container">
        <section className="case-role">
          <span className="journal-kicker">ROLE</span>
          <h2>{data.role}</h2>
          <p>
            The development and QA practice here is the same one the service
            pages describe: build against the storefront’s real structure, then
            test it the way a customer actually uses the store.
          </p>
        </section>
        {data.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      <section
        className="service-links container"
        aria-labelledby="journal-title"
      >
        <div className="service-links-side">
          <span className="journal-kicker">THE JOURNAL</span>
          <h2 id="journal-title">
            Seven entries follow
            <br />
            this store.
          </h2>
          <p>
            Each entry is based on the public storefront, with captured
            screenshots and the reasoning worked through in full.
          </p>
        </div>
        <div className="case-article-list">
          {data.articles.map((article) => (
            <a key={article.slug} href={`/blogs/${article.slug}`}>
              <span className="case-article-meta">
                {article.category} · {dateLabel(article.publishedAt)}
              </span>
              <span className="case-article-title">{article.title}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
      <section
        className="service-related container"
        aria-label="More case studies and services"
      >
        <span className="journal-kicker">KEEP EXPLORING</span>
        <div className="service-related-list">
          <a href="/case-studies">
            All case studies <ArrowUpRight size={14} />
          </a>
          <a href="/shopify-development">
            Shopify development services <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
      <section className="service-cta container">
        <div>
          <span className="journal-kicker">PUT IT TO WORK</span>
          <h2>
            Your store deserves
            <br />
            the same care.
          </h2>
        </div>
        <a href="/#contact">
          Start a conversation <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}
