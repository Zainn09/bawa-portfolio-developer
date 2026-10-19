import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { articles, blogProjects, dateLabel } from "../src/data/blog";
import { readFileSync } from "node:fs";
import sharp from "sharp";

test("editorial inventory: seven per supplied store plus twenty original Shopify guides", async () => {
  expect(articles).toHaveLength(55);
  expect(new Set(articles.map((a) => a.slug)).size).toBe(55);
  expect(new Set(articles.map((a) => a.title)).size).toBe(55);
  for (const p of blogProjects)
    expect(articles.filter((a) => a.project === p.slug)).toHaveLength(
      p.slug === "shopify-guides" ? 20 : 7,
    );
  for (const a of articles) {
    expect(a.sections).toHaveLength(a.project === "shopify-guides" ? 8 : 3);
    expect(
      a.sections
        .flatMap((s) => s.paragraphs)
        .join(" ")
        .split(/\s+/).length,
    ).toBeGreaterThan(150);
    expect(a.seoTitle).toBeTruthy();
    expect(a.seoDescription).toBeTruthy();
    expect(a.sources).toHaveLength(1);
    expect(a.sources[0].url).not.toContain("github.com");
    for (const m of [a.featuredImage, ...a.mobileImages]) {
      if (!m.src) continue;
      // The second guide batch reuses documented storefront captures
      // (clearly captioned as such) where they genuinely illustrate an
      // article; every other image lives in its own project folder.
      const inOwnFolder = m.src.includes(`/blog/${a.project}/`);
      const documentedCapture =
        a.project === "shopify-guides" &&
        /\/blog\/(prime-baby-gear|ollie-burwell|nokoluxe|paw-by-four)\//.test(
          m.src,
        );
      expect(inOwnFolder || documentedCapture).toBe(true);
    }
    if (a.project === "vintage-art-garage")
      expect(a.featuredImage.src).toBeUndefined();
  }
});

test("all imported screenshots and responsive variants decode with truthful dimensions", async () => {
  const assets = JSON.parse(readFileSync("src/data/blog/assets.json", "utf8"));
  for (const [project, group] of Object.entries(assets) as any[])
    for (const m of Object.values(group) as any[]) {
      // Pending-capture entries declare intended geometry only; there is
      // no file to decode until the real image is supplied.
      if (!m.src) continue;
      const image = await sharp(`public${m.src}`).metadata();
      expect(image.width).toBe(m.width);
      expect(image.height).toBe(m.height);
      if (m.smallSrc)
        expect((await sharp(`public${m.smallSrc}`).metadata()).width).toBe(
          m.smallWidth,
        );
      if (m.avifSrc)
        expect((await sharp(`public${m.avifSrc}`).metadata()).format).toBe(
          "heif",
        );
      if (project === "shopify-guides") {
        // Original editorial images, not imported captures: no Sprint-11
        // provenance and no capture date are asserted or recorded.
        expect(m.sourcePath).toBeUndefined();
        expect(m.capturedAt).toBeUndefined();
      } else {
        expect(m.sourcePath).toContain("Sprint-11");
      }
    }
});

test("sitemap and RSS feed publish the production domain", async ({ page }) => {
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain("<urlset");
  expect(sitemapBody).toContain("https://ahmad-adbullah-prod.vercel.app/blogs");
  const feed = await page.request.get("/feed.xml");
  expect(feed.status()).toBe(200);
  const feedBody = await feed.text();
  expect(feedBody).toContain("https://ahmad-adbullah-prod.vercel.app/blogs/");
  await page.goto("/");
  await expect(page.locator('footer a[href="/sitemap.xml"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="/feed.xml"]')).toHaveCount(1);
});

test("every Shopify guide carries internal links and authoritative external references", async ({
  request,
}) => {
  for (const a of articles) {
    if (a.project !== "shopify-guides") continue;
    const res = await request.get(`/blogs/${a.slug}`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    // Internal links stay in-app; external references open in a new tab.
    expect(html).toContain('class="hl-link"');
    expect(html).toContain('class="hl-link ext"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  }
});

test("the two prime-baby-gear notes link the new performance and accessibility guides", async ({
  request,
}) => {
  const perf = await (
    await request.get("/blogs/prime-baby-gear-image-performance")
  ).text();
  expect(perf).toContain("/blogs/shopify-core-web-vitals");
  expect(perf).toContain("/blogs/shopify-theme-speed-optimization");
  const nav = await (
    await request.get("/blogs/prime-baby-gear-mobile-navigation")
  ).text();
  expect(nav).toContain("/blogs/shopify-keyboard-navigation-accessibility");
  expect(nav).toContain("/blogs/shopify-accessibility-testing-workflow");
});

const batchTwo = articles.filter(
  (a) =>
    a.project === "shopify-guides" &&
    a.slug.startsWith("shopify-") &&
    ![
      "shopify-theme-development-best-practices",
      "shopify-wcag-remediation",
      "custom-shopify-theme-vs-premium",
      "shopify-core-web-vitals",
      "shopify-keyboard-navigation-accessibility",
      "when-to-build-custom-shopify-theme",
      "shopify-theme-speed-optimization",
      "shopify-theme-architecture",
      "shopify-accessibility-testing-workflow",
      "shopify-theme-maintenance",
    ].includes(a.slug),
);

test("the second guide batch renders documentation cards, samples and honest media", async ({
  request,
}) => {
  expect(batchTwo).toHaveLength(10);
  for (const a of batchTwo) {
    const res = await request.get(`/blogs/${a.slug}`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    // Every guide carries official-documentation reference cards, each an
    // external, new-tab, noopener link.
    expect(html).toContain("OFFICIAL DOCUMENTATION");
    expect(html).toContain("docref-card");
    // No capture date is ever shown for this batch, and any featured image
    // that is present is a documented storefront capture or an honest
    // pending-imagery placeholder — never an AI image or a fake screenshot.
    expect(html).not.toContain("Captured");
    expect(html).not.toContain("Captured 2026-09-20");
    if (!a.featuredImage.src) {
      expect(html).toContain("Approved imagery pending");
    }
  }
});

test("the second guide batch cross-links per the linking plan and reaches the services page", async ({
  request,
}) => {
  const htmlFor = async (slug: string) =>
    (await request.get(`/blogs/${slug}`)).text();
  // The strategy's cross-link graph: each arrow is an in-app link.
  const links: [string, string[]][] = [
    [
      "shopify-ai-search-product-discovery",
      ["shopify-product-data-management", "shopify-collection-filters-guide"],
    ],
    [
      "shopify-product-variant-issues",
      [
        "shopify-product-data-management",
        "shopify-product-schema-errors",
        "shopify-google-merchant-center-errors",
      ],
    ],
    [
      "shopify-migration-seo-checklist",
      ["shopify-pages-not-indexed-google", "shopify-product-schema-errors"],
    ],
    [
      "shopify-markets-international-seo",
      ["shopify-pages-not-indexed-google", "shopify-migration-seo-checklist"],
    ],
    [
      "shopify-pages-not-indexed-google",
      ["shopify-migration-seo-checklist", "shopify-product-schema-errors"],
    ],
    [
      "shopify-b2b-storefront-guide",
      ["shopify-product-variant-issues", "shopify-product-data-management"],
    ],
  ];
  for (const [from, targets] of links) {
    const html = await htmlFor(from);
    for (const t of targets) expect(html).toContain(`/blogs/${t}`);
  }
  // Every guide in the batch leads to the Shopify development service.
  for (const a of batchTwo) {
    const html = await htmlFor(a.slug);
    expect(html).toContain('href="/shopify-development"');
  }
});

test("all 55 article routes render full text, dates, sources and production metadata", async ({
  request,
}) => {
  for (const a of articles) {
    const res = await request.get(`/blogs/${a.slug}`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain(a.title.replaceAll("&", "&amp;"));
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain('name="robots" content="index, follow"');
    expect(html).toContain(
      `https://ahmad-adbullah-prod.vercel.app/blogs/${a.slug}`,
    );
    expect(html).toContain(dateLabel(a.publishedAt));
    expect(html).toMatch(new RegExp(`datetime="${a.publishedAt}"`, "i"));
    expect(html).not.toContain("Open image to inspect");
    expect(html).not.toContain("Captured 2026-09-20");
    expect(html).toContain("article-sources");
    expect(html).toContain("article-body");
    expect(html).toContain("application/ld+json");
  }
  expect((await request.get("/blogs/not-a-real-article")).status()).toBe(404);
});

test("journal filters, search, query links, empty states and load more work", async ({
  page,
}) => {
  await page.goto("/blogs");
  await expect(page.locator(".journal-results-line")).toContainText(
    "55 articles",
  );
  await expect(page.locator(".journal-card")).toHaveCount(8);
  // Newly added articles always lead the journal, in date sequence.
  const newest = [...articles].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  )[0];
  await expect(page.locator(".journal-card h2").first()).toHaveText(
    newest.title,
  );
  for (const p of blogProjects) {
    await page
      .locator(".journal-store-filters")
      .getByRole("button", { name: new RegExp(p.name) })
      .click();
    // The journal pages at eight cards per click; a ten-article filter
    // shows eight until "More from the journal" is used.
    await expect(page.locator(".journal-card")).toHaveCount(
      p.slug === "shopify-guides" ? 8 : 7,
    );
    await expect(page.locator(".journal-results-line")).toContainText(p.name);
  }
  await page
    .locator(".journal-store-filters")
    .getByRole("button", { name: "Shopify Guides" })
    .click();
  // Twenty guides page at eight: 8, then 16, then all 20.
  await expect(page.locator(".journal-card")).toHaveCount(8);
  await page.getByRole("button", { name: "More from the journal" }).click();
  await expect(page.locator(".journal-card")).toHaveCount(16);
  await page.getByRole("button", { name: "More from the journal" }).click();
  await expect(page.locator(".journal-card")).toHaveCount(20);
  await expect(page.locator(".journal-results-line")).toContainText(
    "20 articles",
  );
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByRole("searchbox", { name: "Search articles" }).fill("silk");
  await expect(page.locator(".journal-card").first()).toBeVisible();
  await page.getByRole("searchbox").fill("no-such-article-xyz");
  await expect(
    page.getByRole("heading", { name: "No notes match that search." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all articles" }).click();
  await page
    .getByRole("combobox", { name: "Filter articles by topic" })
    .selectOption("SEO");
  await expect(page.locator(".journal-results-line")).toContainText(
    "5 articles",
  );
  await page.getByRole("button", { name: "Reset filters" }).click();
  while (
    await page.getByRole("button", { name: "More from the journal" }).count()
  )
    await page.getByRole("button", { name: "More from the journal" }).click();
  await expect(page.locator(".journal-card")).toHaveCount(55);
  await page.goto("/blogs?project=ollie-burwell&category=SEO");
  await expect(page.locator(".journal-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".journal-card")).toHaveCount(1);
  await expect(page.locator(".journal-card h2")).toHaveText(
    "Give the styling story a searchable structure",
  );
});

for (const width of [
  320, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, 2560,
]) {
  test(`journal and long article layouts have no overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/blogs",
      "/blogs/prime-baby-gear-navigation",
      "/blogs/vintage-art-garage-authentic-capture-plan",
      // The two longest guides: full-length articles must not overflow
      // either.
      "/blogs/shopify-theme-development-best-practices",
      "/blogs/shopify-collection-filters-guide",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator(".journal-footer").scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("mobile screenshot pairs are two columns when readable and stack on narrow phones", async ({
  page,
}) => {
  await page.goto("/blogs/prime-baby-gear-mobile-navigation");
  for (const width of [1440, 820, 600, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator(".article-mobile-pair").scrollIntoViewIfNeeded();
    const figures = page.locator(".article-mobile-pair figure");
    const a = await figures.nth(0).boundingBox();
    const b = await figures.nth(1).boundingBox();
    if (width >= 480) {
      expect(Math.abs(a!.y - b!.y)).toBeLessThan(1);
      expect(b!.x).toBeGreaterThan(a!.x + a!.width);
    } else {
      expect(b!.y).toBeGreaterThan(a!.y + a!.height);
      expect(a!.width).toBeGreaterThan(270);
    }
  }
});

test("article navigation, copy fallback, reduced motion and missing images remain usable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/images/blog/prime-baby-gear/desktop-home-hero*", (r) =>
    r.abort(),
  );
  await page.goto("/blogs/prime-baby-gear-navigation");
  await expect(
    page.locator(".article-feature .journal-placeholder"),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Article contents" })
    .getByRole("link", { name: /Keep the two routes/ })
    .click();
  await expect(page).toHaveURL(/#section-1$/);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    });
  });
  await page.getByRole("button", { name: "Copy article link" }).click();
  await expect(page.locator(".article-share input")).toHaveValue(
    /\/blogs\/prime-baby-gear-navigation$/,
  );
  await page.locator(".article-related-grid a").first().click();
  await expect(page.locator("h1")).toContainText("travel system");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#work$/);
  expect(errors).toEqual([]);
});

for (const theme of ["light", "dark"] as const)
  for (const width of [390, 1440]) {
    test(`journal and article axe accessibility in ${theme} at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      for (const path of [
        "/blogs",
        "/blogs/prime-baby-gear-navigation",
        "/blogs/vintage-art-garage-authentic-capture-plan",
      ]) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const result = await new AxeBuilder({ page })
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
    });
  }
