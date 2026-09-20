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
