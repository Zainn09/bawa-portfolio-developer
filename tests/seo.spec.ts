import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const serviceSlugs = [
  "shopify-development",
  "shopify-theme-development",
  "shopify-store-development",
  "shopify-qa-testing",
  "shopify-plus",
  "shopify-store-maintenance",
  "shopify-checkout-testing",
  "shopify-mobile-testing",
  "shopify-performance-testing",
  "shopify-accessibility-testing",
  "shopify-regression-testing",
];
const caseStudySlugs = [
  "prime-baby-gear",
  "ollie-burwell",
  "nokoluxe",
  "vintage-art-garage",
  "paw-by-four",
];

test.describe("service pages", () => {
  const titles: string[] = [];

  for (const slug of serviceSlugs) {
    test(`${slug} renders with one H1 and a unique title`, async ({ page }) => {
      const response = await page.goto(`/${slug}`);
      expect(response?.status()).toBe(200);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(25);
      expect(titles.filter((t) => t === title)).toHaveLength(0);
      titles.push(title);
      // Internal links that keep the page in the hierarchy.
      await expect(
        page.locator('.service-breadcrumb a[href="/"]'),
      ).toBeVisible();
      await expect(page.locator(".service-cta a")).toContainText(
        "Start a conversation",
      );
      // Preview mode (no NEXT_PUBLIC_SITE_URL): not indexable, no canonical.
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(
        page.locator('meta[name="robots"][content*="noindex"]'),
      ).toHaveCount(1);
      await expect(
        page.locator('script[type="application/ld+json"]'),
      ).toHaveCount(0);
    });
  }

  test("the services hub links to every other service page", async ({
    page,
  }) => {
    await page.goto("/shopify-development");
    for (const slug of serviceSlugs) {
      if (slug === "shopify-development") continue;
      await expect(page.locator(`a[href="/${slug}"]`).first()).toBeVisible();
    }
  });
});

test.describe("case studies", () => {
  const titles: string[] = [];

  test("/case-studies lists all five real stores", async ({ page }) => {
    const response = await page.goto("/case-studies");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const slug of caseStudySlugs) {
      await expect(
        page.locator(`a[href="/case-studies/${slug}"]`),
      ).toBeVisible();
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  for (const slug of caseStudySlugs) {
    test(`case study ${slug} links its journal entries and services`, async ({
      page,
    }) => {
      const response = await page.goto(`/case-studies/${slug}`);
      expect(response?.status()).toBe(200);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      const title = await page.title();
      expect(titles.filter((t) => t === title)).toHaveLength(0);
      titles.push(title);
      // Seven journal entries per store, all resolvable.
      const articleLinks = page.locator(".case-article-list a");
      expect(await articleLinks.count()).toBe(7);
      for (let i = 0; i < 7; i++) {
        const href = await articleLinks.nth(i).getAttribute("href");
        const target = await page.request.get(href!);
        expect(target.status()).toBe(200);
      }
      await expect(
        page.locator(".service-related-list a[href='/shopify-development']"),
      ).toBeVisible();
      await expect(
        page.locator(".service-related-list a[href='/case-studies']"),
      ).toBeVisible();
    });
  }

  test("the vintage case study states the store is closed", async ({
    page,
  }) => {
    await page.goto("/case-studies/vintage-art-garage");
    await expect(page.locator(".case-study-note")).toContainText(
      "temporarily closed",
    );
  });
});

test("unknown routes fall through to the custom 404", async ({ page }) => {
  const service = await page.goto("/shopify-definitely-not-real");
  expect(service?.status()).toBe(404);
  await expect(page.locator(".not-found")).toBeVisible();
  const study = await page.goto("/case-studies/not-a-store");
  expect(study?.status()).toBe(404);
  await expect(page.locator(".not-found")).toBeVisible();
});

test("homepage hierarchy links to services and case studies", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator(".intro-services-link")).toHaveAttribute(
    "href",
    "/shopify-development",
  );
  // Desktop nav (visible at >=1200px) and footer both expose the routes.
  await expect(
    page.locator(".desktop-nav a[href='/shopify-development']"),
  ).toBeVisible();
  await expect(
    page.locator(".desktop-nav a[href='/case-studies']"),
  ).toBeVisible();
  await expect(
    page.locator('footer a[href="/shopify-development"]'),
  ).toHaveCount(1);
  await expect(page.locator('footer a[href="/case-studies"]')).toHaveCount(1);
});

test("article pages link to their related service pages", async ({ page }) => {
  await page.goto("/blogs");
  const firstArticle = page.locator("main a[href^='/blogs/']").first();
  const href = await firstArticle.getAttribute("href");
  expect(href).toBeTruthy();
  await page.goto(href!);
  const services = page.locator(".article-services a");
  expect(await services.count()).toBeGreaterThanOrEqual(1);
  expect(await services.count()).toBeLessThanOrEqual(3);
  for (let i = 0; i < (await services.count()); i++) {
    const target = await page.request.get(
      (await services.nth(i).getAttribute("href"))!,
    );
    expect(target.status()).toBe(200);
  }
});

test("work modal links a real project to its case study", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explore Prime Baby Gear project" })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Prime Baby Gear project details",
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "Read the case study" }),
  ).toHaveAttribute("href", "/case-studies/prime-baby-gear");
});

test("new pages stay overflow-free at 320px", async ({ page }) => {
  for (const path of [
    "/shopify-development",
    "/case-studies/prime-baby-gear",
  ]) {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("service page accessibility audit", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/shopify-qa-testing");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test.describe("guides and checklists (resources)", () => {
  const slugs = [
    "shopify-theme-development-guide",
    "shopify-store-launch-checklist",
    "shopify-qa-checklist",
    "shopify-checkout-testing-guide",
    "shopify-plus-testing-guide",
    "shopify-mobile-testing-guide",
    "shopify-performance-checklist",
    "common-shopify-store-issues",
  ];
  const titles: string[] = [];

  test("/resources lists every guide and checklist", async ({ page }) => {
    const response = await page.goto("/resources");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const slug of slugs) {
      await expect(page.locator(`a[href="/resources/${slug}"]`)).toBeVisible();
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  for (const slug of slugs) {
    test(`resource ${slug} links services and journal entries`, async ({
      page,
    }) => {
      const response = await page.goto(`/resources/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const title = await page.title();
      expect(titles.filter((t) => t === title)).toHaveLength(0);
      titles.push(title);
      // Connects back to the services it describes.
      const serviceLinks = page.locator(
        ".resource-service-links a[href^='/shopify']",
      );
      expect(await serviceLinks.count()).toBeGreaterThanOrEqual(1);
      // Journal entries are real and resolvable.
      const articleLinks = page.locator(".case-article-list a");
      expect(await articleLinks.count()).toBeGreaterThanOrEqual(1);
      for (let i = 0; i < (await articleLinks.count()); i++) {
        const href = await articleLinks.nth(i).getAttribute("href");
        const target = await page.request.get(href!);
        expect(target.status()).toBe(200);
      }
      // Preview mode: not indexable, no canonical, no schema.
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(
        page.locator('meta[name="robots"][content*="noindex"]'),
      ).toHaveCount(1);
      await expect(
        page.locator('script[type="application/ld+json"]'),
      ).toHaveCount(0);
    });
  }

  test("unknown resource slugs return the custom 404", async ({ page }) => {
    const response = await page.goto("/resources/not-a-real-guide");
    expect(response?.status()).toBe(404);
    await expect(page.locator(".not-found")).toBeVisible();
  });

  test("service pages surface practical resources", async ({ page }) => {
    await page.goto("/shopify-development");
    const resourceLinks = page.locator('a[href^="/resources/"]');
    expect(await resourceLinks.count()).toBeGreaterThanOrEqual(1);
    const href = await resourceLinks.first().getAttribute("href");
    const target = await page.request.get(href!);
    expect(target.status()).toBe(200);
  });

  test("footer exposes the guides section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/resources"]')).toHaveCount(1);
  });
});

test("robots and sitemap stay preview-safe", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  // Preview (no NEXT_PUBLIC_SITE_URL): everything stays out of the
  // index and no sitemap URL is invented.
  const robotsBody = await robots.text();
  expect(robotsBody).toContain("Disallow: /");
  expect(robotsBody).not.toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).not.toContain("https://");
});
