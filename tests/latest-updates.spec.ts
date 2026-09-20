import { test, expect } from "@playwright/test";
import { projects } from "../src/data/portfolio";

test("five supplied projects have local brand imagery, honest details and working destination links", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("#work .project")).toHaveCount(5);
  for (const project of projects) {
    const card = page.locator(`#work .project-${project.slug}`);
    await expect(card.getByRole("heading")).toHaveText(project.title);
    await expect(card.getByRole("link")).toHaveAttribute(
      "href",
      project.externalUrl,
    );
    expect((await request.get(project.thumbnail)).ok()).toBe(true);
    await card.getByRole("button").click();
    const modal = page.getByRole("dialog");
    await expect(modal).toContainText(project.description);
    await expect(modal).not.toContainText("The challenge");
    if (project.siteNote) await expect(modal).toContainText(project.siteNote);
    await page.keyboard.press("Escape");
  }
  await expect(page.locator("#contact label")).not.toContainText(["optional"]);
  await expect(page.locator(".art-coordinate")).toHaveCount(0);
  await expect(page.locator(".rotation-controls")).not.toContainText(
    "EVERY 2 SECONDS",
  );
  await expect(page.locator(".orbit-scene .rotation-controls")).toHaveCount(1);
  expect(
    await page
      .locator("#contact-company")
      .evaluate((el) => (el as HTMLInputElement).required),
  ).toBe(false);
  expect(
    await page
      .locator("#contact-storeUrl")
      .evaluate((el) => (el as HTMLInputElement).required),
  ).toBe(false);
});

for (const width of [320, 375, 390, 414, 600]) {
  test(`mobile hero artwork clears its controls and following content at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const store = await page.locator(".hero-store-wrap").boundingBox();
    const controls = await page.locator(".hero-art-footer").boundingBox();
    const next = await page.locator(".craft-strip").boundingBox();
    expect(controls!.y).toBeGreaterThan(store!.y + store!.height + 15);
    expect(next!.y).toBeGreaterThan(controls!.y + controls!.height);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test.describe("touchscreen cycles", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  test("theme tabs cycle every two seconds on mobile, pause and keep manual selection", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".theme-editor").scrollIntoViewIfNeeded();
    const buttons = page.locator(".editor-tabs button");
    await expect(buttons.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true", {
      timeout: 3500,
    });
    await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true", {
      timeout: 3000,
    });
    await page
      .getByRole("button", { name: "Pause automatic theme tab rotation" })
      .tap();
    const current = await page
      .locator('.editor-tabs button[aria-pressed="true"]')
      .textContent();
    await page.waitForTimeout(2200);
    await expect(
      page.locator('.editor-tabs button[aria-pressed="true"]'),
    ).toHaveText(current!);
    await buttons.nth(3).tap();
    await expect(page.locator(".code-file")).toContainText(
      "cart-summary.liquid",
    );
    await page
      .getByRole("button", { name: "Resume automatic theme tab rotation" })
      .tap();
    await expect(buttons.nth(0)).toHaveAttribute("aria-pressed", "true", {
      timeout: 3500,
    });
  });
  test("architecture icons cycle, reveal horizontally, and never move the page vertically", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".under-surface").scrollIntoViewIfNeeded();
    const buttons = page.locator(".architecture-tabs button");
    await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true", {
      timeout: 3500,
    });
    const y = await page.evaluate(() => scrollY);
    await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true", {
      timeout: 3000,
    });
    await page.waitForTimeout(400);
    expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(2);
    const frame = await page.locator(".architecture-tabs").boundingBox();
    const active = await buttons.nth(2).boundingBox();
    expect(active!.x).toBeGreaterThanOrEqual(frame!.x - 1);
    expect(active!.x + active!.width).toBeLessThanOrEqual(
      frame!.x + frame!.width + 1,
    );
    await page
      .getByRole("button", {
        name: "Pause automatic architecture icon rotation",
      })
      .tap();
    await page.waitForTimeout(2200);
    await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true");
  });
});

test("desktop theme stays manual, architecture rotates, reduced motion disables both", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".theme-workbench").scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await page.waitForTimeout(2200);
  await expect(page.locator(".editor-tabs button").nth(0)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator(".under-surface").scrollIntoViewIfNeeded();
  await expect(
    page.locator(".architecture-tabs button").nth(1),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 3500 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".theme-editor").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await expect(page.locator(".editor-tabs button").nth(0)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator(".under-surface").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await expect(
    page.locator(".architecture-tabs button").nth(0),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".architecture-tabs button").nth(3).click();
  await expect(page.locator(".architecture-description p")).toContainText(
    "Selected integrations",
  );
});
