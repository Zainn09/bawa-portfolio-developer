"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

/**
 * Sends GA4 `page_view` events for App Router client-side navigations so
 * link clicks between pages are not undercounted. The gtag.js tag and its
 * dataLayer bootstrap are plain script tags in the root layout's <head>,
 * visible in the raw HTML. The first page view of a document comes from the
 * standard `gtag('config', …)` command; navigation to administration routes
 * is never tracked.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return; // First page view is sent by the gtag config command.
    }
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (isAdmin) return; // Never track administration navigation.
    const w = window as GtagWindow;
    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname, isAdmin]);

  return null;
}
