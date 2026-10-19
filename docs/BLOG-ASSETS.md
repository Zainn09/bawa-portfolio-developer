# Article image provenance

Only blog/article assets were imported. Existing project and portfolio imagery is unchanged.

- Repository: https://github.com/Zainn09/portfolio-images/tree/arena/01a0c0f5-portfolio-images
- Inspected commit: `3e783e37e2fdb451912c0190a3ee6f2e0cd56ab2`
- Source: `QA-Portfolio-Sprint-11-Assets.zip`, project manifests and README files.
- Capture date reported by those manifests: September 20, 2026.
- Imported projects: Prime Baby Gear, Ollie Burwell, Nokoluxe, Paw by Four.
- Vintage Art Garage: the archive explicitly has no accepted captures because the public storefront was closed/password-protected. Use labeled placeholders, not cached or fabricated screenshots.
- The loose repository tree and browser manifest are incomplete/inconsistent with the final ZIP; the ZIP contains accepted images for all four available stores. The archive was inspected directly.

`src/data/blog/assets.json` records original repository paths, capture dates, descriptions, dimensions, and optimized variants. The images remain genuine captured website UI. We excluded QA comparison composites, user-flow contact sheets, videos, and rejected duplicate states. No other clients were imported.

Images were converted to WebP, retaining their aspect ratio and up to 1440px width. Desktop captures also have 720px variants. Four homepage images additionally have AVIF versions. Mobile captures retain their native dimensions. None are claimed to be newly captured production states; current websites may differ.

Regeneration: extract the pinned Sprint 11 ZIP outside tracked source and run `node scripts/import-blog-assets.mjs /path/to/Sprint-11`. Requires the existing Sharp dev dependency. Source archives and original JPEGs are intentionally not committed.

## Second guide batch — visual sourcing (no AI imagery)

The ten problem-led technical guides (see `docs/BLOG-EDITING.md`) intentionally use **no AI-generated images**. Their visuals come from two honest sources only:

- **Reused documented storefront captures.** Where a real capture genuinely illustrates an article, an existing Sprint-11 capture is referenced (not copied) by a new `shopify-guides` entry in `assets.json`, clearly captioned as a documented-storefront capture. Files referenced:
  - `prime-baby-gear/desktop-travel-system-detail.webp` (+ mobile variant) — product detail (AI search, variants, schema, Merchant Center)
  - `prime-baby-gear/desktop-collection-listing.webp` — collection listing (filters, product data)
  - `prime-baby-gear/desktop-babymore-brand-range.webp` — brand range listing (AI search)
  - `ollie-burwell/desktop-silk-sarong-detail.webp` — product detail, second store (schema comparison)
  - `ollie-burwell/desktop-collection-listing.webp` — collection listing, second store (filters)
  - `nokoluxe/desktop-adirondack-chair-detail.webp` — product detail, third store (product data audit)
- **Pending-capture placeholders.** Where the required visual is a tool screenshot this work has no right to fabricate, an `assets.json` entry carries intended geometry (1536×592), a descriptive alt, and an “approved imagery pending” caption, with **no `src`** until a real, redacted capture is supplied. These are: the migration URL-inventory, the Markets language/currency selector, the Search Console URL Inspection, the Merchant Center diagnostics screen, and the B2B company-account workflow.

Pending entries have no `src`, so the asset-decode test skips them (it only asserts dimensions for files that exist). When a real capture is provided, add the `src`/`smallSrc` and dimensions to the existing entry and the placeholder becomes the real image with no other change.
