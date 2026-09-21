import { test, expect } from "@playwright/test";

async function jump(page: import("@playwright/test").Page, y: number) {
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: "instant" }),
    y,
  );
  await page.waitForTimeout(90);
}

test("Ahmad identity, vector signature, outlined hero CTA, and honest trust badges", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ahmad Abdullah/);
  await expect(page.locator(".header .brand")).toContainText("Ahmad Abdullah");
  await expect(page.locator(".brand-monogram").first()).toBeVisible();
  const secondary = page.locator('.hero-actions a[href="#contact"]');
  expect(
    await secondary.evaluate((el) => getComputedStyle(el).borderTopStyle),
  ).toBe("solid");
  await expect(page.locator(".trust-badge")).toHaveCount(4);
  const signature = await (
    await request.get("/images/brand/ahmad-abdullah-signature.svg")
  ).text();
  expect(signature).toContain("Ahmad Abdullah signature");
  expect(signature).not.toContain("NaN");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(
    page.getByAltText("Ahmad Abdullah — personal signature"),
  ).toBeVisible();
  await expect(page.locator(".footer-wordmark")).toContainText(
    "ahmad abdullah",
  );
});

test("lead project stays pinned while adjacent project images continue scrolling", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const gridTop = await page
    .locator(".project-grid")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await jump(page, gridTop - 96 + 15);
  await page.waitForTimeout(350);
  const lead = page.locator(".project-0");
  const first = await lead.boundingBox();
  const right = await page.locator(".project-1").boundingBox();
  // The compact header changes document flow; start from the browser’s anchored position.
  const anchoredScroll = await page.evaluate(() => scrollY);
  await jump(page, anchoredScroll + 60);
  const next = await lead.boundingBox();
  const rightNext = await page.locator(".project-1").boundingBox();
  expect(Math.abs(first!.y - 96)).toBeLessThan(2);
  expect(Math.abs(next!.y - first!.y)).toBeLessThan(2);
  expect(right!.y - rightNext!.y).toBeCloseTo(60, 0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await lead.evaluate((el) => getComputedStyle(el).position)).toBe(
    "relative",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("platforms rotate every two seconds, pause on hover, resume on exit and hand control to a manual selection", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#shopify").scrollIntoViewIfNeeded();
  await page.mouse.move(2, 2);
  await expect(page.locator(".shopify-core")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator('[data-platform="Magento"]')).toHaveAttribute(
    "aria-pressed",
    "true",
    { timeout: 3500 },
  );
  await expect(page.locator(".ecosystem-details h3")).toHaveText("Magento");
  await expect(
    page.locator(".ecosystem-connections .connection-base"),
  ).toHaveCount(9);
  await expect(page.locator(".connection-active")).toHaveCount(1);
  await page.locator('[data-platform="BigCommerce"]').hover();
  await expect(page.locator(".ecosystem-rotation-status")).toContainText(
    "PAUSED ON HOVER",
  );
  await page.waitForTimeout(2300);
  await expect(page.locator(".ecosystem-details h3")).toHaveText("BigCommerce");
  await page.mouse.move(2, 2);
  await expect(page.locator(".ecosystem-details h3")).toHaveText("WordPress", {
    timeout: 3500,
  });
  await page.locator('[data-platform="BigCommerce"]').click();
  await page
    .locator(".header .brand")
    .evaluate((el) => (el as HTMLElement).focus({ preventScroll: true }));
  await page.mouse.move(2, 2);
  await page.waitForTimeout(2300);
  await expect(page.locator(".ecosystem-details h3")).toHaveText("BigCommerce");
  await expect(page.locator("#shopify")).toHaveAttribute(
    "data-rotating",
    "false",
  );
  await expect(
    page.getByRole("button", { name: /automatic platform rotation/ }),
  ).toHaveCount(0);
});

test("platform cycle advances to ecosystem tab and accordion height transitions smoothly", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#shopify").scrollIntoViewIfNeeded();
  await page.locator('[data-platform="Custom Commerce"]').hover();
  await expect(
    page.locator('[data-platform="Custom Commerce"]'),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .locator(".header .brand")
    .evaluate((el) => (el as HTMLElement).focus({ preventScroll: true }));
  await page.mouse.move(2, 2);
  await expect(page.locator("#shopify")).toHaveAttribute(
    "data-rotating",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "02 / Shopify ecosystem" }),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 5000 });
  await expect(page.locator('[data-platform="Theme"]')).toHaveAttribute(
    "aria-pressed",
    "true",
    { timeout: 5000 },
  );
  const trigger = page.getByRole("button", {
    name: "The connection to your store",
  });
  const accordion = page.locator("#ecosystem-explanation");
  const before = (await accordion.boundingBox())!.height;
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.waitForTimeout(150);
  const during = (await accordion.boundingBox())!.height;
  expect(during).toBeGreaterThan(0);
  expect(during).toBeLessThan(before);
  await expect
    .poll(async () => (await accordion.boundingBox())!.height)
    .toBeLessThan(1);
  await trigger.click();
  await expect
    .poll(async () => (await accordion.boundingBox())!.height)
    .toBeGreaterThan(before - 2);
});

for (const size of [
  { width: 1440, height: 1000 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
  { width: 375, height: 667 },
]) {
  test(`process holds Discover until top, pins all stages and releases at ${size.width}x${size.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#process");
    await expect(section).toHaveClass(/is-pinned/);
    const geometry = await section.evaluate((el) => ({
      start: el.getBoundingClientRect().top + scrollY,
      pin: parseFloat(
        getComputedStyle(el).getPropertyValue("--process-pin-top"),
      ),
    }));
    const stride = Math.max(210, Math.min(420, size.height * 0.38));
    await jump(page, geometry.start - size.height * 0.6);
    await expect(section).toHaveAttribute("data-step", "0");
    await jump(page, geometry.start - geometry.pin + stride * 0.6);
    await expect(section).toHaveAttribute("data-step", "0");
    const panel = page.locator(".process-pin");
    expect(
      Math.abs((await panel.boundingBox())!.y - geometry.pin),
    ).toBeLessThan(2);
    for (let stage = 1; stage < 9; stage++) {
      await jump(page, geometry.start - geometry.pin + stride * (stage + 0.2));
      await expect(section).toHaveAttribute("data-step", String(stage));
      expect(
        Math.abs((await panel.boundingBox())!.y - geometry.pin),
      ).toBeLessThan(3);
      expect(
        (await panel.boundingBox())!.y + (await panel.boundingBox())!.height,
      ).toBeLessThan(size.height + 1);
    }
    await expect(
      page.getByRole("link", { name: "Ready to build yours?" }),
    ).toBeVisible();
    await jump(page, geometry.start - geometry.pin + stride * 9 + 120);
    expect((await panel.boundingBox())!.y).toBeLessThan(geometry.pin - 50);
    await jump(page, geometry.start - geometry.pin + stride * 0.3);
    await expect(section).toHaveAttribute("data-step", "0");
  });
}

test("reduced motion disables automatic selection and pinned choreography without removing controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#shopify").scrollIntoViewIfNeeded();
  await page.mouse.move(2, 2);
  await page.waitForTimeout(2300);
  await expect(page.locator(".shopify-core")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".ecosystem-rotation-status")).toContainText(
    "REDUCED MOTION",
  );
  await page.locator('[data-platform="Magento"]').click();
  await expect(page.locator(".ecosystem-details h3")).toHaveText("Magento");
  await expect(page.locator("#process")).toHaveClass(/manual-process/);
  await page
    .locator(".process-timeline")
    .getByRole("button", { name: /Maintain/ })
    .click();
  await expect(page.locator("#process")).toHaveAttribute("data-step", "8");
  expect(await page.locator('[data-reveal="pending"]').count()).toBe(0);
});
