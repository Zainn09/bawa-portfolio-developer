import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`description typography is distinct, locally loaded and readable at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const description = page.locator(".intro-section > div > p");
    const styles = await description.evaluate((el) => ({
      family: getComputedStyle(el).fontFamily,
      size: parseFloat(getComputedStyle(el).fontSize),
    }));
    expect(styles.family).toContain("Source Sans 3");
    expect(styles.size).toBeGreaterThanOrEqual(viewport.width < 768 ? 15 : 16);
    expect(
      await page
        .locator("h1")
        .evaluate((el) => getComputedStyle(el).fontFamily),
    ).toContain("DM Sans");
    expect(
      await page
        .locator(".hero-store-wrap .store-campaign-copy p")
        .evaluate((el) => getComputedStyle(el).fontFamily),
    ).toContain("DM Sans");
    expect(
      await page.evaluate(() =>
        document.fonts.check('400 14px "Source Sans 3"'),
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (viewport.width < 768)
      expect(
        await page
          .locator("#contact-message")
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBe(16);
  });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`larger supporting and article descriptions at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const size = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(await size(".hero-description")).toBeGreaterThanOrEqual(20);
    expect(await size(".hero-support")).toBeGreaterThanOrEqual(14);
    expect(await size(".atelier-concept-note p")).toBeGreaterThanOrEqual(15);
    expect(await size(".architecture-description p")).toBeGreaterThanOrEqual(
      15,
    );
    expect(await size(".journal-preview-lead p")).toBeGreaterThanOrEqual(17);
    await page.goto("/blogs/prime-baby-gear-navigation");
    expect(await size(".article-prose section > p")).toBeGreaterThanOrEqual(
      viewport.width < 768 ? 20 : 21,
    );
    expect(await size(".article-scope p")).toBeGreaterThanOrEqual(16);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
