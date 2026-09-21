import { test, expect, type Page } from "@playwright/test";

async function jump(page: Page, top: number) {
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    top,
  );
  await page.waitForTimeout(100);
}
async function geometry(page: Page) {
  return page.locator("#process").evaluate((el) => ({
    start: el.getBoundingClientRect().top + scrollY,
    top: parseFloat(getComputedStyle(el).getPropertyValue("--process-pin-top")),
    stride: Math.max(210, Math.min(420, innerHeight * 0.38)),
  }));
}

for (const [width, height] of [
  [1366, 768],
  [1280, 720],
  [820, 600],
  [360, 640],
  [320, 568],
  [844, 390],
]) {
  test(`process keeps a stable sticky track through all stages at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#process");
    await expect(section).toHaveClass(/is-pinned/);
    await jump(page, 200);
    // Allow the site's compact sticky-header transition to finish before measuring.
    await page.waitForTimeout(300);
    const g = await geometry(page);
    const panel = page.locator(".process-pin");
    const heightBefore = (await panel.boundingBox())!.height;
    for (let stage = 0; stage < 9; stage++) {
      await jump(page, g.start - g.top + (stage + 0.25) * g.stride);
      await expect(section).toHaveAttribute("data-step", String(stage));
      await expect(section).toHaveClass(/is-pinned/);
      const box = (await panel.boundingBox())!;
      expect(Math.abs(box.y - g.top)).toBeLessThan(2);
      expect(Math.abs(box.height - heightBefore)).toBeLessThan(1);
      expect(box.y + box.height).toBeLessThanOrEqual(height - 10);
      await expect(
        page.locator('.process-copy-panel[data-active="true"]'),
      ).toHaveCount(1);
    }
    await jump(page, g.start - g.top + 9.6 * g.stride);
    expect((await panel.boundingBox())!.y).toBeLessThan(g.top - 50);
    await jump(page, g.start - g.top + 0.25 * g.stride);
    await expect(section).toHaveAttribute("data-step", "0");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("process preserves the current stage through viewport resizes and restores manual reduced-motion mode", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("#process")).toHaveClass(/is-pinned/);
  await jump(page, 200);
  await page.waitForTimeout(300);
  const g = await geometry(page);
  await jump(page, g.start - g.top + 4.25 * g.stride);
  await expect(page.locator("#process")).toHaveAttribute("data-step", "4");
  for (const size of [
    { width: 1280, height: 720 },
    { width: 1280, height: 580 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(size);
    await page.waitForTimeout(300);
    await expect(page.locator("#process")).toHaveClass(/is-pinned/);
    await expect(page.locator("#process")).toHaveAttribute("data-step", "4");
    const current = await geometry(page);
    expect(
      Math.abs(
        (await page.locator(".process-pin").boundingBox())!.y - current.top,
      ),
    ).toBeLessThan(2);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#process")).toHaveClass(/manual-process/);
  await page
    .locator(".process-timeline")
    .getByRole("button", { name: /Maintain/ })
    .click();
  await expect(page.locator("#process")).toHaveAttribute("data-step", "8");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#process")).toHaveClass(/is-pinned/);
});

for (const width of [320, 1440]) {
  test(`requested controls are removed and contact actions have borders at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const selector of ["#shopify", ".under-surface"]) {
      await expect(
        page.locator(selector).getByRole("button", { name: /pause|resume/i }),
      ).toHaveCount(0);
    }
    await expect(
      page.getByRole("button", { name: "Reset the canvas" }),
    ).toHaveCount(0);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      for (const label of ["Start a project", "View my work"]) {
        const action = page
          .locator(".contact-callout")
          .getByRole("link", { name: label });
        await action.scrollIntoViewIfNeeded();
        const border = await action.evaluate((el) => ({
          width: parseFloat(getComputedStyle(el).borderTopWidth),
          style: getComputedStyle(el).borderTopStyle,
        }));
        expect(border.width).toBeGreaterThanOrEqual(1);
        expect(border.style).toBe("solid");
      }
    }
    await page
      .locator(".contact-callout")
      .getByRole("link", { name: "Start a project" })
      .click();
    await expect(page).toHaveURL(/#project-form$/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
