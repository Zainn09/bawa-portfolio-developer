import { test, expect } from "@playwright/test";
import { articles } from "../src/data/blog";

test("article publication dates are fixed, varied, and span the requested two-month window", () => {
  const dates = articles.map((article) => article.publishedAt).sort();
  expect(dates).toHaveLength(35);
  expect(new Set(dates).size).toBe(35);
  expect(dates[0]).toBe("2026-07-22");
  expect(dates.at(-1)).toBe("2026-09-22");
  for (const article of articles) {
    expect(article.updatedAt).toBe("2026-09-22");
    expect(article.updatedAt! >= article.publishedAt).toBe(true);
    if (article.featuredImage.src)
      expect(article.featuredImage.capturedAt).toBe("2026-09-20");
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
