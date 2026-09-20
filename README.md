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
- Responsive asymmetric concept work gallery: the lead project is sticky on tablet/desktop while the right-hand projects scroll; mobile becomes a normal single-column editorial sequence. Project detail dialogs remain keyboard accessible.
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

| Field | Purpose |
| --- | --- |
| `profile` | Name, title, introduction, portrait path, email, and supplied social links |
| `images` / `imageVariants` | Central hero imagery and optional responsive variants |
| `projects` | Typed case-study data, services, technologies, challenge, approach, optional result, external link, before/after images, and concept status |
| `capabilities` | Service descriptions and editable capability lists |
| `platforms` | Platform names, descriptions, and migration considerations |
| `process` | Store-build stages and descriptions |
| `testimonials`, `clientLogos`, `statistics` | Empty arrays; sections only render once real information is supplied |

Replace assets under `public/images/`. Keep filenames to avoid code changes, or update the central data. The hero has 720px and 1400px WebP versions. Project images use corresponding responsive variants. Gallery image failures fall back to the furniture concept image. Empty featured work displays a deliberate empty state; the comparison is hidden when before/after assets are not configured.

All three sample brands and product details are **self-initiated, illustrative concepts**, not client relationships or completed Shopify engagements. Product photos are AI-generated placeholder imagery; the profile image is an abstract graphic, not a generated person. There are no invented testimonials, metrics, certifications, clients, or commercial outcomes.

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
- No analytics service, cookies, tracking pixels, third-party embeds, or external font requests.
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

The automated suite covers ten widths: **375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, and 2560px**, browser errors, image loading, horizontal overflow, navigation, interactive demos, modal keyboard dismissal/focus restoration, persistence, reduced motion, client/server form validation, rate limiting, and light/dark WCAG 2 A/AA + 2.1 AA axe checks. Delivery success UI is tested with a explicitly simulated network response, not claimed as a tested live email integration.

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
