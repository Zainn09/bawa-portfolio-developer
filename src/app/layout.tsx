import type { Metadata, Viewport } from "next";
import { profile } from "@/data/portfolio";
import "@/styles/variables.css";
import "@/styles/globals.css";
import "@/styles/sections.css";
import "@/styles/responsive.css";
import "@/styles/refinements.css";
import "@/styles/typography.css";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
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
      </body>
    </html>
  );
}
