import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { profile, projects } from "@/data/portfolio";
import {
  serviceBySlug,
  servicePages,
  type ServicePageData,
} from "@/data/services";

const upper: Record<string, string> = { qa: "QA" };
function schemaName(slug: string): string {
  return slug
    .split("-")
    .map((w) => upper[w] ?? (w[0]?.toUpperCase() ?? w) + w.slice(1))
    .join(" ");
}

interface Props {
  data: ServicePageData;
  slug: string;
  site?: string;
}

export default function ServicePage({ data, slug, site }: Props) {
  const name = schemaName(slug);
  const isHub = slug === "shopify-development";
  const caseStudies = data.relatedCaseStudies
    .map((cs) => projects.find((p) => p.slug === cs))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const related = isHub
    ? servicePages
    : data.relatedServices.map((rs) => serviceBySlug[rs]).filter(Boolean);

  const jsonLd = site
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            name,
            url: `${site}/${slug}`,
            description: data.description,
            serviceType: name,
            areaServed: "Online",
            provider: {
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
            itemListElement: isHub
              ? [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: site,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Shopify development",
                    item: `${site}/shopify-development`,
                  },
                ]
              : [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: site,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Shopify development",
                    item: `${site}/shopify-development`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name,
                    item: `${site}/${slug}`,
                  },
                ],
          },
        ],
      }
    : null;

  return (
    <main id="main" className="service-page">
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
          <Link href="/">
            <ArrowLeft size={15} /> Home
          </Link>
          <span>/</span>
          {isHub ? (
            <span>Shopify development</span>
          ) : (
            <>
              <Link href="/shopify-development">Shopify development</Link>
              <span>/</span>
              <span>{name}</span>
            </>
          )}
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
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
      {data.faqs.length > 0 && (
        <section className="service-faq container" aria-labelledby="faq-title">
          <span className="journal-kicker">FAQ</span>
          <h2 id="faq-title">Common questions</h2>
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
        aria-labelledby="related-services-title"
      >
        <div className="service-links-side">
          <span className="journal-kicker">EXPLORE THE WORK</span>
          <h2 id="related-services-title">Stores behind the service.</h2>
          <p>
            Real Shopify stores, documented honestly in the journal — the public
            storefront and the approach applied to it, without unmeasured
            results.
          </p>
          {data.journalLink && (
            <Link href={data.journalLink.href}>
              {data.journalLink.label} <ArrowUpRight size={15} />
            </Link>
          )}
        </div>
        <div className="service-study-grid">
          {caseStudies.map((project) => (
            <article key={project.slug}>
              <Link href={`/case-studies/${project.slug}`}>
                <img
                  src={project.thumbnail}
                  alt={project.imageAlt || `${project.title} storefront`}
                  width={430}
                  height={280}
                  loading="lazy"
                />
                <span className="service-study-meta">{project.industry}</span>
                <div className="service-study-title">
                  <h3>{project.title}</h3>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      {related.length > 0 && (
        <section
          className="service-related container"
          aria-label="Related services"
        >
          <span className="journal-kicker">
            {isHub ? "ALL SERVICES" : "RELATED SERVICES"}
          </span>
          <div className="service-related-list">
            {related.map((r) => (
              <Link key={r.slug} href={`/${r.slug}`}>
                {schemaName(r.slug)} <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="service-cta container">
        <div>
          <span className="journal-kicker">PUT IT TO WORK</span>
          <h2>
            Talk through your
            <br />
            store’s next step.
          </h2>
        </div>
        <Link href="/#contact">
          Start a conversation <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
