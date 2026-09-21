import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { articles, blogProjects, dateLabel } from "../src/data/blog";
import { readFileSync } from "node:fs";
import sharp from "sharp";

test("editorial inventory is exactly seven distinct articles per supplied store", async () => {
  expect(articles).toHaveLength(35);
  expect(new Set(articles.map((a) => a.slug)).size).toBe(35);
  expect(new Set(articles.map((a) => a.title)).size).toBe(35);
  for (const p of blogProjects)
    expect(articles.filter((a) => a.project === p.slug)).toHaveLength(7);
  for (const a of articles) {
    expect(a.sections).toHaveLength(3);
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
    for (const m of [a.featuredImage, ...a.mobileImages])
      if (m.src) expect(m.src).toContain(`/blog/${a.project}/`);
    if (a.project === "vintage-art-garage")
      expect(a.featuredImage.src).toBeUndefined();
  }
});

test("all imported screenshots and responsive variants decode with truthful dimensions", async () => {
  const assets = JSON.parse(readFileSync("src/data/blog/assets.json", "utf8"));
  for (const group of Object.values(assets) as any[])
    for (const m of Object.values(group) as any[]) {
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
      expect(m.sourcePath).toContain("Sprint-11");
    }
});

test("all 35 article routes render full text, dates, sources and preview-safe metadata", async ({
  request,
}) => {
  for (const a of articles) {
    const res = await request.get(`/blogs/${a.slug}`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain(a.title.replaceAll("&", "&amp;"));
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain("noindex");
    expect(html).toContain(dateLabel(a.publishedAt));
    expect(html).toMatch(new RegExp(`datetime="${a.publishedAt}"`, "i"));
    expect(html).not.toContain("Open image to inspect");
    expect(html).not.toContain("Captured 2026-09-20");
    expect(html).toContain("article-sources");
    expect(html).toContain("article-body");
    expect(html).not.toContain("application/ld+json");
  }
  expect((await request.get("/blogs/not-a-real-article")).status()).toBe(404);
});

test("journal filters, search, query links, empty states and load more work", async ({
  page,
}) => {
  await page.goto("/blogs");
  await expect(page.locator(".journal-results-line")).toContainText(
    "35 articles",
  );
  await expect(page.locator(".journal-card")).toHaveCount(8);
  for (const p of blogProjects) {
    await page
      .locator(".journal-store-filters")
      .getByRole("button", { name: new RegExp(p.name) })
      .click();
    await expect(page.locator(".journal-card")).toHaveCount(7);
    await expect(page.locator(".journal-results-line")).toContainText(p.name);
  }
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
  await expect(page.locator(".journal-card")).toHaveCount(35);
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
