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

for (const width of [320, 390, 820, 1440]) {
  test(`all live text has a readable small-text floor at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/blogs", "/blogs/prime-baby-gear-navigation"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const tinyText = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => {
            if (
              !(el instanceof HTMLElement) ||
              !el.getClientRects().length ||
              el.closest('[aria-hidden="true"],svg')
            )
              return false;
            const style = getComputedStyle(el);
            return (
              style.visibility !== "hidden" &&
              [...el.childNodes].some(
                (node) =>
                  node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
              ) &&
              parseFloat(style.fontSize) < 12
            );
          })
          .map((el) => ({
            element: el.tagName,
            className: el.className,
            text: el.textContent?.trim().slice(0, 65),
            size: getComputedStyle(el).fontSize,
          })),
      );
      expect(tinyText, `${route} has text smaller than 12px`).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

for (const width of [320, 390, 1440]) {
  test(`enlarged annotations stay clear of blocks and signatures at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(1, 1);
    await page.locator(".orbit-scene").scrollIntoViewIfNeeded();
    const caption = (await page.locator(".orbit-caption").boundingBox())!;
    for (const node of await page
      .locator(".platform-node,.shopify-core")
      .all()) {
      const box = (await node.boundingBox())!;
      expect(box.y + box.height).toBeLessThan(caption.y);
    }
    if (width < 768) {
      await page.locator(".footer-back").scrollIntoViewIfNeeded();
      const back = (await page.locator(".footer-back").boundingBox())!;
      const wordmark = (await page.locator(".footer-wordmark").boundingBox())!;
      expect(back.y + back.height).toBeLessThanOrEqual(wordmark.y);
    }
  });
}
