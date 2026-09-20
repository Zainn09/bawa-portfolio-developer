import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles, summarize } from "@/data/blog";
import JournalIndex from "@/components/blog/JournalIndex";
const site = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: "The Commerce Journal — Shopify & Storefront Notes",
  description:
    "35 focused articles across five Shopify stores. Read observations and practical guidance on UX, product information, SEO, performance, and store management.",
  ...(site ? { alternates: { canonical: "/blogs" } } : {}),
  openGraph: {
    title: "The Commerce Journal",
    description: "A closer look at the decisions behind a useful storefront.",
    type: "website",
    ...(site
      ? {
          url: "/blogs",
          images: ["/images/blog/prime-baby-gear/desktop-home-hero.webp"],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "The Commerce Journal",
    description: "Notes on better commerce, grounded in five real stores.",
    ...(site
      ? { images: ["/images/blog/prime-baby-gear/desktop-home-hero.webp"] }
      : {}),
  },
};
export default function BlogsPage() {
  return (
    <main id="main" className="journal-page">
      <div className="container">
        <header className="journal-masthead">
          <div className="journal-masthead-top">
            <span className="journal-kicker">
              FIELD NOTES / THE COMMERCE JOURNAL
            </span>
            <Link href="/#work">
              Back to the work <ArrowUpRight size={15} />
            </Link>
          </div>
          <h1>
            Commerce,
            <br />
            <span>considered.</span>
          </h1>
          <div className="journal-masthead-bottom">
            <p>
              A closer look at what makes a store useful.
              <br />
              Product decisions. Thoughtful interfaces. The work between the
              pixels.
            </p>
            <div>
              <strong>{articles.length.toString().padStart(2, "0")}</strong>
              <span>
                ARTICLES
                <br />
                FIVE STOREFRONTS
              </span>
            </div>
          </div>
        </header>
        <JournalIndex items={articles.map(summarize)} />
        <p className="journal-editorial-note">
          These articles distinguish visible storefront observations from
          recommended practices. They do not claim unverified development work,
          technologies, or commercial results. Source captures date from
          September 2026; live stores may have changed.
        </p>
      </div>
    </main>
  );
}
