import MotionEnhancements from "@/components/MotionEnhancements";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Ecosystem from "@/components/Ecosystem";
import { Expertise, CustomTheme, Optimization } from "@/components/Expertise";
import {
  Process,
  Transformation,
  Management,
  ResponsiveShowcase,
} from "@/components/Process";
import About from "@/components/About";
import Contact from "@/components/Contact";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import { SectionLabel } from "@/components/shared";
import { profile } from "@/data/portfolio";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export default function Home() {
  const jsonLd = siteUrl
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: "Commerce, Crafted — Shopify Developer",
          },
          ...(profile.name !== "[YOUR NAME]"
            ? [
                {
                  "@type": "Person",
                  "@id": `${siteUrl}/#person`,
                  name: profile.name,
                  jobTitle: profile.title,
                  url: siteUrl,
                  ...(profile.socials.length
                    ? { sameAs: profile.socials.map((s) => s.url) }
                    : {}),
                },
              ]
            : []),
        ],
      }
    : null;
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <MotionEnhancements />
      <Navigation />
      <main id="main">
        <Hero />
        <section id="intro" className="intro-section container">
          <div>
            <SectionLabel>
              THE PERSON. THE PROCESS. THE WHOLE PICTURE.
            </SectionLabel>
            <h2>
              More than a Shopify developer.
              <br />
              <span className="muted">A partner for the whole journey.</span>
            </h2>
          </div>
          <div>
            <p>
              I build and manage Shopify stores from the ground up—connecting
              custom development, product data, SEO, performance, and the
              details that turn browsing into buying.
            </p>
            <div className="intro-tags">
              {[
                "SHOPIFY",
                "SHOPIFY PLUS",
                "LIQUID",
                "JAVASCRIPT",
                "HTML / CSS",
                "SEO",
                "CRO",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </section>
        <TrustBadges />
        <Work />
        <Ecosystem />
        <Expertise />
        <CustomTheme />
        <Optimization />
        <Process />
        <Transformation />
        <Management />
        <ResponsiveShowcase />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
