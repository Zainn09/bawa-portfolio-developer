/**
 * The site's canonical URL. The production domain is known, so it is the
 * default and the sitemap, feed, canonicals, and schema work in every
 * build. NEXT_PUBLIC_SITE_URL overrides it — set it whenever the site
 * moves to a new domain (e.g. a custom domain) and redeploy.
 */
export const DEFAULT_SITE_URL = "https://ahmad-adbullah-prod.vercel.app";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL;
