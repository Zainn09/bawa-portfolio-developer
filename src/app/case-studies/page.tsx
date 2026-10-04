import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { projects } from "@/data/portfolio";

const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
export const metadata: Metadata = {
  title: "Case Studies — Shopify Development & QA | Ahmad Abdullah",
  description:
    "Real Shopify stores — Prime Baby Gear, Ollie Burwell, Nokoluxe, Vintage Art Garage, and Paw by Four — documented through the journal with captured storefront evidence, without invented metrics.",
  ...(site ? { alternates: { canonical: "/case-studies" } } : {}),
  openGraph: {
    type: "website",
    title: "Case Studies — Shopify Development & QA",
    description:
      "Real Shopify stores, documented through the journal with captured storefront evidence.",
    ...(site ? { url: "/case-studies" } : {}),
  },
  robots: { index: Boolean(site), follow: true },
};

const jsonLd = site
  ? {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: "Case studies",
          url: `${site}/case-studies`,
          description:
            "Real Shopify stores documented through the journal with captured storefront evidence.",
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
          ],
        },
      ],
    }
  : null;

export default function CaseStudiesIndex() {
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
        <span className="journal-kicker">CASE STUDIES</span>
        <h1>
          Real stores,
          <br />
          <span>documented honestly.</span>
        </h1>
        <p className="service-lede">
          Five Shopify stores, each followed by seven journal entries built on
          captured screenshots from the public storefront. The case studies
          describe the work and the reasoning — without performance numbers that
          were never measured.
        </p>
      </header>
      <div className="case-index container">
        {caseStudies.map((study) => {
          const project = projects.find((p) => p.slug === study.project)!;
          return (
            <a key={study.project} href={`/case-studies/${study.project}`}>
              <div className="case-index-thumb">
                <img
                  src={`/images/projects/latest/${study.project}.webp`}
                  alt={`${project.title} storefront photography`}
                  width={430}
                  height={280}
                  loading="lazy"
                />
              </div>
              <div className="case-index-copy">
                <span className="service-study-meta">
                  {project.industry}
                  {study.note ? " · temporarily closed" : ""}
                </span>
                <h2>{project.title}</h2>
                <p>{study.projectDescription}</p>
                <span className="case-index-more">
                  Read the case study <ArrowUpRight size={15} />
                </span>
              </div>
            </a>
          );
        })}
      </div>
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
