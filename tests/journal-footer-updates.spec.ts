import { test, expect } from "@playwright/test";
import { articles } from "../src/data/blog";

const batchOneSlugs = [
  "shopify-theme-development-best-practices",
  "shopify-wcag-remediation",
  "custom-shopify-theme-vs-premium",
  "shopify-core-web-vitals",
  "shopify-keyboard-navigation-accessibility",
  "when-to-build-custom-shopify-theme",
  "shopify-theme-speed-optimization",
  "shopify-theme-architecture",
  "shopify-accessibility-testing-workflow",
  "shopify-theme-maintenance",
];

test("publication dates are fixed: the 22 Jul–22 Sep 2026 baseline plus two owner-dated guide batches", () => {
  const baseline = articles.filter((a) => a.project !== "shopify-guides");
  const guides = articles.filter((a) => a.project === "shopify-guides");
  const batchOne = guides.filter((g) => batchOneSlugs.includes(g.slug));
  const batchTwo = guides.filter((g) => !batchOneSlugs.includes(g.slug));
  expect(articles).toHaveLength(55);
  expect(baseline).toHaveLength(35);
  expect(guides).toHaveLength(20);
  expect(batchOne).toHaveLength(10);
  expect(batchTwo).toHaveLength(10);
  const baseDates = baseline.map((a) => a.publishedAt).sort();
  expect(baseDates).toHaveLength(35);
  expect(new Set(baseDates).size).toBe(35);
  expect(baseDates[0]).toBe("2026-07-22");
  expect(baseDates.at(-1)).toBe("2026-09-22");
  for (const article of baseline) {
    expect(article.updatedAt).toBe("2026-09-22");
    expect(article.updatedAt! >= article.publishedAt).toBe(true);
    if (article.featuredImage.src)
      expect(article.featuredImage.capturedAt).toBe("2026-09-20");
  }
  // Batch one: the original guides, owner-requested editorial dates across
  // the first fifteen-day window, original editorial heroes, no capture
  // provenance.
  const b1 = batchOne
    .map((g) => g.publishedAt)
    .sort((x, y) => x.localeCompare(y));
  expect(new Set(b1).size).toBe(10);
  expect(b1[0] >= "2026-10-02").toBe(true);
  expect(b1.at(-1)! <= "2026-10-16").toBe(true);
  for (const g of batchOne) {
    expect(g.updatedAt).toBe("2026-10-16");
    expect(g.updatedAt! >= g.publishedAt).toBe(true);
    expect(g.featuredImage.src).toContain("/blog/shopify-guides/");
    expect(g.featuredImage.capturedAt).toBeUndefined();
  }
  // Batch two: the problem-led technical guides, owner-requested editorial
  // dates across the following fifteen-day window. Heroes are either
  // documented storefront captures (captioned as such) or honest
  // approved-imagery-pending placeholders — never AI images, and never
  // carrying capture provenance.
  const b2 = batchTwo
    .map((g) => g.publishedAt)
    .sort((x, y) => x.localeCompare(y));
  expect(new Set(b2).size).toBe(10);
  expect(b2[0] >= "2026-10-05").toBe(true);
  expect(b2.at(-1)! <= "2026-10-19").toBe(true);
  for (const g of batchTwo) {
    expect(g.updatedAt).toBe("2026-10-19");
    expect(g.updatedAt! >= g.publishedAt).toBe(true);
    expect(g.featuredImage.capturedAt).toBeUndefined();
    if (g.featuredImage.src) {
      expect(
        /\/blog\/(prime-baby-gear|ollie-burwell|nokoluxe|paw-by-four)\//.test(
          g.featuredImage.src,
        ),
      ).toBe(true);
      expect(g.featuredImage.alt).toContain("documented storefront");
    }
  }
});

test("article images retain descriptions and full-size access without capture-date prompts", async ({
  page,
}) => {
  await page.goto("/blogs/prime-baby-gear-navigation");
  const captions = await page
    .locator(".journal-image figcaption")
    .allTextContents();
  expect(captions.length).toBeGreaterThan(0);
  for (const caption of captions) {
    expect(caption.trim()).not.toBe("");
    expect(caption).not.toMatch(/Captured \d{4}|Open image to inspect/);
  }
  const imageLink = page.locator(
    '.article-feature a[aria-label^="Open full-size image"]',
  );
  await expect(imageLink).toHaveAttribute("target", "_blank");
  await expect(imageLink).toHaveAttribute("href", /\.webp$/);
});

for (const width of [320, 390, 768, 1024, 1440, 2560]) {
  test(`footer project invitation fits and reaches contact at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".browser-chrome")).not.toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("formandfield.demo");
    await expect(page.locator(".browser-chrome > span")).toHaveCount(0);
    await expect(page.locator(".footer-project-orbit")).toHaveCount(0);
    const cta = page.locator(".footer-project-link");
    await cta.scrollIntoViewIfNeeded();
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      const box = (await cta.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.height).toBeGreaterThanOrEqual(44);
      for (const child of await cta
        .locator("strong,.footer-project-copy > span,.footer-project-arrow")
        .all()) {
        const childBox = (await child.boundingBox())!;
        expect(childBox.x + childBox.width).toBeLessThanOrEqual(
          box.x + box.width,
        );
        expect(childBox.y + childBox.height).toBeLessThanOrEqual(
          box.y + box.height,
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.keyboard.press("Tab");
    await cta.evaluate((el) =>
      (el as HTMLElement).focus({ preventScroll: true }),
    );
    await expect(cta).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contact$/);
  });
}
