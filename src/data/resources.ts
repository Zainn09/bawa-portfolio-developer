/**
 * Practical guides and checklists. Original, actionable content that
 * supports the service pages it links to. No invented clients, metrics,
 * or results — the guidance describes real development and QA practice.
 */
export interface ResourceSection {
  heading: string;
  body?: string[];
  list?: string[];
}
export interface ResourceFaq {
  q: string;
  a: string;
}
export interface ResourceData {
  slug: string;
  label: string;
  title: string;
  description: string;
  kicker: string;
  h1: string;
  h1Accent: string;
  lede: string;
  kind: "GUIDE" | "CHECKLIST";
  sections: ResourceSection[];
  faqs: ResourceFaq[];
  relatedServices: string[];
  relatedArticles: string[];
  relatedCaseStudies: string[];
}

export const resources: ResourceData[] = [
  {
    slug: "shopify-theme-development-guide",
    label: "Theme development guide",
    title:
      "Shopify Theme Development Guide — Building a Custom Liquid Theme | Ahmad Abdullah",
    description:
      "A practical guide to custom Shopify theme development: planning before Liquid, structuring sections and templates, exposing the right settings, and handing over a maintainable theme.",
    kicker: "RESOURCE / GUIDE",
    h1: "A practical guide to",
    h1Accent: "custom Shopify themes.",
    kind: "GUIDE",
    lede: "What theme development actually involves — the planning before the first template, the structure that keeps a theme maintainable, and the handover that means a store owner can change things without fear.",
    sections: [
      {
        heading: "What “custom theme work” covers",
        body: [
          "Custom theme development is not “a template with your logo on it.” It means the theme’s sections, templates, and interactions are written around your brand and your catalogue, with the code structured so it can be read, changed, and extended later.",
        ],
      },
      {
        heading: "Before any Liquid is written",
        list: [
          "One agreed visual direction: type, imagery, spacing, and how the store feels at its main moments",
          "The shopping journey mapped: where customers enter, how they compare, what they buy together",
          "Page types and templates listed: homepage, collection, product, cart, search, 404, and any custom pages",
          "Decided which parts the store owner should be able to change — and how",
          "The technical SEO baseline: heading structure, link text, and image alt conventions",
        ],
      },
      {
        heading: "How sections and templates are built",
        body: [
          "A theme is built in reusable pieces. A section is one self-contained block — a hero, a product grid, a styling guide — with its own settings, so the same block can be placed on several pages and tweaked without touching anything else. Templates compose sections into pages.",
        ],
        list: [
          "Sections named for what they do, not where they first appeared",
          "Settings exposed where the store owner should control them: text, image, order, visibility",
          "No hidden coupling: changing one section should never require knowing about another",
          "Responsive behaviour written for each layout, not just a desktop pass",
        ],
      },
      {
        heading: "Keeping the theme maintainable",
        body: [
          "A theme is a long-term asset. The code is kept plain and consistent, comments mark the non-obvious parts, and everything a future developer or store owner will touch is findable in the Shopify admin rather than buried in code. That is what makes a handover possible.",
        ],
        list: [
          "Every merchant-editable element reachable from the customiser or settings",
          "A short written map of where things live before handover",
          "A regression pass after any meaningful change — see the QA checklist",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I build a custom theme or customise an existing one?",
        a: "If an existing theme is close to the brand, targeted custom sections and template work are usually the right tool. If the brand needs a distinct experience — and the store will live on that identity for years — a custom theme built properly is the better long-term decision.",
      },
      {
        q: "Who can change things after the theme is handed over?",
        a: "Whatever is exposed as a setting or a section in the Shopify customiser, the store owner can change without touching code. What isn’t exposed is a small piece of development work — which is exactly why the exposure decision happens during planning, not after.",
      },
      {
        q: "Is the theme tested before it goes live?",
        a: "Yes. Responsive layouts across devices, keyboard access, forms, navigation, and cart behaviour are reviewed as part of the Test stage before anything opens.",
      },
    ],
    relatedServices: [
      "shopify-theme-development",
      "shopify-store-development",
      "shopify-qa-testing",
    ],
    relatedArticles: [
      "ollie-burwell-product-template",
      "vintage-art-garage-frame-option-model",
      "ollie-burwell-collection-architecture",
    ],
    relatedCaseStudies: ["ollie-burwell", "vintage-art-garage"],
  },
  {
    slug: "shopify-store-launch-checklist",
    label: "Store launch checklist",
    title:
      "Shopify Store Launch Checklist — Ship a Store That Holds Up | Ahmad Abdullah",
    description:
      "A launch checklist for Shopify stores: domains and redirects, payments and shipping, product data, navigation, performance baseline, and the checks that matter in the first week after opening.",
    kicker: "RESOURCE / CHECKLIST",
    h1: "The Shopify store",
    h1Accent: "launch checklist.",
    kind: "CHECKLIST",
    lede: "Launch day is the least interesting day a store has — if everything before it was done. This checklist covers what “ready” actually means, in the order it should be checked.",
    sections: [
      {
        heading: "Before the store opens",
        list: [
          "Domain connected, with redirects mapped for every URL customers might already have",
          "Payment methods enabled and tested end to end, including a failed payment",
          "Shipping zones, rates, and free-shipping thresholds verified against real addresses",
          "Tax behaviour checked across the regions the store serves",
          "Customer accounts, email flows, and order confirmations working",
          "404 page, search, and filter results behaving sensibly",
        ],
      },
      {
        heading: "Content and data",
        list: [
          "Product titles, descriptions, and images consistent across the catalogue",
          "Variants and options making sense on the product page, not just in the admin",
          "Collections organised so nothing overlaps or dead-ends",
          "Metafields used deliberately — and documented — not as a dumping ground",
          "Image alt text present and descriptive across product and content pages",
        ],
      },
      {
        heading: "Structure and performance",
        list: [
          "Navigation reachable from every page, on mobile and desktop",
          "A performance baseline recorded for the homepage, a collection, and a product page — so later changes have something to be measured against",
          "Core flows walked on a real phone: browse, search, product, cart, checkout",
          "Keyboard access checked on the key pages",
        ],
      },
      {
        heading: "The first week after launch",
        body: [
          "Most launch problems are small and appear under real traffic: a discount that only breaks at one subtotal, a link that 404s, an email that renders wrong. A short post-launch pass catches them while they’re cheap to fix.",
        ],
        list: [
          "Walk every order that has come in against what the customer saw",
          "Check the 404 and search reports for surprises",
          "Re-check performance on the pages with the most traffic",
          "Fix and re-verify each finding, then close it out in the release notes",
        ],
      },
    ],
    faqs: [
      {
        q: "When is a store actually “launch-ready”?",
        a: "When domains, redirects, payments, and tracking are configured, and the full test stage — devices, keyboard, forms, navigation, cart, checkout — has passed. A checklist is only as good as the re-verification behind it.",
      },
      {
        q: "Can I launch with an incomplete catalogue?",
        a: "Sometimes, yes — but the structure (collections, navigation, URL pattern) should be the finished structure, because retrofitting it later means redirects and lost search equity.",
      },
      {
        q: "What happens to old URLs when the store launches?",
        a: "Every URL customers or search engines might have is mapped to its new location with a redirect, so bookmarks and existing search results keep working.",
      },
    ],
    relatedServices: [
      "shopify-store-development",
      "shopify-qa-testing",
      "shopify-development",
    ],
    relatedArticles: [
      "vintage-art-garage-reopening-review",
      "prime-baby-gear-product-data",
      "paw-by-four-content-maintenance",
    ],
    relatedCaseStudies: ["prime-baby-gear"],
  },
  {
    slug: "shopify-qa-checklist",
    label: "QA testing checklist",
    title:
      "Shopify QA Testing Checklist — What to Verify Before Launch | Ahmad Abdullah",
    description:
      "A Shopify QA checklist that follows the customer: browse, search, filters, product, cart, checkout, and account — plus the data edge cases and the way findings get documented and re-verified.",
    kicker: "RESOURCE / CHECKLIST",
    h1: "The Shopify",
    h1Accent: "QA checklist.",
    kind: "CHECKLIST",
    lede: "QA is not a pass/fail badge. It’s walking the store the way customers do — and the way they won’t — before a problem reaches a real checkout.",
    sections: [
      {
        heading: "The core flows, in customer order",
        list: [
          "Browse: navigation, collections, sorting, pagination",
          "Search and filters: results that make sense, empty states that aren’t dead ends",
          "Product page: variants, options, images, information hierarchy",
          "Cart: quantities, discounts, shipping changes, item removal",
          "Checkout: every payment method, shipping option, and address edge case",
          "Post-purchase: confirmation, order status, and what the customer sees next",
        ],
      },
      {
        heading: "The data edge cases",
        list: [
          "A discount applied alone, then stacked with the others the store allows",
          "A variant with no stock, and a variant added back after a sale",
          "A customer in a shipping zone the store doesn’t serve",
          "A long product name, a price at a threshold boundary, an order at the free-shipping cutoff",
          "A return or exchange if the store offers one",
        ],
      },
      {
        heading: "How findings get recorded",
        body: [
          "A finding without reproduction steps is a rumour. Each issue is documented with the steps that produce it, where it was found, and how much it affects the customer — then the fix is verified against the original steps before the issue is closed.",
        ],
      },
      {
        heading: "When the pass is done",
        list: [
          "All findings fixed and re-verified",
          "The core flows re-walked end to end",
          "A sign-off record: what was checked, what was found, what changed",
        ],
      },
    ],
    faqs: [
      {
        q: "How big does a change have to be before it needs QA?",
        a: "Anything that touches a customer-facing flow. A new section on a busy template and a theme update both need the pass — the size of the check scales with the blast radius.",
      },
      {
        q: "Is testing done on the live store?",
        a: "On staging where it exists, and a smoke pass on production after each deploy. Payment flows are exercised in test mode — production card data is never used.",
      },
      {
        q: "What do I actually get at the end of a QA engagement?",
        a: "A documented set of findings with reproduction steps and impact, verification of the fixes, and the checklists to reuse for the next change.",
      },
    ],
    relatedServices: [
      "shopify-qa-testing",
      "shopify-checkout-testing",
      "shopify-mobile-testing",
    ],
    relatedArticles: [
      "nokoluxe-large-item-purchase-information",
      "prime-baby-gear-mobile-navigation",
      "ollie-burwell-seasonal-merchandising",
    ],
    relatedCaseStudies: ["nokoluxe", "prime-baby-gear"],
  },
  {
    slug: "shopify-checkout-testing-guide",
    label: "Checkout testing guide",
    title:
      "Shopify Checkout Testing Guide — a Deliberate End-to-End Pass | Ahmad Abdullah",
    description:
      "How checkout testing is done: every payment method including failures, shipping and tax edge cases, discount stacking, guest and registered paths, and verifying the order against what the customer saw.",
    kicker: "RESOURCE / GUIDE",
    h1: "A guide to testing",
    h1Accent: "Shopify checkout.",
    kind: "GUIDE",
    lede: "Checkout is where revenue is won or lost, and where bugs hurt the most. This is the shape of a deliberate checkout pass — built around the unusual order, not just the happy one.",
    sections: [
      {
        heading: "Why checkout bugs are the expensive ones",
        body: [
          "A broken banner is embarrassing. A checkout that silently miscalculates at a specific subtotal, or accepts an order it can’t fulfil, costs real money and real trust. Checkout testing is built to find exactly those corners — deliberately constructing the unusual order.",
        ],
      },
      {
        heading: "Payment methods",
        list: [
          "Every enabled method, through a completed order",
          "A failed payment, and what the customer sees and can do after it",
          "Retries and re-attempts, including 3D Secure where it applies",
          "The difference between a declined card and a cancelled checkout",
        ],
      },
      {
        heading: "Shipping, tax, and discounts",
        list: [
          "Each shipping zone and rate, verified against a real address",
          "Free-shipping thresholds at just under, exactly at, and just over",
          "Tax behaviour across regions and customer types",
          "Each discount alone, and in every combination the store allows",
        ],
      },
      {
        heading: "The verification that closes the loop",
        body: [
          "The order that comes out is checked against what the customer saw: items, totals, discounts, and the notifications sent. What the customer sees at the end is verified against what the store records — on desktop and on mobile, because mobile checkout is its own layout with its own failure modes.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you test with real payments?",
        a: "Where test keys and sandbox mode are available, payment flows are exercised in test mode — including failure paths. Production card data is never used for testing.",
      },
      {
        q: "Is mobile checkout tested separately?",
        a: "Yes. It has its own layout, field behaviour, and failure modes, so it gets its own pass end to end.",
      },
      {
        q: "How is this different on Shopify Plus?",
        a: "Plus adds extension points at each checkout step. Each extension is verified at its step, then the full order flow is re-walked — see the Plus testing guide.",
      },
    ],
    relatedServices: [
      "shopify-checkout-testing",
      "shopify-qa-testing",
      "shopify-plus",
    ],
    relatedArticles: [
      "nokoluxe-large-item-purchase-information",
      "paw-by-four-digital-and-physical-products",
      "prime-baby-gear-travel-system-details",
    ],
    relatedCaseStudies: ["nokoluxe", "paw-by-four"],
  },
  {
    slug: "shopify-plus-testing-guide",
    label: "Plus testing guide",
    title:
      "Shopify Plus Testing Guide — Extensions, Checkout & Scale | Ahmad Abdullah",
    description:
      "What Shopify Plus changes for testing: theme extensions, checkout UI extensions, account and order flows, and the performance work that higher traffic makes non-optional.",
    kicker: "RESOURCE / GUIDE",
    h1: "Testing Shopify",
    h1Accent: "Plus properly.",
    kind: "GUIDE",
    lede: "Plus unlocks more tools and raises the bar at the same time: more moving parts means more to build carefully and more to test. This is what the testing looks like when the stakes are larger.",
    sections: [
      {
        heading: "What Plus changes for testing",
        body: [
          "Plus stores usually carry more traffic, more apps, and a deeper feature set: theme extensions, checkout UI extensions, and account experiences that standard stores don’t have. Each of those is a new surface where a quiet regression can live.",
        ],
      },
      {
        heading: "Extensions, tested at their step",
        list: [
          "Each checkout UI extension verified at the step where it appears",
          "Extension behaviour with and without the data it expects",
          "The full order flow re-walked after every extension change",
          "Theme extensions checked across the templates they touch",
        ],
      },
      {
        heading: "Scale and traffic",
        list: [
          "Performance considered at every layer, not just the theme",
          "Caching and CDN behaviour verified for the pages that get the most traffic",
          "Checkout capacity reviewed before peak seasons and drops",
          "Third-party scripts audited for what they actually load at scale",
        ],
      },
      {
        heading: "Regression for a bigger store",
        body: [
          "On Plus, the cost of a small regression is bigger, so the discipline is tighter: affected flows are re-verified against the checklist before release, a smoke pass runs on the live store after deploy, and the release record closes with what was checked and verified.",
        ],
      },
    ],
    faqs: [
      {
        q: "How is checkout testing different on Plus?",
        a: "More extension points means more surface to verify: each extension at its step, plus the full order flow end to end.",
      },
      {
        q: "Do you help decide between Shopify and Shopify Plus?",
        a: "Yes — volume, feature needs, and long-term plans are compared against what each plan actually offers, before anything is built.",
      },
      {
        q: "Is Plus performance testing the same as standard?",
        a: "Same method — measure, find, fix, re-measure — with higher traffic and more extensions in the mix, so app and script weight gets reviewed more carefully.",
      },
    ],
    relatedServices: [
      "shopify-plus",
      "shopify-checkout-testing",
      "shopify-regression-testing",
    ],
    relatedArticles: [
      "nokoluxe-catalogue-performance",
      "ollie-burwell-product-template",
      "nokoluxe-brand-and-category-seo",
    ],
    relatedCaseStudies: ["nokoluxe"],
  },
  {
    slug: "shopify-mobile-testing-guide",
    label: "Mobile testing guide",
    title:
      "Shopify Mobile Testing Guide — Devices, Touch & Forms | Ahmad Abdullah",
    description:
      "A mobile testing guide for Shopify stores: layout across phone sizes, touch targets, form ergonomics, mobile navigation, and how performance is checked on the hardware customers actually carry.",
    kicker: "RESOURCE / GUIDE",
    h1: "A guide to Shopify",
    h1Accent: "mobile testing.",
    kind: "GUIDE",
    lede: "Most customers meet the store on a phone, and a phone is not a small desktop. This is what a proper mobile pass covers — and why it can’t be a narrower window on a laptop.",
    sections: [
      {
        heading: "Why mobile is its own pass",
        body: [
          "A mobile store has different text sizes, spacing, hit areas, input behaviour, and loading conditions. Breakpoints that work on phone and desktop can still break in between, and the details — a field that triggers zoom, a button under the thumb’s natural reach — are only visible when the mobile experience is tested as its own thing.",
        ],
      },
      {
        heading: "Layout and touch",
        list: [
          "Readability and spacing across phone sizes, from small to large",
          "Touch targets big enough to hit without care",
          "Scroll interactions, sticky elements, and anything that moves",
          "The home indicator and safe areas on modern phones",
          "Tablet viewports, where the in-between breaks live",
        ],
      },
      {
        heading: "Forms and input",
        list: [
          "The right input type for each field, so the right keyboard appears",
          "No zoom on focus",
          "Autocomplete where it helps, and validation messages that explain what went wrong",
          "The form walked end to end on a real device",
        ],
      },
      {
        heading: "Mobile performance",
        body: [
          "The same page that feels quick on a laptop can feel slow on a mid-range phone. The mobile pass includes how fast the page becomes usable on the device — image weight, asset size, and the first meaningful content, not just a desktop emulator’s numbers.",
        ],
        list: [
          "Images served at the right size for the screen",
          "Asset weight reviewed for mobile connections",
          "LCP checked on real devices where they matter to the store",
        ],
      },
    ],
    faqs: [
      {
        q: "Which devices are covered?",
        a: "The devices and viewports that matter to the store’s customers — a range from small phones to large ones, across the browsers those devices actually run.",
      },
      {
        q: "Are tablets included?",
        a: "Yes — tablet viewports are part of the layout coverage, since breakpoints that work at both ends can still break in between.",
      },
      {
        q: "Is mobile checkout tested separately?",
        a: "Yes — its own layout quirks and field behaviour, verified end to end.",
      },
    ],
    relatedServices: [
      "shopify-mobile-testing",
      "shopify-performance-testing",
      "shopify-accessibility-testing",
    ],
    relatedArticles: [
      "prime-baby-gear-mobile-navigation",
      "ollie-burwell-mobile-image-direction",
      "nokoluxe-responsive-outdoor-imagery",
      "paw-by-four-mobile-choice",
    ],
    relatedCaseStudies: ["prime-baby-gear", "ollie-burwell"],
  },
  {
    slug: "shopify-performance-checklist",
    label: "Performance checklist",
    title:
      "Shopify Performance Checklist — LCP, INP & CLS, Measured Properly | Ahmad Abdullah",
    description:
      "A performance checklist for Shopify stores: recording a baseline, the image and asset checks, auditing third-party apps and scripts, and re-measuring after every change.",
    kicker: "RESOURCE / CHECKLIST",
    h1: "The Shopify",
    h1Accent: "performance checklist.",
    kind: "CHECKLIST",
    lede: "Performance isn’t a score to chase — it’s the feeling of a store that responds. The discipline is measure, find, fix, re-measure. This checklist is that loop, written down.",
    sections: [
      {
        heading: "Record the baseline first",
        body: [
          "Optimisation without measurement is guessing. Before anything changes, the Core Web Vitals — LCP, INP, and CLS — are recorded on the homepage, a busy collection, and a product page. Every later decision is checked against those numbers.",
        ],
      },
      {
        heading: "Images and assets",
        list: [
          "Every image served at the sizes the layouts actually use",
          "Modern formats (WebP/AVIF) where the browser supports them",
          "Correct width and height so layout doesn’t shift as images load",
          "Below-the-fold images lazy-loaded",
          "Hero and above-the-fold images light enough to load fast",
        ],
      },
      {
        heading: "Apps and scripts",
        list: [
          "Each third-party script listed with what it loads and why it’s there",
          "Scripts that are only needed on certain pages, moved there",
          "What each app adds to page weight, made visible",
          "A decision recorded for each: keep, defer, or remove",
        ],
      },
      {
        heading: "Re-measure after the fix",
        body: [
          "A fix counts when the measurement says so. After each change the same pages are measured again, and the record shows what moved and why. Then it’s part of ongoing management — because apps get added and images get swapped, and a store without re-measurement slowly drifts into heaviness.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you fix our Core Web Vitals?",
        a: "The work follows the measure-fix-remeasure loop: find what’s actually moving LCP, INP, or CLS, address the real cause, and verify with the measurement again.",
      },
      {
        q: "How much do third-party apps affect performance?",
        a: "Often significantly — a handful of scripts is usually responsible for most of the weight. That’s why each app’s contribution is made visible before it’s kept.",
      },
      {
        q: "How often should we re-measure?",
        a: "After every meaningful change, and on a regular cadence as part of ongoing management so drift gets caught early.",
      },
    ],
    relatedServices: [
      "shopify-performance-testing",
      "shopify-store-maintenance",
      "shopify-theme-development",
    ],
    relatedArticles: [
      "prime-baby-gear-image-performance",
      "nokoluxe-catalogue-performance",
    ],
    relatedCaseStudies: ["nokoluxe", "prime-baby-gear"],
  },
  {
    slug: "common-shopify-store-issues",
    label: "Common store issues",
    title:
      "Common Shopify Store Issues — What Comes Up, and How It’s Fixed | Ahmad Abdullah",
    description:
      "The Shopify store issues that recur: catalogue structure drift, metafields used as a dumping ground, quiet breakage after app updates, discount edge cases, and what keeps them from coming back.",
    kicker: "RESOURCE / GUIDE",
    h1: "The common Shopify",
    h1Accent: "store issues.",
    kind: "GUIDE",
    lede: "Stores don’t usually fail loudly. They drift: collections that start to overlap, a discount that only breaks at one subtotal, a page that quietly stops working after an app update. Here are the patterns that recur — and the discipline that keeps them fixed.",
    sections: [
      {
        heading: "Catalogue and structure",
        list: [
          "Collections that overlap, so the same product appears everywhere and nowhere",
          "Variants that fight the catalogue instead of organising it",
          "Navigation that grew one addition at a time until it stopped making sense",
          "URLs that changed without redirects, leaving broken links in search results",
        ],
      },
      {
        heading: "Data and metafields",
        list: [
          "Metafields used as a dumping ground, then found when a section needs them",
          "Product information that’s inconsistent between similar items",
          "Images without alt text, or alt text that’s just the filename",
          "Content that was written for a season and never retired",
        ],
      },
      {
        heading: "Theme, apps, and checkout",
        list: [
          "A section that quietly breaks after an app update — found by a customer, not a test",
          "A discount that stacks in a way nobody intended, at one specific subtotal",
          "Mobile layout drift: fine on phone and desktop, broken in between",
          "Checkout behaviour that changed with a platform release",
        ],
      },
      {
        heading: "The state of the store",
        list: [
          "A temporary closure that reads as an abandoned store",
          "A seasonal edit left live after the season ended",
          "Resources and guides published, then owned by nobody",
        ],
        body: [
          "The fix for all of these is the same discipline: changes tested against a known-good state before and after they ship, findings documented and re-verified, and the store’s structure reviewed as part of ongoing management rather than only when something is visibly wrong.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you fix a store another developer built?",
        a: "Yes. The first step is a review of the theme, apps, and structure, so future work is planned against how the store actually works.",
      },
      {
        q: "What does ongoing maintenance cover?",
        a: "Product and content updates, theme maintenance, bug fixing tracked to closure, SEO maintenance as pages change, and continuous optimisation — with the same regression discipline as a build.",
      },
      {
        q: "How is a temporarily closed store handled?",
        a: "The closure is treated as part of the customer experience: a clear reopening message, the storefront kept in a known state, and a checklist for when it opens again.",
      },
    ],
    relatedServices: [
      "shopify-store-maintenance",
      "shopify-qa-testing",
      "shopify-store-development",
    ],
    relatedArticles: [
      "vintage-art-garage-temporary-closure",
      "vintage-art-garage-reopening-review",
      "paw-by-four-content-maintenance",
      "ollie-burwell-seasonal-merchandising",
    ],
    relatedCaseStudies: ["vintage-art-garage", "paw-by-four"],
  },
];

export const resourceBySlug: Record<string, ResourceData> = Object.fromEntries(
  resources.map((r) => [r.slug, r]),
);
export const resourceSlugs = resources.map((r) => r.slug);

/** Resources relevant to a given service slug (for service-page cross-links). */
export function resourcesForService(serviceSlug: string): ResourceData[] {
  return resources
    .filter((r) => r.relatedServices.includes(serviceSlug))
    .slice(0, 3);
}
