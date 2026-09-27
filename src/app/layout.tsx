import type { Metadata, Viewport } from "next";
import GoogleAdSense from "@/components/GoogleAdSense";
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
// GA4 runs on the production deployment; local previews stay telemetry-free.
// ENABLE_ANALYTICS=1 is the escape hatch for non-Vercel production hosts.
const analyticsEnabled =
  process.env.VERCEL === "1" || process.env.ENABLE_ANALYTICS === "1";
const gaMeasurementId = process.env.GA_MEASUREMENT_ID || "G-JZZR2B3JTH";
const adSenseClientId =
  process.env.GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-4078729434854717";
export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: `Shopify Developer — Commerce, Crafted | ${profile.name}`,
  description:
    "Custom Shopify and Shopify Plus storefronts built around your brand. Design, theme development, product data, SEO, CRO, performance, and ongoing store management.",
  openGraph: {
    title: "Not just stores. Commerce experiences.",
    description:
      "A personal showroom for considered Shopify development. From the first idea to the everyday details.",
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
      "Design. Development. Data. Discovery. A complete commerce experience.",
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
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        {analyticsEnabled && (
          <>
            <GoogleAnalytics id={gaMeasurementId} />
            <GoogleAdSense client={adSenseClientId} />
          </>
        )}
        {process.env.VERCEL === "1" && <SiteMetrics />}
      </body>
    </html>
  );
}
