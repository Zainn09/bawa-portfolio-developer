# SEO, crawling, and search visibility

This document records what was audited, what was already correct, and the
changes made to improve crawling, indexing, canonicalization, internal
linking, structured data, and on-page SEO. It is written to match what is
actually in the code — no Search Console or Google-side action is claimed
here, because none can be performed from this repository.

## Production URL and environment

The site is served from:

```
https://ahmad-adbullah-prod.vercel.app
```

Everything indexable is gated behind one environment variable:

```
NEXT_PUBLIC_SITE_URL=https://ahmad-adbullah-prod.vercel.app
```

| Behavior                                       | `NEXT_PUBLIC_SITE_URL` unset (preview / local) | set (production build)                                                                                             |
| ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `robots` meta                                  | `noindex, nofollow` on every page              | `index, follow`                                                                                                    |
| `<link rel="canonical">`                       | not rendered                                   | absolute canonical on every page                                                                                   |
| JSON-LD (Person, WebSite, Service, Article, …) | not rendered                                   | rendered with absolute `@id` / `url`                                                                               |
| `robots.txt`                                   | `Disallow: /`, no `Sitemap:`                   | `Allow: /`, disallows `/api/` and `/admin/`, points `Sitemap:` at the absolute URL                                 |
| `sitemap.xml`                                  | empty (no invented domain)                     | home, `/blogs`, all 11 service pages, `/case-studies` + 5 studies, `/resources` + 8 guides, all published articles |
| Open Graph / Twitter `url` + `images`          | omitted                                        | absolute                                                                                                           |

`NEXT_PUBLIC_*` values are inlined at build time, so the production build
(Vercel, which has the variable set) bakes in indexable, canonicalized
output, while a local build without the variable stays deliberately
unindexable. This keeps the live preview from publishing an accidental
indexable mirror of the production domain.

## Audit: what was already correct (left unchanged)

- `src/app/robots.ts` — already conditional on the site URL; correct allow/
  disallow for `/api/` and `/admin/`.
- `src/app/sitemap.ts` — already URL-gated and article-aware; extended (not
  rewritten) to include the new service and case-study routes.
- `src/app/layout.tsx` — noindex/OG gating, Google Search Console
  verification, RSS alternate, and `poweredByHeader: false` were already in
  place.
- `src/app/blogs/[slug]/page.tsx` — full article metadata, Article +
  BreadcrumbList schema, single H1, related articles, and priority images
  were already correct; a related-services block was added (below).
- `src/app/feed.xml/route.ts` — RSS feed intact.
- Self-hosted, dimensioned, lazy-loaded WebP imagery and the two local font
  families — no new heavy assets introduced.

## What changed

### Crawling / indexing / canonicals

- New pages carry an absolute `rel=canonical`, `index, follow` robots, and
  absolute Open Graph URLs when `NEXT_PUBLIC_SITE_URL` is set; otherwise they
  are `noindex, nofollow` with no canonical and no schema.
- Unknown top-level service slugs and unknown case-study slugs return a real
  HTTP **404** and a custom not-found page (previously the framework default).

### Site architecture and internal linking

- Top-level service pages at clean, lowercase, descriptive URLs:
  `/shopify-development` (hub), `/shopify-theme-development`,
  `/shopify-store-development`, `/shopify-qa-testing`, `/shopify-plus`,
  `/shopify-store-maintenance`, `/shopify-checkout-testing`,
  `/shopify-mobile-testing`, `/shopify-performance-testing`,
  `/shopify-accessibility-testing`, `/shopify-regression-testing`.
- `/case-studies` index plus `/case-studies/{store}` for the five real,
  supplied stores only: `prime-baby-gear`, `ollie-burwell`, `nokoluxe`,
  `vintage-art-garage`, `paw-by-four`.
- Navigation: "Services" and "Case studies" links added to the desktop nav
  (only at viewport widths where the nav has room, so smaller layouts are
  unaffected), the mobile menu, and the footer.
- Homepage: single keyword-carrying H1, descriptive title/meta/OG, an intro
  link into the services hub, and a `ProfessionalService` node in the
  JSON-LD graph.
- Service pages link to related services, the relevant case studies, and a
  strong contact CTA. The hub lists every service so no service is an orphan.
- Case-study pages link to the store's seven journal entries (all verified
  resolvable), the case-studies index, and the services hub.
- Article pages link to their related service page(s) via a deterministic
  keyword mapping (`src/lib/serviceLinks.ts`) — theme, checkout, mobile,
  performance, accessibility, regression, store, Plus, maintenance, QA.

### Content expansion: guides and checklists

Eight practical resources under `/resources` (index + `/resources/{slug}`),
chosen for genuine usefulness rather than keyword volume:

- `/resources/shopify-theme-development-guide`
- `/resources/shopify-store-launch-checklist`
- `/resources/shopify-qa-checklist`
- `/resources/shopify-checkout-testing-guide`
- `/resources/shopify-plus-testing-guide`
- `/resources/shopify-mobile-testing-guide`
- `/resources/shopify-performance-checklist`
- `/resources/common-shopify-store-issues`

Each is a substantial, actionable guide or checklist (Article + FAQPage +
BreadcrumbList schema) that links to the service pages it describes, real
journal entries, and the relevant case studies. Service pages surface the
resources relevant to them, and the footer links the section. The guidance
describes real development and QA practice — no invented results.

### Case studies (honest by design)

Case-study content is derived only from the five real, supplied projects and
their published journal entries. Roles, processes, and screenshots are
described as standard practice and captured public-store evidence. No sales
figures, rankings, conversion lifts, client names, or measured metrics are
invented. The `vintage-art-garage` study explicitly states the store is
temporarily closed.

### Structured data (only where it matches visible content)

- Homepage: `WebSite`, `Person`, `ProfessionalService`.
- Service pages: `Service`, `FAQPage` (real Q&A shown on the page),
  `BreadcrumbList`.
- Case-studies index: `CollectionPage`, `BreadcrumbList`.
- Case-study pages: `WebPage`, `BreadcrumbList`.
- Article pages: existing `Article` + `BreadcrumbList` (unchanged).

All JSON-LD is emitted as parseable, escaped JSON and is validated by the
test suite.

## Performance / Core Web Vitals posture

No new JavaScript runtime was added. New pages are statically prerendered
(○/● in the build output), headings and body copy are server-rendered, and
images are the existing dimensioned, lazy-loaded WebP set. Local fonts and
the system mono stack are unchanged, so no new font payload. Animation and
third-party behavior are untouched, so existing CWV characteristics are
preserved rather than regressed.

## Tests

- `tests/seo.spec.ts` — 38 assertions covering: every service page renders
  with one H1 and a unique title, the hub links all services, the
  case-studies index lists the five stores, each study links seven resolvable
  journal entries, every resource page links its services and real journal
  entries, the guides index lists all eight, unknown routes 404, homepage
  hierarchy links, article → service links, service → resource links, the
  work modal links to a case study, 320px overflow checks, an axe
  accessibility audit on a service page, and preview-safe robots/sitemap.
- The existing suite (navigation, responsive widths, a11y, form, CMS) still
  passes; the one homepage H1 assertion was updated to the new, more
  descriptive H1.

## What the owner still has to do (not done here)

These require Google's console or DNS and cannot be completed from the repo:

1. Verify the site in **Google Search Console** (the meta verification tag is
   already in the HTML head).
2. Submit `https://ahmad-adbullah-prod.vercel.app/sitemap.xml` after a
   production deploy with `NEXT_PUBLIC_SITE_URL` set.
3. Use URL Inspection to request indexing of key pages and monitor the
   Queries, Pages, and Core Web Vitals reports.
4. If a custom domain is connected later, set `NEXT_PUBLIC_SITE_URL` to that
   domain and add the canonical-domain redirects (www/non-www, http→https)
   via the domain provider or Vercel's rewrite/redirect rules so exactly one
   canonical host is served.
