/**
 * Service page content for the top-level Shopify service pages.
 * Copy describes services actually offered on this site: store and theme
 * development, store setup/migration, product data, SEO, conversion
 * experience, performance, ongoing management, and development/QA testing.
 * No invented clients, metrics, or results.
 */
export interface ServiceSection {
  heading: string;
  body?: string[];
  list?: string[];
}
export interface ServiceFaq {
  q: string;
  a: string;
}
export interface ServicePageData {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  h1: string;
  h1Accent?: string;
  lede: string;
  sections: ServiceSection[];
  faqs: ServiceFaq[];
  relatedServices: string[];
  relatedCaseStudies: string[];
  journalLink?: { href: string; label: string };
}

export const servicePages: ServicePageData[] = [
  {
    slug: "shopify-development",
    title:
      "Shopify Development Services — Themes, Stores & QA | Ahmad Abdullah",
    description:
      "Shopify development services: custom theme development, store setup, product data, SEO, conversion experience, performance, QA testing, and ongoing maintenance.",
    kicker: "SERVICES / SHOPIFY DEVELOPMENT",
    h1: "Shopify development,",
    h1Accent: "end to end.",
    lede: "One developer across the whole store: custom theme work, store setup and data, search visibility, conversion experience, performance, and the testing that makes a launch dependable. This is the map of the services on this site.",
    sections: [
      {
        heading: "What's included",
        body: [
          "The services below are grouped the way a store actually ships: build the experience, put real data in it, make it findable, make it fast, test it properly, and keep it healthy after launch.",
        ],
      },
      {
        heading: "The working method",
        body: [
          "Every engagement moves through the same nine stages — Discover, Plan, Design, Develop, Populate, Optimize, Test, Launch, Maintain. The Test stage is not an afterthought: device layouts, keyboard access, forms, navigation, cart, and integrations are reviewed before anything opens.",
        ],
      },
      {
        heading: "Stores I've worked with",
        body: [
          "Baby gear and family, fashion and resort wear, outdoor living, vintage automotive art, and pet care — five real Shopify stores, each documented with field notes in the journal.",
        ],
        list: [
          "Prime Baby Gear — baby gear & family",
          "Ollie Burwell — fashion & resort wear",
          "Nokoluxe — outdoor living",
          "Vintage Art Garage — vintage automotive art",
          "Paw by Four — pet care & education",
        ],
      },
      {
        heading: "A note on claims",
        body: [
          "Case studies on this site describe the public stores and the development and QA approach applied to them. They do not cite sales, rankings, or conversion results that weren't measured and supplied.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you work with Shopify, Shopify Plus, or both?",
        a: "Both. Standard Shopify storefronts and Shopify Plus work, including theme extensions and checkout customisation where the plan allows.",
      },
      {
        q: "Can you take over an existing store?",
        a: "Yes. Store management, theme maintenance, bug fixing, and feature changes are part of the ongoing work, and migrations from other platforms start with a technical audit and a redirect plan.",
      },
      {
        q: "How does testing fit into development?",
        a: "Testing runs alongside development, not after it. Checkout, cart, navigation, forms, and device layouts are checked at each stage, with a structured regression pass before launch and before meaningful releases.",
      },
    ],
    relatedServices: [
      "shopify-theme-development",
      "shopify-store-development",
      "shopify-qa-testing",
      "shopify-plus",
      "shopify-store-maintenance",
    ],
    relatedCaseStudies: [
      "prime-baby-gear",
      "ollie-burwell",
      "nokoluxe",
      "paw-by-four",
    ],
  },
  {
    slug: "shopify-theme-development",
    title: "Shopify Theme Development — Custom Liquid Themes | Ahmad Abdullah",
    description:
      "Custom Shopify theme development in Liquid: sections, templates, and responsive components built around your brand, with clean maintainable code and SEO-ready structure.",
    kicker: "SERVICES / THEME DEVELOPMENT",
    h1: "Shopify theme",
    h1Accent: "development.",
    lede: "Custom Liquid themes built around your brand — not a template with your logo on it. Every section, template, and interaction is written to be clear to read, easy to maintain, and kind to search engines and shoppers.",
    sections: [
      {
        heading: "What custom theme work covers",
        list: [
          "Custom Shopify themes from design to shipped theme",
          "Liquid templates and custom sections",
          "Product and collection templates",
          "Responsive components across phone, tablet, and desktop",
          "Cart and checkout-adjacent experiences",
          "Custom functionality where the theme needs it",
        ],
      },
      {
        heading: "How themes are built here",
        body: [
          "Design comes first: typography, imagery, and the shopping journey get one coherent direction. Then the theme is developed in reusable pieces — sections and templates that a store owner or a future developer can understand and change without touching the rest of the code.",
          "The markup itself is part of the job: semantic headings, descriptive links and images, and structure that supports the technical SEO and accessibility work rather than working against it.",
        ],
      },
      {
        heading: "Maintainability as a feature",
        body: [
          "A theme is a long-term asset. Code is kept plain and consistent, settings are exposed where merchants should control them, and the result is a store that can be updated, extended, and handed over without archaeology.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you build a theme from a design?",
        a: "Yes — from provided designs or mockups, or from a design direction developed together. The Design stage exists for exactly that: one coherent visual direction before a line of Liquid is written.",
      },
      {
        q: "Do you customise existing themes or always build custom?",
        a: "Both. Where an existing theme is close, targeted custom sections and template work are the right tool. Where the brand needs a distinct experience, a custom theme is built properly from the ground up.",
      },
      {
        q: "Is the theme tested before launch?",
        a: "Yes. Responsive layouts across devices, keyboard access, forms, navigation, and cart behaviour are reviewed as part of the Test stage before anything goes live.",
      },
    ],
    relatedServices: [
      "shopify-store-development",
      "shopify-qa-testing",
      "shopify-performance-testing",
    ],
    relatedCaseStudies: ["prime-baby-gear", "ollie-burwell"],
    journalLink: { href: "/blogs", label: "Field notes on storefront themes" },
  },
  {
    slug: "shopify-store-development",
    title: "Shopify Store Development — Setup, Data & Launch | Ahmad Abdullah",
    description:
      "Shopify store development and setup: store configuration, navigation and collections, products and variants, metafields, migration planning, and a launch-ready storefront.",
    kicker: "SERVICES / STORE DEVELOPMENT",
    h1: "Shopify store",
    h1Accent: "development.",
    lede: "A well-organized store from day one. Store configuration, navigation, product data, and the structural decisions that make everything else — theme, SEO, apps, marketing — work better.",
    sections: [
      {
        heading: "What's covered",
        list: [
          "Store configuration and settings that fit the business",
          "Navigation and collection architecture",
          "Products, variants, and metafields",
          "Bulk data preparation and image organization",
          "Platform migration from other commerce systems",
          "Redirect planning so nothing points at a ghost",
        ],
      },
      {
        heading: "Why structure matters before design",
        body: [
          "Most struggling stores struggle because their structure was an accident: collections that overlap, variants that fight the catalog, metafields used as a dumping ground. The Plan stage maps navigation, collections, page types, and integrations first, so the theme and the data are built on the same skeleton.",
        ],
      },
      {
        heading: "Migrations, handled",
        body: [
          "Moving from Magento, WooCommerce, BigCommerce, WordPress, Wix, Squarespace, PrestaShop, OpenCart, or a custom platform starts with an audit: catalog, product attributes, URL structure, and integrations are mapped before a transition plan is written. Redirects are planned so existing search equity and customer bookmarks survive the move.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you prepare product data, or just build the theme?",
        a: "Product data is part of the work: entry, bulk preparation, variant setup, image organization, and collection organization. Clean, consistent product information is what helps customers find and choose the right product.",
      },
      {
        q: "Can you migrate my store from another platform?",
        a: "Yes. Migration work starts with a technical audit and a plan for products, variants, content, URLs, and integrations, with redirect planning handled explicitly.",
      },
      {
        q: "What does 'launch-ready' mean in practice?",
        a: "Domains, redirects, payment configuration, tracking, and the full Test stage sign-off — device layouts, keyboard access, forms, navigation, cart, and integrations — completed before the store opens.",
      },
    ],
    relatedServices: [
      "shopify-theme-development",
      "shopify-qa-testing",
      "shopify-development",
    ],
    relatedCaseStudies: ["nokoluxe", "paw-by-four"],
  },
  {
    slug: "shopify-qa-testing",
    title:
      "Shopify QA Testing — Checkout, Mobile, Performance & More | Ahmad Abdullah",
    description:
      "Shopify QA and testing services: checkout and payment flows, mobile device testing, performance and Core Web Vitals, accessibility, and regression testing for Shopify stores.",
    kicker: "SERVICES / QA & TESTING",
    h1: "Shopify QA",
    h1Accent: "& testing.",
    lede: "A store is only as reliable as its weakest flow. QA here means walking the store the way customers do — and the way they won't — before problems reach a real checkout.",
    sections: [
      {
        heading: "What Shopify QA covers",
        list: [
          "Checkout, payment, and order-completion flows",
          "Cart, discounts, shipping, and tax behaviour",
          "Mobile device and viewport testing",
          "Performance and Core Web Vitals",
          "Accessibility: keyboard, forms, contrast, screen readers",
          "Regression testing across theme and app changes",
        ],
      },
      {
        heading: "Why testing is a service, not a step",
        body: [
          "Shopify stores change constantly — theme edits, app updates, platform releases, seasonal campaigns. Each change is a chance for something quiet to break: a discount that doesn't stack, a form that fails on a specific phone, a button that disappears at a specific width. Structured testing turns that risk into a checklist.",
        ],
      },
      {
        heading: "How a testing engagement works",
        body: [
          "It starts with a test plan: the flows that matter for this store, the devices and browsers that matter to its customers, and the checks that prove nothing regressed. Findings are documented with steps to reproduce, prioritized by customer impact, and re-verified after fixes.",
        ],
      },
      {
        heading: "The deeper testing areas",
        body: [
          "Each of the areas below has its own page with the specific checks involved:",
        ],
        list: [
          "Checkout testing — payments, shipping, discounts, order completion",
          "Mobile testing — devices, touch, forms, and mobile performance",
          "Performance testing — Core Web Vitals and what moves them",
          "Accessibility testing — WCAG 2.1 AA checks on real flows",
          "Regression testing — keeping releases safe",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you test only my own theme, or the whole customer flow?",
        a: "The whole flow: browse, search, filters, product pages, cart, checkout, payment, and post-purchase — across the devices and browsers your actual customers use.",
      },
      {
        q: "What do I get at the end of a QA engagement?",
        a: "A documented set of findings with reproduction steps and impact, verification of the fixes, and a sign-off record for the release — plus the checklists to reuse for the next change.",
      },
      {
        q: "Can you test a store I didn't build?",
        a: "Yes. QA is store-agnostic: the flows, devices, and standards are the same regardless of who wrote the theme. A fresh set of eyes is often the point.",
      },
    ],
    relatedServices: [
      "shopify-checkout-testing",
      "shopify-mobile-testing",
      "shopify-performance-testing",
      "shopify-accessibility-testing",
      "shopify-regression-testing",
    ],
    relatedCaseStudies: ["prime-baby-gear", "nokoluxe", "paw-by-four"],
    journalLink: {
      href: "/blogs",
      label: "Storefront notes from five real stores",
    },
  },
  {
    slug: "shopify-plus",
    title: "Shopify Plus Development & QA | Ahmad Abdullah",
    description:
      "Shopify Plus development and quality assurance: Plus theme extensions, checkout customisation, Plus-specific flows, and structured testing for Plus stores.",
    kicker: "SERVICES / SHOPIFY PLUS",
    h1: "Shopify Plus",
    h1Accent: "development & QA.",
    lede: "Plus unlocks different tools — theme extensions, checkout customisation, more granular flows. It also raises the bar: more moving parts means more to build carefully and more to test.",
    sections: [
      {
        heading: "What Plus work covers",
        list: [
          "Plus theme extensions and advanced custom sections",
          "Checkout UI extensions and checkout.liquid where the plan allows",
          "Plus-specific flows and account experiences",
          "Performance work tuned for higher-traffic stores",
          "Structured QA for the deeper Plus feature set",
        ],
      },
      {
        heading: "Building for scale, not just features",
        body: [
          "Plus stores usually carry more traffic, more apps, and more merchandising surface. The same discipline applies with higher stakes: clean maintainable Liquid, performance considered at every layer, and testing that covers the flows that actually move revenue.",
        ],
      },
      {
        heading: "Testing Plus properly",
        body: [
          "Plus features deserve their own test passes: extension behaviour at every step of checkout, edge cases in the deeper account and order flows, and regression coverage so a routine release doesn't undo a careful build.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you work with Shopify Plus stores specifically?",
        a: "Yes — Plus theme extensions, checkout customisation where available, and the structured QA that larger stores need.",
      },
      {
        q: "Can you help decide between Shopify and Shopify Plus?",
        a: "The Discover stage covers this: volume, feature needs, and long-term plans are compared against what each plan actually offers, before anything is built.",
      },
      {
        q: "Is checkout testing different on Plus?",
        a: "Yes — more extension points means more surface to verify. Checkout testing on Plus covers each extension at its step, plus the full order flow end to end.",
      },
    ],
    relatedServices: [
      "shopify-theme-development",
      "shopify-qa-testing",
      "shopify-performance-testing",
    ],
    relatedCaseStudies: [],
  },
  {
    slug: "shopify-store-maintenance",
    title: "Shopify Store Maintenance & Management | Ahmad Abdullah",
    description:
      "Ongoing Shopify store management: theme maintenance, bug fixing, product and content updates, feature changes, SEO maintenance, and continuous optimization.",
    kicker: "SERVICES / STORE MANAGEMENT",
    h1: "Store",
    h1Accent: "maintenance.",
    lede: "A launch is a beginning, not a goodbye. Practical ongoing support that keeps the store current, functional, and ready for what comes next.",
    sections: [
      {
        heading: "What ongoing management covers",
        list: [
          "Product and content updates",
          "Theme maintenance and small feature changes",
          "Bug fixing, tracked to closure",
          "SEO maintenance as pages and products change",
          "Ongoing performance and experience optimization",
        ],
      },
      {
        heading: "Why stores need this",
        body: [
          "Catalogs change, apps update, seasons arrive, and customers keep finding the corners that weren't tested. A store without ongoing care quietly drifts: broken redirects, outdated product information, performance that erodes as apps accumulate.",
        ],
      },
      {
        heading: "How it runs",
        body: [
          "Work is documented and prioritized, changes are tested before they go live — the same regression discipline as a build — and the store owner always knows what changed and why.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you offer ongoing support after launch?",
        a: "Yes. Ongoing management covers product and content updates, theme maintenance, bug fixing, feature changes, SEO maintenance, and continuous optimization.",
      },
      {
        q: "What happens when I report a bug?",
        a: "It's reproduced, documented, fixed, and re-verified before sign-off. Nothing is closed on 'looks fine' alone.",
      },
      {
        q: "Can you take over a store another developer built?",
        a: "Yes. The first step is a review of the theme, apps, and structure, so future work is planned against how the store actually works.",
      },
    ],
    relatedServices: [
      "shopify-development",
      "shopify-regression-testing",
      "shopify-qa-testing",
    ],
    relatedCaseStudies: ["vintage-art-garage", "nokoluxe"],
  },
  {
    slug: "shopify-checkout-testing",
    title:
      "Shopify Checkout Testing — Payments, Shipping & Orders | Ahmad Abdullah",
    description:
      "Shopify checkout testing: payment methods, shipping and tax edge cases, discounts and stacking, guest and registered flows, and order completion verified end to end.",
    kicker: "SERVICES / CHECKOUT TESTING",
    h1: "Checkout",
    h1Accent: "testing.",
    lede: "Checkout is where revenue is won or lost. Every payment method, shipping option, discount rule, and order edge case is walked deliberately — before a customer has to walk it for you.",
    sections: [
      {
        heading: "What gets tested",
        list: [
          "Every enabled payment method, including failures and retries",
          "Shipping rates, free-shipping thresholds, and address edge cases",
          "Tax behaviour across regions and customer types",
          "Discounts, codes, and stacking rules",
          "Guest and registered checkout paths",
          "Order completion, confirmation, and post-purchase pages",
        ],
      },
      {
        heading: "The edge cases that matter",
        body: [
          "Most checkout bugs hide in the corners: the discount that only breaks at a specific subtotal, the payment method that fails but doesn't say why, the shipping option that appears for an address it shouldn't serve. Testing is built around finding exactly these — deliberately constructing the unusual order, not just the happy one.",
        ],
      },
      {
        heading: "Verification, not assumption",
        body: [
          "Each flow is verified against what the order should look like after it completes: items, totals, discounts, and notifications. What the customer sees at the end is checked against what the store records.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you test with real payments?",
        a: "Where test keys and sandbox mode are available, payment flows are exercised in test mode — including failure paths. Production card data is never used for testing.",
      },
      {
        q: "How do discounts get checked?",
        a: "Each discount rule is applied alone and in combination with the others the store allows, across the order values where thresholds change, to verify the totals a customer actually sees.",
      },
      {
        q: "Is mobile checkout tested separately?",
        a: "Yes. Checkout on mobile has its own layout, its own field behaviour, and its own failure modes — it's tested as its own pass, not as an afterthought on desktop.",
      },
    ],
    relatedServices: [
      "shopify-qa-testing",
      "shopify-mobile-testing",
      "shopify-regression-testing",
    ],
    relatedCaseStudies: ["prime-baby-gear", "paw-by-four"],
  },
  {
    slug: "shopify-mobile-testing",
    title:
      "Shopify Mobile Testing — Devices, Touch & Performance | Ahmad Abdullah",
    description:
      "Shopify mobile testing: real device and viewport coverage, touch targets, forms, mobile navigation, cart and checkout flows, and mobile-specific performance checks.",
    kicker: "SERVICES / MOBILE TESTING",
    h1: "Mobile",
    h1Accent: "testing.",
    lede: "Most of your customers will meet the store on a phone. Mobile testing covers what desktop testing can't see: touch behaviour, small-viewport layout, form ergonomics, and how the store feels on the hardware your customers actually carry.",
    sections: [
      {
        heading: "What gets tested",
        list: [
          "Layout and readability across phone sizes, from small to large",
          "Touch targets, tap behaviour, and scroll interactions",
          "Forms: input types, zoom on focus, validation messages",
          "Mobile navigation, search, and filters",
          "Cart and checkout flows on mobile",
          "Image and asset weight on mobile connections",
        ],
      },
      {
        heading: "More than shrinking the screen",
        body: [
          "A mobile store is not a desktop store with the window narrowed. Text sizes, spacing, hit areas, and loading behaviour all change. Testing checks the mobile experience as its own thing — including the details like a form field that triggers zoom, or a button that sits under the thumb's natural reach.",
        ],
      },
      {
        heading: "Mobile performance as part of testing",
        body: [
          "The same page that feels quick on a laptop can feel slow on a mid-range phone. Mobile passes include how fast the page becomes usable on the device, not just in a desktop emulator.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which devices are covered?",
        a: "The plan covers the devices and viewports that matter to the store's customers — a range from small phones to large ones, across the browsers those devices actually run.",
      },
      {
        q: "Do you test mobile checkout?",
        a: "Yes — mobile checkout is a separate pass with its own layout quirks and field behaviour, verified end to end.",
      },
      {
        q: "What about tablets?",
        a: "Tablet viewports are included in the layout coverage, since breakpoints that work on phone and desktop can still break in between.",
      },
    ],
    relatedServices: [
      "shopify-qa-testing",
      "shopify-performance-testing",
      "shopify-accessibility-testing",
    ],
    relatedCaseStudies: ["ollie-burwell", "nokoluxe"],
  },
  {
    slug: "shopify-performance-testing",
    title: "Shopify Performance Testing & Core Web Vitals | Ahmad Abdullah",
    description:
      "Shopify performance testing: Core Web Vitals (LCP, INP, CLS), image and asset weight, app and script impact, and a measure-fix-remeasure approach to a fast storefront.",
    kicker: "SERVICES / PERFORMANCE TESTING",
    h1: "Performance",
    h1Accent: "testing.",
    lede: "Performance isn't a score to chase — it's the feeling of a store that responds. Testing measures what matters, finds what's causing the weight, and verifies the fix moved the number.",
    sections: [
      {
        heading: "What gets measured",
        list: [
          "Core Web Vitals: LCP, INP, and CLS on the pages that matter",
          "Image and asset weight, including responsive variants",
          "Third-party app and script impact",
          "JavaScript and CSS payloads",
          "The loading experience, not just final load time",
        ],
      },
      {
        heading: "Measure, find, fix, re-measure",
        body: [
          "Optimization without measurement is guessing. The pass starts with real numbers on the store's own pages, identifies what's actually contributing — often a handful of images or scripts rather than the whole theme — fixes are made, and the numbers are checked again. A fix counts when the measurement says so.",
        ],
      },
      {
        heading: "Performance as a habit",
        body: [
          "Apps get added, images get swapped, campaigns get built. Performance testing isn't only for launch — it's part of ongoing management, so the store doesn't slowly drift into heaviness.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you fix our Core Web Vitals?",
        a: "Performance work follows the measure-fix-remeasure loop: find what's moving LCP, INP, or CLS, address the real cause, and verify with the measurement again.",
      },
      {
        q: "Do third-party apps affect performance?",
        a: "Often significantly. App and script impact is reviewed as part of the pass, so decisions about what a store actually needs are made with the weight visible.",
      },
      {
        q: "Is performance tested on mobile?",
        a: "Yes — mobile devices are where performance problems are felt most, so mobile is part of every performance pass, not an extra.",
      },
    ],
    relatedServices: [
      "shopify-qa-testing",
      "shopify-mobile-testing",
      "shopify-store-maintenance",
    ],
    relatedCaseStudies: ["nokoluxe", "prime-baby-gear"],
  },
  {
    slug: "shopify-accessibility-testing",
    title: "Shopify Accessibility Testing — WCAG 2.1 AA | Ahmad Abdullah",
    description:
      "Shopify accessibility testing against WCAG 2.1 AA: keyboard navigation, forms and labels, contrast, screen reader landmarks, alt text, and reduced-motion support on real store flows.",
    kicker: "SERVICES / ACCESSIBILITY TESTING",
    h1: "Accessibility",
    h1Accent: "testing.",
    lede: "An accessible store works for everyone: keyboard users, screen reader users, customers on small screens, and anyone in a situation where the usual way of browsing is harder. Accessibility is tested on real flows, not just checked with a scanner.",
    sections: [
      {
        heading: "What gets checked",
        list: [
          "Keyboard navigation: order, focus visibility, and traps",
          "Forms: labels, field types, validation and error messages",
          "Colour contrast across themes and states",
          "Screen reader landmarks, headings, and structure",
          "Image alt text across product and content pages",
          "Motion: pause, respect for reduced-motion settings",
        ],
      },
      {
        heading: "Automation finds some, not all",
        body: [
          "Automated checks catch a meaningful share of problems — missing alt text, contrast failures, broken landmarks. But a lot of real accessibility is human: does the store make sense without a mouse? Do error messages actually explain what went wrong? Testing combines automated audits with manual passes on the flows customers use.",
        ],
      },
      {
        heading: "Accessible by construction",
        body: [
          "The work on this site is itself built to these standards — semantic structure, keyboard support, and reduced-motion handling throughout — so the testing discipline is applied to the same codebase it's offered to others.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which standard is the store tested against?",
        a: "WCAG 2.1 AA is the working target, checked across the flows customers actually use — browse, search, product, cart, checkout, and account areas.",
      },
      {
        q: "Is keyboard testing a separate pass?",
        a: "Yes. The store is walked end to end without a pointer: focus order, visible focus, and no traps at every step.",
      },
      {
        q: "Can you fix what the testing finds?",
        a: "Yes — accessibility fixes are theme work, and the same development capability that builds the store applies the corrections and re-verifies them.",
      },
    ],
    relatedServices: [
      "shopify-qa-testing",
      "shopify-mobile-testing",
      "shopify-theme-development",
    ],
    relatedCaseStudies: ["paw-by-four", "ollie-burwell"],
  },
  {
    slug: "shopify-regression-testing",
    title: "Shopify Regression Testing — Safe Releases | Ahmad Abdullah",
    description:
      "Shopify regression testing: structured re-verification across theme changes, app updates, and platform releases, with pre-release checklists and post-deploy smoke tests.",
    kicker: "SERVICES / REGRESSION TESTING",
    h1: "Regression",
    h1Accent: "testing.",
    lede: "Shopify stores change all the time — theme edits, app updates, platform releases, seasonal campaigns. Regression testing is the discipline that makes each change safe: re-checking what already works, so a new feature never quietly breaks an old one.",
    sections: [
      {
        heading: "What regression testing covers",
        list: [
          "Core flows re-verified after every meaningful change",
          "Theme changes checked against the pages they touch",
          "App updates verified against the features they affect",
          "Platform releases walked against the store's configuration",
          "Post-deploy smoke tests on the live store",
        ],
      },
      {
        heading: "Why it's needed on Shopify",
        body: [
          "A Shopify store is a moving platform: the theme, the apps, and the platform itself each change independently. The risk isn't one big failure — it's a small one, introduced quietly, discovered by a customer. Structured regression turns that pattern around: the change is checked against a known-good state before and after it ships.",
        ],
      },
      {
        heading: "How a release is checked",
        body: [
          "Before release: the affected flows are re-verified against the checklist. After deploy: a smoke pass on the live store confirms the change landed as intended and nothing adjacent moved. The result is a release record — what changed, what was checked, what was verified.",
        ],
      },
    ],
    faqs: [
      {
        q: "How big a change needs regression testing?",
        a: "Anything that touches a customer-facing flow. Small as a new section on a high-traffic template, large as a theme update — the size of the check scales with the blast radius.",
      },
      {
        q: "Do you build a test checklist for my store?",
        a: "Yes — the checklist is written for the store's actual flows and devices, so each release re-verifies the right things instead of a generic list.",
      },
      {
        q: "What happens after the deploy?",
        a: "A smoke pass on the live store: the changed flows and their neighbours are verified in production, and the release record closes.",
      },
    ],
    relatedServices: [
      "shopify-qa-testing",
      "shopify-checkout-testing",
      "shopify-store-maintenance",
    ],
    relatedCaseStudies: ["prime-baby-gear", "nokoluxe"],
  },
];

export const serviceBySlug: Record<string, ServicePageData> =
  Object.fromEntries(servicePages.map((s) => [s.slug, s]));
