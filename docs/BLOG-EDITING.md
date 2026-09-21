# The Commerce Journal — editing guide

This update is scoped to blogs/articles. The existing hero, project gallery, store demos, expertise, contact form, and other portfolio content are unchanged. Integration points are a Blogs link in the existing navigation/footer, the journal preview before About, and article sitemap entries.

## Where to edit

| Content                                                 | File                                                 |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Prime Baby Gear’s seven articles                        | `src/data/blog/prime-baby-gear.json`                 |
| Ollie Burwell’s seven articles                          | `src/data/blog/ollie-burwell.json`                   |
| Noko Luxe’s seven articles                              | `src/data/blog/nokoluxe.json`                        |
| Vintage Art Garage’s seven articles                     | `src/data/blog/vintage-art-garage.json`              |
| Paw by Four’s seven articles                            | `src/data/blog/paw-by-four.json`                     |
| Store names, source URLs, display date helper           | `src/data/blog/catalog.ts`                           |
| Image inventory, dimensions, alt text, variants         | `src/data/blog/assets.json`                          |
| Type definitions, published filtering, media resolution | `src/data/blog/index.ts`                             |
| Author identity                                         | Existing `profile` object in `src/data/portfolio.ts` |

This is a version-controlled content structure, **not a hosted CMS or a writable admin dashboard**. Edit JSON in your editor or GitHub, run the checks, then rebuild/deploy. No database, admin credentials, or publishing API are introduced.

## Article fields

Each record includes `title`, `slug`, `project`, `category`, `tags`, `excerpt`, `intro`, `sections`, `takeaway`, `featuredImage`, `mobileGallery`, `publishedAt`, `status`, `seoTitle`, and `seoDescription`.

- `sections` is an ordered list of headings with paragraph arrays. Plain text is escaped by React; arbitrary HTML is not evaluated.
- Use `published` to expose an article; use `draft` to remove it from the archive, static route list, related articles, and sitemap. Unknown unpublished slugs return 404.
- Keep slugs stable after publishing, or add an explicit redirect when renaming one.
- Dates use `YYYY-MM-DD`. The initial publication date is September 21, 2026; the imported screenshot capture date is September 20, 2026. These are different concepts.
- Set optional `updatedAt` after a substantive editorial update. It changes the displayed update date and metadata.
- Reading time is derived from the article’s text, not manually invented.
- Categories and search are derived from published records. Changing a category updates the archive filter automatically.

The initial requirement is exactly 35 articles, seven per supplied store. Inventory tests enforce that delivery baseline. If you intentionally change the publication count later, update those expectations as part of the editorial change.

## Image replacement

`featuredImage` is a key within that article’s own project entry in `assets.json`, such as `desktop-home-hero` or `desktop-collection-listing`.

A media record supports:

```json
{
  "src": "/images/blog/prime-baby-gear/approved-desktop.webp",
  "width": 1440,
  "height": 900,
  "alt": "Describe the actual approved capture",
  "smallSrc": "/images/blog/prime-baby-gear/approved-desktop-720.webp",
  "smallWidth": 720,
  "caption": "Desktop collection view",
  "capturedAt": "2026-09-20"
}
```

Optional `avifSrc`, `mobileSrc`, `mobileWidth`, `mobileHeight`, `objectPosition`, and `sourcePath` are also supported. Use real image dimensions. Source sizes and aspect ratios are reserved before images load. The reusable article image component has distinct missing-image and failed-download states; neither substitutes an unrelated screenshot.

- Set `mobileGallery: true` to display the project’s mobile homepage/detail pair. They are two columns from 480px upwards and stack below 480px so small-phone captures remain readable. Readers can open full-resolution originals.
- Optional `inlineImages: ["image-key", "another-key"]` places images after the corresponding article sections.
- Optional `comparisonImages: ["verified-before-key", "verified-after-key"]` renders a paired comparison. Add this only with genuine, correctly labeled source images; no initial article invents a before/after result.
- Vintage Art Garage intentionally has placeholders. Its source archive contains no accepted captures. Add a project entry and valid image keys only after approved imagery becomes available.

See `docs/BLOG-ASSETS.md` for the exact repository/archive and import command. The final archive, rather than the incomplete loose-file/browser inventory, is the source of the four available stores’ screenshots.

## Editorial boundaries

These are short, distinct storefront observations and practice notes, not invented development case studies. The articles distinguish what is visible from what a developer might recommend. They do not claim ownership of specific implementations, app stacks, safety/medical evidence, conversion improvements, revenue, or search outcomes.

Vintage Art Garage’s seven notes explicitly use its documented business category and temporary closure as context. They do not describe unseen product pages or claim a reopening test.

Review and approve the writing before publishing it as your personal journal. Keep permission for supplied client imagery and verify any additional claims you introduce.

## Routes, search, and SEO

- `/` retains the one-page portfolio with a compact journal preview at `#blogs`.
- `/blogs` contains the searchable/filterable archive.
- `/blogs/[slug]` statically renders each published article, including all reading content, headings, dates, source links, and metadata.
- Filters can be shared, for example `/blogs?project=ollie-burwell&category=SEO` or `/blogs?q=mobile`.
- Article metadata includes title, description, Open Graph, and Twitter fields. With a real `NEXT_PUBLIC_SITE_URL`, canonical URLs, Article/BreadcrumbList schema, and article sitemap entries become available.
- Without the real domain, previews stay `noindex` and do not invent canonical domains or structured data.
- Local `portfolio:analytics` events support `blog_view`, `blog_open`, `blog_filter`, and `article_interaction` (copy link). Search strings are not sent through these events. Existing Vercel integration is unchanged.

## Checks

```sh
npm run typecheck
npm run build
npx playwright test tests/blog.spec.ts
npm test
```

The blog tests cover counts, distinct content, original asset association, actual media dimensions, all 35 route responses, filtering, search, deep links, empty states, load more, 320–2560px layouts, two-column mobile galleries, keyboard-friendly navigation, image failure recovery, copy-link fallback, reduced motion, and light/dark axe checks.

## Validation for the original journal delivery

- Production build and TypeScript checks passed; all 35 article routes were statically generated.
- All 21 blog-specific tests passed, including every article route, 320–2560px layouts, genuine asset mapping/dimensions, image-failure recovery, and light/dark accessibility audits.
- Dependency audit: zero vulnerabilities; no new packages were installed for the journal.
- Full regression run: 74/75 passed. The ecosystem rotation test intermittently exceeded its 3.5-second first-selection assertion; isolated repeats passed twice and timed out once. That unrelated runtime/test was not changed because the requested scope was blogs/articles only. No fully green 75-test run is claimed.

## Article-card follow-up

Article sources retain the relevant public storefront URL but no longer expose the supplied GitHub capture archive. Keep capture provenance in `docs/BLOG-ASSETS.md` and the asset metadata, rather than adding that ZIP link back to article sources. Related cards automatically reuse each article's `featuredImage`, including honest placeholders when no capture exists; arrows stay beside their titles on desktop and mobile.

The follow-up production build and TypeScript check passed. All 21 journal regression checks passed again, alongside new all-route source-removal and responsive related-card checks in `tests/article-rotation-refinements.spec.ts`.
