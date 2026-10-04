import type { Metadata, Viewport } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SiteMetrics from "@/components/SiteMetrics";
import { profile } from "@/data/portfolio";
import "@/styles/variables.css";
import "@/styles/globals.css";
import "@/styles/sections.css";
import "@/styles/responsive.css";
import "@/styles/refinements.css";
import "@/styles/typography.css";
import "@/styles/atelier.css";
import "@/styles/showroom.css";
import "@/styles/mobile.css";
import "@/styles/blog.css";
import "@/styles/readability.css";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
// GA4 + AdSense run on the production deployment; local previews stay
// telemetry-free. ENABLE_ANALYTICS=1 is the escape hatch for non-Vercel
// production hosts. The tags are plain <script> elements in the raw HTML
// head (not next/script) so third-party verification scanners see the exact
// tags Google's instructions specify.
const analyticsEnabled =
  process.env.VERCEL === "1" || process.env.ENABLE_ANALYTICS === "1";
const gaMeasurementId = process.env.GA_MEASUREMENT_ID || "G-JZZR2B3JTH";
const adSenseClientId =
  process.env.GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-4078729434854717";
export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: `Shopify Developer — Themes, Store QA & Plus | ${profile.name}`,
  description:
    "Shopify & Shopify Plus theme development, store builds, and QA — Liquid, checkout, performance, and accessibility testing, from first section to launch.",
  openGraph: {
    title: "Not just stores. Commerce experiences.",
    description:
      "Custom Shopify and Shopify Plus themes, store development, and quality assurance — from the first section to the final test.",
    type: "website",
    ...(siteUrl
      ? {
          images: [
            {
              url: "/images/hero-store-placeholder.webp",
              width: 1400,
              height: 933,
              alt: "A considered Shopify storefront concept",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Commerce, Crafted — Shopify Developer",
    description:
      "Custom Shopify and Shopify Plus themes, store development, and quality assurance.",
    ...(siteUrl ? { images: ["/images/hero-store-placeholder.webp"] } : {}),
  },
  robots: { index: !!siteUrl, follow: !!siteUrl },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5ef",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/dm-sans-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/source-sans-3-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){}})()`,
          }}
        />
        {/* Search Console verification (URL-prefix property). Static marker:
            loaded on every page so Google's verifier can always find it. */}
        <meta
          name="google-site-verification"
          content="sFCobwdgJ47jkotq4vkO_mTo13ORcuoajMbTo7Y_O_A"
        />
        {siteUrl && (
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`${profile.name} — Journal`}
            href={`${siteUrl.replace(/\/$/, "")}/feed.xml`}
          />
        )}
        {analyticsEnabled && (
          <>
            {/* Google tag (gtag.js) — GA4. Admin routes skip the config
                command, so they never start a tracking session. */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());if(!location.pathname.startsWith('/admin')){gtag('config','${gaMeasurementId}');}`,
              }}
            />
            {/* AdSense base loader — preloads the client only; no ad units
                are rendered until approved placements are added. */}
            <script
              async
              crossOrigin="anonymous"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            />
          </>
        )}
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        {analyticsEnabled && <GoogleAnalytics />}
        {process.env.VERCEL === "1" && <SiteMetrics />}
      </body>
    </html>
  );
}
