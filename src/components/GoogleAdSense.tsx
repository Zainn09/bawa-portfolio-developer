"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google AdSense base loader (adsbygoogle.js), loaded only in
 * telemetry-enabled deployments (Vercel, or an explicit
 * `ENABLE_ANALYTICS=1`) and never on administration pages.
 * This only preloads the AdSense client: no ad units are rendered until
 * approved `<ins class="adsbygoogle">` placements are added.
 */
export default function GoogleAdSense({ client }: { client: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <Script
      id="adsense"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="afterInteractive"
    />
  );
}
