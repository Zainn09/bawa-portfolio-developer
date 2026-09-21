import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { storeConcepts } from "../src/data/atelier";

for (const width of [320, 390, 820, 1440]) {
  test(`atelier directions, compositions, devices and carts work at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const atelier = page.locator("#atelier");
    for (const concept of storeConcepts) {
      const choice = atelier
        .locator(".direction-options button")
        .filter({ hasText: concept.name });
      await choice.click();
      await expect(choice).toHaveAttribute("aria-pressed", "true");
      await expect(atelier.locator(".store-logo")).toHaveText(concept.name);
      for (const device of ["desktop", "mobile"]) {
        await atelier
          .getByRole("button", { name: `Preview ${device} storefront` })
          .click();
        for (const layout of ["Editorial", "Product first"]) {
          await atelier
            .getByRole("button", { name: layout, exact: true })
            .click();
          const campaign = atelier.locator(".store-campaign");
          const cta = campaign.getByRole("button");
          await cta.scrollIntoViewIfNeeded();
          const frame = await campaign.boundingBox();
          const button = await cta.boundingBox();
          expect(
            button!.y + button!.height,
            `${concept.id}/${device}/${layout}: CTA clipped`,
          ).toBeLessThanOrEqual(frame!.y + frame!.height + 1);
          expect(button!.x + button!.width).toBeLessThanOrEqual(
            frame!.x + frame!.width + 1,
          );
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
        }
      }
      await atelier
        .getByRole("button", { name: "Add to bag", exact: true })
        .click();
      const cart = page.getByRole("dialog", { name: "Demo shopping bag" });
      await expect(cart).toContainText(concept.product);
      await expect(cart.locator(".cart-total")).toContainText(
        `£${concept.price.toFixed(2)}`,
      );
      await cart.getByRole("button", { name: "Add one demo product" }).click();
      await expect(cart.locator(".cart-total")).toContainText(
        `£${(concept.price * 2).toFixed(2)}`,
      );
      await expect(cart).toContainText("No payment is collected");
      await page.keyboard.press("Escape");
      await expect(
        atelier.getByRole("button", { name: "Add to bag", exact: true }),
      ).toBeFocused();
    }
  });
}

test("preview changes preserve the explored collection and cart without a reset control", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const atelier = page.locator("#atelier");
  await atelier.getByRole("button", { name: "Explore the collection" }).click();
  await expect(atelier.locator(".store-campaign h3")).toContainText(
    "Made to settle in.",
  );
  await atelier
    .getByRole("button", { name: "Add to bag", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await atelier
    .getByRole("button", { name: "Preview mobile storefront" })
    .click();
  await atelier
    .getByRole("button", { name: "Product first", exact: true })
    .click();
  await expect(
    atelier.getByRole("button", { name: "Reset the canvas" }),
  ).toHaveCount(0);
  await expect(
    atelier.getByRole("button", { name: "Preview mobile storefront" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    atelier.getByRole("button", { name: "Product first", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(atelier.locator(".store-campaign h3")).toContainText(
    "Made to settle in.",
  );
  await expect(
    atelier.getByRole("button", { name: "Open demo cart, 1 items" }),
  ).toBeVisible();
});

for (const width of [390, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`atelier selected brand states meet axe AA checks in ${theme} at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const atelier = page.locator("#atelier");
      for (const concept of storeConcepts) {
        await atelier
          .locator(".direction-options button")
          .filter({ hasText: concept.name })
          .click();
        for (const layout of ["Editorial", "Product first"]) {
          await atelier
            .getByRole("button", { name: layout, exact: true })
            .click();
          const result = await new AxeBuilder({ page })
            .include("#atelier")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          expect(
            result.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => ({
                target: n.target,
                reason: n.failureSummary,
              })),
            })),
          ).toEqual([]);
        }
      }
    });
  }

test("mobile menu supports Escape, outside dismissal, resize and short viewports", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".mobile-toggle");
  await toggle.click();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator(".hero-authorship").click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
  await page.setViewportSize({ width: 740, height: 360 });
  await toggle.click();
  const contact = page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Contact" });
  await contact.scrollIntoViewIfNeeded();
  const box = await contact.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(360);
  await contact.click();
  await expect(page).toHaveURL(/#contact$/);
});

test("local preview does not load Vercel telemetry", async ({ page }) => {
  const telemetry: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/_vercel/")) telemetry.push(r.url());
  });
  await page.goto("/?email=private@example.test#contact");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('script[src*="/_vercel/"]')).toHaveCount(0);
  expect(telemetry).toEqual([]);
});
