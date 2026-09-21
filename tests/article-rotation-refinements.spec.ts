import { test, expect } from "@playwright/test";
import { articles } from "../src/data/blog";

test("no article exposes the archive link and every related card has its own visual", async ({
  request,
  page,
}) => {
  for (const article of articles) {
    const html = await (await request.get(`/blogs/${article.slug}`)).text();
    expect(html).not.toContain("Supplied project capture archive");
    expect(html).not.toContain("QA-Portfolio-Sprint-11-Assets.zip");
  }
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/blogs/prime-baby-gear-navigation");
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator(".article-related-grid article");
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          card
            .locator("img")
            .evaluate((el) => (el as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
      const title = await card.locator("h3").boundingBox();
      const arrow = await card
        .locator(".article-related-title > svg")
        .boundingBox();
      expect(arrow!.x).toBeGreaterThanOrEqual(title!.x + title!.width);
      expect(arrow!.y).toBeLessThan(title!.y + title!.height);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/blogs/vintage-art-garage-temporary-closure");
  await expect(
    page.locator(".article-related-grid .journal-placeholder"),
  ).toHaveCount(3);
});

test("ecosystem pauses on a platform block, not its section heading or empty space", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator("#shopify");
  await section.scrollIntoViewIfNeeded();
  await section.locator("h2").hover();
  await expect(section).toHaveAttribute("data-rotating", "true");
  const before = await section.locator(".ecosystem-details h3").textContent();
  await expect(section.locator(".ecosystem-details h3")).not.toHaveText(
    before!,
    { timeout: 3500 },
  );
  await expect(section.locator(".rotation-progress")).toHaveCount(0);
  await section.locator('[data-platform="BigCommerce"]').hover();
  await expect(section).toHaveAttribute("data-rotating", "false");
  await expect(section.locator(".ecosystem-details h3")).toHaveText(
    "BigCommerce",
  );
  await page.waitForTimeout(2200);
  await expect(section.locator(".ecosystem-details h3")).toHaveText(
    "BigCommerce",
  );
  // Top-left of the visualization is empty space, not a platform card.
  await section.locator(".orbit-scene").hover({ position: { x: 2, y: 2 } });
  await expect(section).toHaveAttribute("data-rotating", "true");
  await expect(section.locator(".ecosystem-details h3")).not.toHaveText(
    "BigCommerce",
    { timeout: 3500 },
  );
  await section.locator(".ecosystem-details").hover();
  await expect(section).toHaveAttribute("data-rotating", "false");
});

test("architecture pauses only on icon/content blocks and resumes over its heading", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator(".under-surface");
  await section.scrollIntoViewIfNeeded();
  const control = section.locator(".cycle-control");
  await section.locator("h3").hover();
  await expect(control).toHaveAttribute("data-running", "true");
  const before = await section
    .locator('.architecture-tabs [aria-pressed="true"]')
    .textContent();
  await expect(
    section.locator('.architecture-tabs [aria-pressed="true"]'),
  ).not.toHaveText(before!, { timeout: 3500 });
  await section.locator(".architecture-tabs button").nth(0).hover();
  await expect(control).toHaveAttribute("data-running", "false");
  const selected = await section
    .locator('.architecture-tabs [aria-pressed="true"]')
    .textContent();
  await page.waitForTimeout(2200);
  await expect(
    section.locator('.architecture-tabs [aria-pressed="true"]'),
  ).toHaveText(selected!);
  await section.locator("h3").hover();
  await expect(control).toHaveAttribute("data-running", "true");
  await expect(
    section.locator('.architecture-tabs [aria-pressed="true"]'),
  ).not.toHaveText(selected!, { timeout: 3500 });
  await expect(page.locator(".cycle-ring,.rotation-progress")).toHaveCount(0);
  await section.locator(".architecture-description p").hover();
  await expect(control).toHaveAttribute("data-running", "false");
});

test("narrow theme cycling no longer pauses over the sibling storefront preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 600, height: 1000 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".theme-workbench").scrollIntoViewIfNeeded();
  const control = page.locator(".theme-cycle-control .cycle-control");
  await page.locator(".theme-editor").hover();
  await expect(control).toHaveAttribute("data-running", "false");
  await page.locator(".theme-render").hover();
  await expect(control).toHaveAttribute("data-running", "true");
  const before = await page
    .locator('.editor-tabs [aria-pressed="true"]')
    .textContent();
  await expect(
    page.locator('.editor-tabs [aria-pressed="true"]'),
  ).not.toHaveText(before!, { timeout: 3500 });
});

test("keyboard focus still pauses each rotating block without a visual spinner", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press("Tab");
  const platform = page.locator('[data-platform="BigCommerce"]');
  await platform.scrollIntoViewIfNeeded();
  await platform.evaluate((el) =>
    (el as HTMLElement).focus({ preventScroll: true }),
  );
  await expect(page.locator("#shopify")).toHaveAttribute(
    "data-rotating",
    "false",
  );
  await page.waitForTimeout(2200);
  await expect(platform).toHaveAttribute("aria-pressed", "true");
  await platform.evaluate((el) => (el as HTMLElement).blur());
  await expect(page.locator("#shopify")).toHaveAttribute(
    "data-rotating",
    "true",
  );
  const layer = page.locator(".architecture-tabs button").nth(2);
  await layer.scrollIntoViewIfNeeded();
  await layer.evaluate((el) =>
    (el as HTMLElement).focus({ preventScroll: true }),
  );
  await page.keyboard.press("Enter");
  const control = page.locator(".architecture .cycle-control");
  await expect(control).toHaveAttribute("data-running", "false");
  await page.waitForTimeout(2200);
  await expect(layer).toHaveAttribute("aria-pressed", "true");
  await layer.evaluate((el) => (el as HTMLElement).blur());
  await expect(control).toHaveAttribute("data-running", "true");
  await page.setViewportSize({ width: 600, height: 1000 });
  const tab = page.locator(".editor-tabs button").nth(2);
  await tab.scrollIntoViewIfNeeded();
  await tab.evaluate((el) =>
    (el as HTMLElement).focus({ preventScroll: true }),
  );
  await page.keyboard.press("Enter");
  const themeControl = page.locator(".theme-cycle-control .cycle-control");
  await expect(themeControl).toHaveAttribute("data-running", "false");
  await page.waitForTimeout(2200);
  await expect(tab).toHaveAttribute("aria-pressed", "true");
  await tab.evaluate((el) => (el as HTMLElement).blur());
  await expect(themeControl).toHaveAttribute("data-running", "true");
});
