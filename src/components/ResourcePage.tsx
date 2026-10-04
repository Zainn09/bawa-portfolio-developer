import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { dateLabel } from "@/data/blog";
import { articles } from "@/data/blog";
import { profile, projects } from "@/data/portfolio";
import type { ResourceData } from "@/data/resources";

interface Props {
  data: ResourceData;
  site?: string;
}

export default function ResourcePage({ data, site }: Props) {
  const serviceNames: Record<string, string> = {
    "shopify-development": "Shopify development services",
    "shopify-theme-development": "Shopify theme development",
    "shopify-store-development": "Shopify store development",
    "shopify-qa-testing": "Shopify QA and testing",
    "shopify-plus": "Shopify Plus development & QA",
    "shopify-store-maintenance": "Shopify store maintenance",
    "shopify-checkout-testing": "Shopify checkout testing",
    "shopify-mobile-testing": "Shopify mobile testing",
    "shopify-performance-testing": "Shopify performance testing",
    "shopify-accessibility-testing": "Shopify accessibility testing",
    "shopify-regression-testing": "Shopify regression testing",
  };
  const storeArticles = data.relatedArticles
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const caseStudies = data.relatedCaseStudies
    .map((cs) => projects.find((p) => p.slug === cs))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLd = site
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: data.h1 + " " + data.h1Accent,
            description: data.description,
            mainEntityOfPage: `${site}/resources/${data.slug}`,
            author: { "@type": "Person", name: profile.name, url: site },
            publisher: {
              "@type": "Person",
              name: profile.name,
              url: site,
            },
          },
          ...(data.faqs.length
            ? [
                {
                  "@type": "FAQPage",
                  mainEntity: data.faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                },
              ]
            : []),
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
                name: "Guides and checklists",
                item: `${site}/resources`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: data.h1 + " " + data.h1Accent,
                item: `${site}/resources/${data.slug}`,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <main id="main" className="service-page resource-page">
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
          <a href="/resources">Guides &amp; checklists</a>
          <span>/</span>
          <span>{data.kicker.split("/")[1]?.trim() ?? "Resource"}</span>
        </nav>
        <span className="journal-kicker">{data.kicker}</span>
        <h1>
          {data.h1}
          <br />
          <span>{data.h1Accent}</span>
        </h1>
        <p className="service-lede">{data.lede}</p>
      </header>
      <div className="service-body container">
        {data.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul className="resource-checklist">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
      {data.faqs.length > 0 && (
        <section
          className="service-faq container"
          aria-labelledby="resource-faq-title"
        >
          <span className="journal-kicker">FAQ</span>
          <h2 id="resource-faq-title">Common questions</h2>
          <div className="faq-list">
            {data.faqs.map((faq) => (
              <div className="faq-item" key={faq.q}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <section
        className="service-links container"
        aria-labelledby="resource-services-title"
      >
        <div className="service-links-side">
          <span className="journal-kicker">PUT IT TO WORK</span>
          <h2 id="resource-services-title">
            The services behind
            <br />
            this page.
          </h2>
          <p>
            Each of these guides describes a service that is offered — start
            with the one closest to what your store needs.
          </p>
          <div className="service-related-list resource-service-links">
            {data.relatedServices.map((slug) => (
              <a key={slug} href={`/${slug}`}>
                {serviceNames[slug] ?? slug} <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
        <div>
          {caseStudies.length > 0 && (
            <>
              <span className="journal-kicker">SEE IT IN THE WORK</span>
              <div className="service-study-grid">
                {caseStudies.map((project) => (
                  <article key={project.slug}>
                    <a href={`/case-studies/${project.slug}`}>
                      <img
                        src={`/images/projects/latest/${project.slug}.webp`}
                        alt={project.imageAlt || `${project.title} storefront`}
                        width={430}
                        height={280}
                        loading="lazy"
                      />
                      <span className="service-study-meta">
                        {project.industry}
                      </span>
                      <div className="service-study-title">
                        <h3>{project.title}</h3>
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </>
          )}
          {storeArticles.length > 0 && (
            <>
              <span className="journal-kicker">FROM THE JOURNAL</span>
              <div className="case-article-list">
                {storeArticles.map((article) => (
                  <a key={article.slug} href={`/blogs/${article.slug}`}>
                    <span className="case-article-meta">
                      {article.category} · {dateLabel(article.publishedAt)}
                    </span>
                    <span className="case-article-title">{article.title}</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <section className="service-cta container">
        <div>
          <span className="journal-kicker">PUT IT TO WORK</span>
          <h2>
            Bring the checklist
            <br />
            to your store.
          </h2>
        </div>
        <a href="/#contact">
          Start a conversation <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}
