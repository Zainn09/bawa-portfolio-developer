"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Google tag (gtag.js) for GA4, loaded only in telemetry-enabled deployments
 * (Vercel, or an explicit `ENABLE_ANALYTICS=1`). Administration pages never
 * load or send analytics. The first page view comes from the standard
 * `gtag('config', …)` command; each later client-side navigation sends its
 * own `page_view` event so App Router links are not undercounted.
 */
export default function GoogleAnalytics({ id }: { id: string }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const initialPath = useRef(pathname);
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return; // First page view is sent by the gtag config command.
    }
    if (previousPath.current === pathname) return;
    const previous = previousPath.current;
    previousPath.current = pathname;
    if (isAdmin) return; // Remember the path, but never send admin views.
    if (
      initialPath.current.startsWith("/admin") &&
      previous.startsWith("/admin")
    ) {
      return; // The tag just mounted; its config command sends this view.
    }
    const w = window as GtagWindow;
    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname, isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
