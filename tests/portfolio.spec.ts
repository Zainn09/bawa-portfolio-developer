import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const widths = [
  320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, 2560,
];
for (const width of widths) {
  test(`responsive layout, images, and navigation at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Commerce",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("#work img")].every(
        (img) =>
          (img as HTMLImageElement).complete &&
          (img as HTMLImageElement).naturalWidth > 0,
      ),
    );
    expect(errors).toEqual([]);
    if (width < 768) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "About" })
        .click();
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
      await expect(page).toHaveURL(/#about$/);
    }
  });
}
test("demo shop supports browsing, a working cart, quantity changes, and keyboard dismissal", async ({
  page,
}) => {
  await page.goto("/");
  const store = page.locator(".hero-store-wrap");
  await store.getByRole("button", { name: "Objects", exact: true }).click();
  await expect(store.getByRole("heading", { level: 3 })).toContainText(
    "Objects with",
  );
  await store.getByRole("button", { name: "Add to bag" }).click();
  const cart = page.getByRole("dialog", { name: "Demo shopping bag" });
  await expect(cart).toBeVisible();
  await expect(cart.locator(".cart-total")).toContainText("£420.00");
  await cart.getByRole("button", { name: "Add one chair" }).click();
  await expect(cart.locator(".cart-total")).toContainText("£840.00");
  await cart.getByRole("button", { name: "Remove one chair" }).click();
  await cart.getByRole("button", { name: "Remove one chair" }).click();
  await expect(cart).toContainText("currently empty");
  await page.keyboard.press("Escape");
  await expect(cart).not.toBeVisible();
  await expect(
    store.getByRole("button", { name: "Open demo cart, 0 items" }),
  ).toBeVisible();
});
test("project details are clearly labeled concepts and modal focus returns", async ({
  page,
}) => {
  await page.goto("/");
  const project = page.getByRole("button", {
    name: "Explore Form & Field concept",
  });
  await project.click();
  const dialog = page.getByRole("dialog", {
    name: "Form & Field concept details",
  });
  await expect(dialog).toContainText("NOT CLIENT WORK");
  await page.keyboard.press("Escape");
  await expect(project).toBeFocused();
});
test("ecosystem, capabilities, theme layers, optimization, process, data, and devices respond", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".platform-node").filter({ hasText: "Magento" }).click();
  await expect(page.locator(".ecosystem-details")).toContainText(
    "Enterprise e-commerce",
  );
  await page
    .getByRole("button", { name: "Explore the Shopify ecosystem" })
    .click();
  await expect(
    page.locator(".platform-node").filter({ hasText: "Analytics" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "03 Product data" }).click();
  await expect(page.locator("#capability-2")).toContainText(
    "Bulk data preparation",
  );
  await page
    .locator(".editor-tabs")
    .getByRole("button", { name: "Cart experience" })
    .click();
  await expect(page.locator(".code-file")).toContainText("cart-summary");
  await expect(page.locator(".theme-render .store-highlight")).toContainText(
    "One easy bag",
  );
  await page
    .locator(".optimization-tabs")
    .getByRole("button", { name: "SEO", exact: true })
    .click();
  await expect(page.locator(".optimization-detail")).toContainText("discovery");
  await page
    .locator(".process-timeline")
    .getByRole("button", { name: /Discover/ })
    .click();
  await expect(page.locator(".process-store .build-overlay")).toBeVisible();
  await page
    .locator(".process-timeline")
    .getByRole("button", { name: /Maintain/ })
    .click();
  await expect(page.locator(".process-store .build-overlay")).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ready to build yours?" }),
  ).toBeVisible();
  const slider = page.getByRole("slider", {
    name: "Compare before and after storefront designs",
  });
  await slider.fill("75");
  await expect(slider).toHaveValue("75");
  await page.getByRole("button", { name: "01 / Raw product data" }).click();
  await expect(page.locator(".raw-data")).toContainText("PRODUCT-IMPORT.CSV");
  await page.getByRole("button", { name: "02 / Store-ready" }).click();
  await expect(page.locator(".structured-data")).toContainText(
    "FF-CHAIR-OAK-01",
  );
  await page
    .locator(".device-select")
    .getByRole("button", { name: "Mobile" })
    .click();
  await expect(page.locator(".device-frame")).toHaveClass(/device-mobile/);
  await page
    .locator(".device-frame")
    .getByRole("button", { name: "Demo store navigation" })
    .click();
  await expect(page.locator(".device-frame .demo-mobile-nav")).toBeVisible();
});
test("theme persists after reload, reduced motion is respected, and skip link works", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
async function fillForm(page: import("@playwright/test").Page) {
  await page
    .getByRole("textbox", { name: "Your name", exact: false })
    .fill("Sample Enquirer");
  await page
    .getByLabel("Email address", { exact: false })
    .fill("test@example.com");
  await page
    .getByLabel("What can I help with?", { exact: false })
    .selectOption("Custom Theme");
  await page
    .getByLabel("A little about your project", { exact: false })
    .fill(
      "A sample enquiry for a custom Shopify theme. This is an automated test.",
    );
}
test("form validates, preserves drafts, and honestly reports missing delivery configuration", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s talk", exact: true }).click();
  await expect(page.locator(".contact-form").getByRole("alert")).toContainText(
    "details",
  );
  await expect(page.locator("#contact-name")).toBeFocused();
  await fillForm(page);
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: "Let’s talk", exact: true }).click();
  await expect(page.locator(".contact-form").getByRole("alert")).toContainText(
    "has not been sent",
  );
  await expect(page.locator("#contact-message")).not.toHaveValue("");
});
test("form loading and success states work with a simulated delivery response", async ({
  page,
}) => {
  await page.route("**/api/contact", async (route) => {
    await new Promise((r) => setTimeout(r, 400));
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Your project details have been sent.",
      }),
    });
  });
  await page.goto("/");
  await fillForm(page);
  await page.getByRole("button", { name: "Let’s talk", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("have been sent");
  await expect(page.locator("#contact-message")).toHaveValue("");
});
test("contact endpoint rejects invalid, cross-origin, spam, and oversized requests", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/contact", {
        data: {},
        headers: { "x-forwarded-for": "qa-invalid" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data: {},
        headers: {
          origin: "https://other.example",
          "x-forwarded-for": "qa-origin",
        },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/contact", {
        data: { message: "x".repeat(21000) },
        headers: { "x-forwarded-for": "qa-size" },
      })
    ).status(),
  ).toBe(413);
  const valid = {
    name: "QA Enquirer",
    email: "qa@example.com",
    projectType: "Custom Theme",
    message: "An automated validation request for a custom storefront.",
    startedAt: Date.now() - 10000,
    website: "spam",
  };
  expect(
    (
      await request.post("/api/contact", {
        data: valid,
        headers: { "x-forwarded-for": "qa-spam" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data: { ...valid, website: "" },
        headers: { "x-forwarded-for": "qa-unconfigured" },
      })
    ).status(),
  ).toBe(503);
});
test("contact endpoint applies rate limiting", async ({ request }) => {
  const rateKey = `qa-rate-${Date.now()}`;
  for (let i = 0; i < 5; i++)
    expect(
      (
        await request.post("/api/contact", {
          data: {},
          headers: { "x-forwarded-for": rateKey },
        })
      ).status(),
    ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data: {},
        headers: { "x-forwarded-for": rateKey },
      })
    ).status(),
  ).toBe(429);
});
test("preview SEO does not invent identity or an indexable domain", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Shopify Developer/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  expect(await page.locator('script[type="application/ld+json"]').count()).toBe(
    0,
  );
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});
for (const theme of ["light", "dark"] as const) {
  test(`${theme} theme accessibility audit`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Audit settled states, not intermediate animation opacity during hydration.
    await page.waitForTimeout(1000);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          selector: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
}
