"use client";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Never include enquiry-like query strings or fragment contents in telemetry. */
function cleanUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return url.split(/[?#]/)[0];
  }
}

export default function SiteMetrics() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <>
      <Analytics
        beforeSend={(event) => ({ ...event, url: cleanUrl(event.url) })}
      />
      <SpeedInsights
        beforeSend={(data) => ({ ...data, url: cleanUrl(data.url) })}
      />
    </>
  );
}
