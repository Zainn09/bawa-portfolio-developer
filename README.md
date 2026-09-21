# Commerce, Crafted

A one-page personal Shopify developer showroom built with **Next.js 16, React 19, TypeScript, and modern CSS**. Warm ivory, charcoal, and terracotta in light mode; a deliberately designed graphite/olive dark mode. DM Sans headings/UI and Source Sans 3 descriptions are self-hosted. Technical labels use the system monospace stack, keeping only two downloadable font families. Ahmad Abdullah’s handwritten-style signature is a vector asset, so it does not add another runtime font.

## Run locally

Requires Node.js 20.9+ (developed with Node 22).

```sh
npm ci
npm run dev
```

The server binds to `0.0.0.0:3000`, including the Arena live preview. For production:

```sh
npm run build
npm run start
```

## What is implemented

- Sticky, compact anchor navigation with a keyboard-accessible mobile menu and persistent theme selection.
- Interactive concept furniture storefront: collection navigation, add-to-bag, quantity changes, empty cart, accessible native dialog, and clear demo-only purchasing notice.
- Responsive asymmetric latest-project gallery: the lead project is sticky on tablet/desktop while the right-hand projects scroll; mobile becomes a normal single-column editorial sequence. Project detail dialogs remain keyboard accessible.
- Lightweight CSS-perspective Shopify ecosystem with curved connections from every node to Shopify, synchronized left-side descriptions, smooth accordion content, and a two-second automatic active-node cycle. A completed cycle switches platform/ecosystem views. Hover, keyboard focus, explicit pause, reduced motion, offscreen visibility, and background tabs suspend autoplay. No WebGL or platform superiority claims.
- Seven capability accordions covering the complete store lifecycle.
- Illustrative Liquid/theme workbench with matching rendered highlights; interactive underlying architecture.
- Design, SEO, CRO, performance, and mobile optimization layers.
- Nine-stage build-a-store journey that remains on Discover until the panel reaches the top, then pins through Maintain before naturally releasing. Stage buttons and next-step controls move to the matching point in the scroll journey. Short-screen layouts are compacted; reduced motion or viewports that cannot fit the panel use a normal-flow manual alternative. Native scrolling is never intercepted.
- Accessible before/after range slider with real concept storefront images.
- Raw-to-structured product-data example and ongoing store-management content.
- Desktop, laptop, tablet, and mobile storefront showcase.
- Ahmad Abdullah identity, bespoke AA monogram/favicon, vector signature below the abstract portrait placeholder, honest working-practice badges, and a completely redesigned editorial footer. Testimonials, client logos, and metrics remain empty until verified information is supplied.
- Validated contact API, loading/success/error states, honeypot, timing guard, request-size limit, same-origin check, and basic rate limiting.

## Personalize without changing the layout

Start in **`src/data/portfolio.ts`**:

| Field                                       | Purpose                                                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile`                                   | Name, title, introduction, portrait path, email, and supplied social links                                                                  |
| `images` / `imageVariants`                  | Central hero imagery and optional responsive variants                                                                                       |
| `projects`                                  | Typed case-study data, services, technologies, challenge, approach, optional result, external link, before/after images, and concept status |
| `capabilities`                              | Service descriptions and editable capability lists                                                                                          |
| `platforms`                                 | Platform names, descriptions, and migration considerations                                                                                  |
| `process`                                   | Store-build stages and descriptions                                                                                                         |
| `testimonials`, `clientLogos`, `statistics` | Empty arrays; sections only render once real information is supplied                                                                        |

Replace assets under `public/images/`. Keep filenames to avoid code changes, or update the central data. `projects` contains real latest work; `conceptProjects` independently supplies the illustrative before/after study. The hero has 720px and 1400px WebP versions. Project images use corresponding responsive variants. Gallery image failures fall back to the furniture concept image. Empty featured work displays a deliberate empty state; the comparison is hidden when before/after assets are not configured.

The Work gallery features the five latest projects supplied by Ahmad: Prime Baby Gear, Ollie Burwell, Nokoluxe, Vintage Art Garage, and Paw by Four. Their cards use actual brand/product photography, not fabricated screenshots. Scope, results, and performance metrics remain unfilled until supplied. The three Atelier brands, demo products, and before/after study remain **self-initiated, illustrative concepts**, not additional client relationships. Their product photos are AI-generated placeholder imagery; the profile image is an abstract graphic, not a generated person. There are no invented testimonials, metrics, certifications, clients, or commercial outcomes.

`node scripts/create-placeholders.mjs` regenerates the abstract portrait and comparison storefronts from the hero image. Do not run it after replacing those files with real project assets unless you intend to overwrite them.

## Connect contact delivery

Copy `.env.example` to `.env.local`, then configure a trusted server-side delivery service:

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-real-domain.example
CONTACT_WEBHOOK_URL=https://your-trusted-service.example/contact
CONTACT_WEBHOOK_TOKEN=your-server-only-token-if-required
```

**Do not use these example URLs in production.** No real domain or email address was supplied, so neither is invented.

The contact API posts JSON to the configured HTTPS webhook. The optional token is sent as a bearer token and is never exposed to client code. Accepted payload fields are `name`, `email`, `company`, `storeUrl`, `platform`, `projectType`, `budget`, `message`, `source`, and `submittedAt`. The receiver must acknowledge successful acceptance with a 2xx status. The request times out after ten seconds and does not follow redirects.

**Without a webhook, valid submissions return HTTP 503 with an honest “not sent” message.** The browser preserves the draft. It never pretends an enquiry was delivered. No submitted messages are stored locally or logged by the application.

Validation normalizes whitespace, strips non-printable control characters, constrains lengths, checks email/URL formats, and allowlists project types. Content is transported as JSON, not inserted into HTML. If your receiving service formats an HTML email, it must HTML-escape all user input.

The rate limiter is intentionally small and in-memory (five attempts per ten minutes per forwarded client IP). **For multi-instance/serverless production, replace it with a shared limiter** and configure the hosting proxy to overwrite forwarded IP/host headers. Add a server-verified challenge if your traffic warrants it. Review the privacy copy and retention policy of your delivery provider before launch.

## SEO and privacy

- Unique title and description; social metadata and an SVG favicon.
- Previews are `noindex, nofollow` and `robots.txt` disallows indexing until `NEXT_PUBLIC_SITE_URL` is supplied.
- A real site URL enables canonical/social image URLs, a sitemap, and WebSite schema.
- Person schema stays absent while the name is `[YOUR NAME]`; after supplying a real name and real URL, it is populated from the profile data. No invented structured data.
- Vercel Web Analytics and Speed Insights load only on Vercel deployments (`VERCEL=1`). Local previews do not request telemetry. Query strings and URL fragments are stripped before sending. No external font requests.
- `src/lib/analytics.ts` dispatches local `portfolio:analytics` events. Connect a consent-appropriate listener only when ready. Events contain interaction names, never contact-field contents.

## Structure

```text
src/
  app/                   Server-rendered page, metadata, sitemap, robots, contact API
  components/            Navigation, hero, shop demo, work, ecosystem, expertise,
                         process, optimization, management, responsive demo, about, contact
  data/portfolio.ts      Editable personal, project, and capability content
  lib/                   Shared validation and optional analytics event adapter
  styles/                Design tokens, base/hero styles, sections, responsive/reduced-motion rules
public/
  fonts/                 Locally hosted WOFF2 files and their OFL licenses
  images/                Optimized, replaceable WebP assets
scripts/                 Browser setup and reproducible placeholder generation
tests/                   Playwright interaction, layout, security, and axe accessibility checks
```

## Quality checks

```sh
npm run typecheck
npm run build
npm test
npm audit
```

`npm test` uses an npm-bundled Chromium and its shared libraries so it also works in the network-constrained Linux preview sandbox. It reuses port 3000 if available, otherwise starts the built app. Build first. The suite expects preview defaults (no published domain or live webhook); run against a non-production test instance.

The automated suite covers twelve widths: **320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, and 2560px**, browser errors, image loading, horizontal overflow, navigation, interactive demos, modal keyboard dismissal/focus restoration, persistence, reduced motion, client/server form validation, rate limiting, and light/dark WCAG 2 A/AA + 2.1 AA axe checks. Delivery success UI is tested with a explicitly simulated network response, not claimed as a tested live email integration.

Axe and browser automation do not replace real-device, assistive-technology, or field-performance testing. There are no invented Lighthouse scores or Core Web Vitals claims. Measure again on the actual deployment with final assets and integrations.

## Before publishing

1. Review the supplied Ahmad Abdullah identity and personal copy; replace the portrait placeholder, contact details, and concept work with verified content as appropriate.
2. Add only real testimonials, logos, metrics, and outcomes. Keep concept labels until the work is genuinely replaced.
3. Configure a real domain and contact delivery; test successful receipt and failure handling.
4. Review production rate limiting, privacy disclosures, and any analytics consent requirements.
5. Rebuild; repeat browser, accessibility, and real-device checks with final content.

## Refinement milestones

The requested refinements are preserved as separate Git commits, including the baseline checkpoint, identity/typography, CTA and trust labels, sticky work, connected autoplay ecosystem, pinned process, new footer, motion enhancements, signature/contrast fixes, and regression coverage.

- Main identity: `src/data/portfolio.ts`.
- Logo: `src/components/BrandMark.tsx` and `public/images/brand/ahmad-abdullah-monogram.svg`.
- Signature: `public/images/brand/ahmad-abdullah-signature.svg`; regenerate with `node scripts/create-signature.mjs`. Its source font’s OFL license is included. This is a decorative name treatment, **not an authentication signature**.
- New visual and adaptive layout rules: `src/styles/refinements.css`.
- Progressive enhancement: `src/components/MotionEnhancements.tsx`. Text remains readable throughout entrance motion; all content works without animation, and reduced-motion preferences are respected.
- Trust badges describe working practices only. They are **not** Shopify partner status, certifications, ratings, or client endorsements.

**Validation after refinements:** all 30 browser/API tests passed, TypeScript and the production build passed, and the dependency audit reported zero vulnerabilities. Tests cover two-second automatic selection, hover pause/resume, explicit pause, category cycling, smooth accordion height, sticky project behavior, full pinned-stage progression and release at 1440×1000, 1024×768, 390×844, and 375×667, plus the existing ten-width and light/dark accessibility checks. Accessibility audits wait for entrance animations to settle. No field-performance or live email-delivery results are implied.

### Description typography refresh

`src/styles/typography.css` pairs Source Sans 3 reading copy with the existing DM Sans display headings. Most descriptions and small UI text were increased by 1–2px, with responsive line heights and separate sizing for the compact pinned process. The simulated storefront keeps its own DM Sans typography and miniature scale. Mobile contact fields use 16px text to avoid iOS focus zoom. Font tokens live in `src/styles/variables.css`; the local Source Sans 3 asset and OFL license are in `public/fonts/`.

Typography regression checks in `tests/typography.spec.ts` verify the distinct font families, successful local font loading, reading sizes, mobile form sizing, and lack of horizontal overflow.

## Latest projects and interaction updates

- `src/data/portfolio.ts`: five supplied latest projects, editable descriptions, URLs, image alt text, and Vintage Art Garage’s temporary-closure note. No unprovided project scope or outcomes are invented. Real imagery is stored as optimized local WebP files in `public/images/projects/latest/`.
- `src/data/atelier.ts`: three fictional art directions, two compositions, desktop/mobile preview, and matching demo bags. Reset restores both design settings and storefront state.
- `src/components/SiteMetrics.tsx`: exact `@vercel/analytics/next` and `@vercel/speed-insights/next` integrations. Enable Web Analytics and Speed Insights in the Vercel project dashboard and deploy this branch. Dashboard activation and real field data are not verified locally. Review your privacy disclosures and applicable consent requirements before publishing. Local `portfolio:analytics` interaction events are still local-only, not forwarded automatically.
- `src/hooks/useAutoCycle.ts`: two-second mobile theme-tab cycling and all-screen architecture-icon cycling. Stops offscreen, in hidden tabs, on mouse hover, during keyboard interaction, when paused, or with reduced motion. Touch does not create a persistent hover pause. Active architecture tabs scroll horizontally without jumping the page vertically.
- The ecosystem pause/progress control now sits beside the orbit visualization; the visible autoplay status block is removed.
- Mobile hero artwork and stage controls use normal flow with a measured gap. Figure captions and form “optional” labels are removed; required fields and validation are unchanged.
- `tests/latest-updates.spec.ts`: all five project destinations, local imagery, mobile hero clearance at five widths, mobile cycling, desktop behavior, manual controls, and reduced motion.

### Brand image references

Images are used only to present the projects supplied by the portfolio owner, not as general-purpose licensed stock or fictional work. Source references (retrieved September 21, 2026):

| Project            | Brand source                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Prime Baby Gear    | https://primebabygear.com/collections/all — Bababing travel system image                                                            |
| Ollie Burwell      | https://ollieburwell.com/products/pale-pink-sequin-sarong                                                                           |
| Nokoluxe           | https://nokoluxe.com/collections/aqua-luxe-collection — Ledge Lounger outdoor furniture image                                       |
| Vintage Art Garage | https://vintageartgarage.com/products/1991-chevrolet-s10-vintage-truck-ad — shared framed-print brand image, cropped to photography |
| Paw by Four        | https://pawbyfour.com/ — homepage dog/owner photography                                                                             |

Retain client permission for portfolio usage and replace these with approved project screenshots if preferred. Vintage Art Garage’s current public homepage is a temporary closure/password page; no attempt was made to bypass it.

**Latest validation:** 54/54 Playwright tests passed on the production build, including twelve responsive widths from 320–2560px, all new project/rotation checks, the pinned process, and light/dark accessibility audits. TypeScript, production build, and dependency audit passed (zero vulnerabilities). These are local automated checks, not claims about live contact delivery, Vercel field metrics, or every physical device.

## Commerce Journal / Blogs

The blog-only expansion adds `/blogs`, 35 statically rendered `/blogs/[slug]` articles (seven per supplied store), and a homepage journal preview. It includes store/topic filtering, search, reading times, sources, related notes, genuine supplied screenshots, and responsive mobile-image pairs. Vintage Art Garage has clearly labeled placeholders and planning notes because its supplied archive has no accepted storefront captures. Existing portfolio sections and interactions are unchanged apart from the necessary Blogs navigation entry points.

Edit the articles in `src/data/blog/*.json`. See [the editing guide](docs/BLOG-EDITING.md) for content fields, image replacement, publication status, SEO, and validation, and [asset provenance](docs/BLOG-ASSETS.md) for the supplied GitHub archive details.

### Larger description text

The reading scale has been increased across portfolio descriptions, supporting copy, Atelier notes, project details, footer descriptions, and the journal. Standard descriptions are now 16px on larger layouts and 15px on narrower layouts; article prose is 21px on desktop and 20px on mobile (23px on very wide screens). Hero descriptions are also larger. Display headings, navigation sizing, and miniature demo-store typography are unchanged. The compact pinned process uses a smaller proportional increase to preserve its viewport fit.

Validation for this typography update: production build and TypeScript passed; all 42 targeted typography, 320–2560px layout, mobile hero clearance, pinned-process, and light/dark accessibility checks passed. This was a targeted regression pass, not a rerun of every interaction test.

### Article cards and block-level rotation refinements

- Article sources now show only the corresponding public store link; the supplied capture ZIP is no longer linked from any of the 35 articles. Asset provenance remains documented internally.
- Related articles use each article's existing featured screenshot, with the arrow beside its title at every viewport. Vintage retains its explicit missing-capture placeholder.
- Ecosystem, architecture, and mobile theme cycling have no spinning progress indicators. Small text Pause/Resume controls remain available. Hover pauses only platform buttons/detail blocks, architecture buttons/description, or the theme editor—not section headings, surrounding empty space, or the sibling storefront preview. Keyboard focus, touch selection, reduced motion, and offscreen/hidden-document pauses are preserved.

**Validation for this refinement:** production build and TypeScript passed; 32 targeted Playwright checks passed (21 journal regressions, five new article/hover/keyboard checks, and six existing rotation/touch/reduced-motion checks). These cover all 35 article sources, related imagery and inline arrows, 320–2560px journal layouts, and light/dark article accessibility. Desktop and mobile related-card screenshots were also inspected. This is not a new full-suite result.

### Readable small text throughout the site

The small-text floor is now `--text-small: 12px` in `src/styles/variables.css`, replacing the former 4–11px live-text declarations across desktop and mobile rules. This includes captions, metadata, project details, badges, code notes, form labels, footer copy, and interactive storefront controls. The existing larger description and article-prose scales are preserved. Authentic screenshot pixels, the decorative SVG seal, and the noninteractive miniature phone artwork are not resized as reading text; the duplicate phone artwork is explicitly hidden from assistive technology.

`src/styles/readability.css` supplies the corresponding reflow: wrapping labels and product rows, content-sized demo campaigns, separated orbit captions/footer links, and a compact pinned-process preview without shrinking its explanatory copy. Mobile theme snippets reserve their wrapped-line height, preventing autoplay from shifting the page.

**Latest validation (22 September 2026):** production build, TypeScript, and diff checks passed. The full production-build Playwright suite passed **97/97 checks in 7.6 minutes**. The live-text floor is now checked on the homepage, journal index, and a full article at all twelve widths: 320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, and 2560px. The suite also covers all 35 article routes, light/dark accessibility, demo interactions, annotation clearance, mobile hero layout, every pinned-process stage, touch rotation without vertical page jumps, keyboard focus, and reduced motion. This supersedes the earlier partial full-suite result; the wrapped-code layout shift and programmatic-focus test race are resolved. Desktop/mobile screenshots were visually reviewed during the styling pass. These are local automated checks, not claims about physical-device coverage, field performance, or live email delivery.

### Simplified section controls and reliable process pinning

- Removed the Pause control from the architecture block and the platform ecosystem, and removed “Reset the canvas” from the Atelier. The separate mobile theme-editor control is unchanged. Hover/keyboard exploration and reduced motion still suspend cycling; clicking or tapping an architecture/platform item takes over from autoplay so its content remains readable without a separate Pause button.
- Contact actions now have explicit borders, including an outlined “View my work” action.
- Process stages share an intrinsic-height grid with only the active panel visible and interactive. This reserves the tallest copy before scrolling, rather than changing track geometry at each stage. The old viewport-fit cutoff is removed: oversized panels scroll naturally before pinning at their bottom edge. Geometry changes preserve chapter progress, and font loading, resizing, and page restoration trigger remeasurement. Reduced-motion mode remains manual, without scroll pinning or wheel interception.

**Validation for this update:** production build, TypeScript, and diff checks passed. All 43 final targeted checks passed, including all nine process stages at ten viewport sizes (down to 320×568 and 844×390 landscape), resize progress preservation, reduced-motion switching, removed controls, borders in both themes, touch/keyboard interactions, and Atelier accessibility. Contact actions were visually inspected on mobile and desktop. The broader run passed 105/106 checks; its single hover-selection timing assertion passed three isolated repeats, then was changed to deterministic keyboard exploration and passed in the final 43-check run. No new all-green 106-test full-suite result is claimed.

### Journal dates, clean image captions, and footer invitation

The 35 editable articles now have distinct, owner-requested editorial publication dates across **22 July–22 September 2026**, assigned once and stored in their JSON records. Their current-edition update date remains **22 September 2026**, separately from the supplied September screenshot provenance. Capture-date/inspection prompts are removed from public image captions; descriptive captions, full-size links, and internal asset provenance remain intact.

Homepage storefront previews no longer display mock domain/address text. The footer's circular project badge is replaced with a bordered invitation card, readable supporting copy, and an accent square arrow, with keyboard focus and reduced-motion styling.

**Validation:** production build, TypeScript, and diff checks passed. All **82 targeted checks** passed (29 journal/date/footer checks plus 53 homepage/Atelier/typography/contact regressions), including all 35 routes, 320–2560px layouts, accessible full-size images, and light/dark accessibility. Footer screenshots were visually inspected at 320px and 1440px. This is targeted validation, not a new full-suite run.

**Contact delivery:** the workspace has no configured delivery webhook or database. The form posts to `/api/contact`, which forwards only to a configured server-side `CONTACT_WEBHOOK_URL`; without it, submissions are not delivered or stored. No email/database integration was added by this visual update. See [contact delivery setup](docs/CONTACT-DELIVERY.md) for secure configuration and the information needed before adding database storage. Production environment settings have not been verified.
