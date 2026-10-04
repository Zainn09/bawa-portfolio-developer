/**
 * Deterministic article → service mapping for internal linking.
 * The same article always links to the same services; the mapping is
 * driven by what the article is actually about (title, category, tags,
 * excerpt), never by keyword volume.
 */
const rules: Array<[RegExp, string[]]> = [
  [/\b(theme|liquid|template|section)\b/i, ["shopify-theme-development"]],
  [
    /\b(checkout|payment|discount|shipping|tax|order)\b/i,
    ["shopify-checkout-testing"],
  ],
  [/\b(mobile|touch|viewport|phone|responsive)\b/i, ["shopify-mobile-testing"]],
  [
    /\b(performance|lcp|inp|cls|loading|speed|core web vitals|fast)\b/i,
    ["shopify-performance-testing"],
  ],
  [
    /\b(accessibilit\w*|wcag|screen reader|keyboard|contrast|alt text)\b/i,
    ["shopify-accessibility-testing"],
  ],
  [
    /\b(regression|release|deploy|re-?verif\w*)\b/i,
    ["shopify-regression-testing"],
  ],
  [
    /\b(migration|migrate|metafield|product data|catalog|collection)\b/i,
    ["shopify-store-development"],
  ],
  [/\bplus\b/i, ["shopify-plus"]],
  [
    /\b(maintenance|management|ongoing|after (it|launch) is published)\b/i,
    ["shopify-store-maintenance"],
  ],
  [/\b(qa|test\w*|bug\w*|verif\w*|checklist)\b/i, ["shopify-qa-testing"]],
];

export function relatedServiceSlugs(text: string): string[] {
  const matched: string[] = [];
  for (const [pattern, slugs] of rules) {
    if (pattern.test(text)) {
      for (const slug of slugs) {
        if (!matched.includes(slug)) matched.push(slug);
      }
    }
  }
  const top = matched.slice(0, 3);
  return top.length ? top : ["shopify-development", "shopify-qa-testing"];
}

export function serviceLinkLabel(slug: string): string {
  const names: Record<string, string> = {
    "shopify-development": "Shopify development services",
    "shopify-theme-development": "Shopify theme development",
    "shopify-store-development": "Shopify store development",
    "shopify-qa-testing": "Shopify QA and testing",
    "shopify-plus": "Shopify Plus development & QA",
    "shopify-store-maintenance": "Shopify store maintenance",
    "shopify-checkout-testing": "Shopify checkout testing",
    "shopify-mobile-testing": "Shopify mobile testing",
    "shopify-performance-testing": "Shopify performance testing",
    "shopify-accessibility-testing": "Shopify accessibility testing",
    "shopify-regression-testing": "Shopify regression testing",
  };
  return names[slug] ?? slug.replace(/-/g, " ");
}
