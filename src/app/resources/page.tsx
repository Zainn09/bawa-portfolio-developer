import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { resources } from "@/data/resources";

const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
export const metadata: Metadata = {
  title: "Shopify Guides & Checklists | Ahmad Abdullah",
  description:
    "Practical Shopify resources: theme development, store launch, QA, checkout, Plus, mobile, and performance — written as guides and checklists from real development and testing work.",
  ...(site ? { alternates: { canonical: "/resources" } } : {}),
  openGraph: {
    type: "website",
    title: "Shopify Guides & Checklists",
    description:
      "Practical Shopify resources written from real development and testing work.",
    ...(site ? { url: "/resources" } : {}),
  },
  robots: { index: Boolean(site), follow: true },
};

const jsonLd = site
  ? {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: "Shopify guides and checklists",
          url: `${site}/resources`,
          description:
            "Practical Shopify resources: theme development, store launch, QA, checkout, Plus, mobile, and performance.",
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
              name: "Guides & checklists",
              item: `${site}/resources`,
            },
          ],
        },
      ],
    }
  : null;

export default function ResourcesIndex() {
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
        <span className="journal-kicker">GUIDES &amp; CHECKLISTS</span>
        <h1>
          Practical resources,
          <br />
          <span>from real store work.</span>
        </h1>
        <p className="service-lede">
          Guides and checklists for the parts of Shopify that actually need them
          — written from the development and testing work on the stores in the
          journal, and linked to the service each one describes.
        </p>
      </header>
      <div className="resource-index container">
        {resources.map((resource) => (
          <a key={resource.slug} href={`/resources/${resource.slug}`}>
            <span className="resource-index-kicker">
              {resource.kicker.split("/")[1]?.trim() ?? "RESOURCE"} ·{" "}
              {resource.relatedServices.length} SERVICE
              {resource.relatedServices.length > 1 ? "S" : ""}
            </span>
            <h2>
              {resource.h1} {resource.h1Accent}
            </h2>
            <p>{resource.lede}</p>
            <span className="case-index-more">
              {resource.kind === "CHECKLIST"
                ? "Open the checklist"
                : "Read the guide"}{" "}
              <ArrowUpRight size={15} />
            </span>
          </a>
        ))}
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
