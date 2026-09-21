import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import { articles } from "../src/data/blog";
import { importArticle } from "../src/lib/cms/import";
// These exercise Next + the real editor/API against a disposable HTTP double, not a live Supabase project.
const origin = "http://localhost:3001";
async function login(page: Page, email = "admin@example.test") {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("fixture-password");
  await page.getByRole("button", { name: "Sign in to the journal" }).click();
}
test.beforeEach(async ({ request }) => {
  await request.get("http://127.0.0.1:4010/__reset");
});
test("unauthenticated and ordinary authenticated accounts cannot reach admin data", async ({
  page,
  request,
}) => {
  await page.goto("/admin/posts/new");
  await expect(page).toHaveURL(/\/admin\/login/);
  expect((await request.get("/api/admin/posts")).status()).toBe(401);
  expect(
    (
      await request.post("/api/admin/import", { headers: { Origin: origin } })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post("/api/admin/posts", {
        headers: { Origin: "https://attacker.test" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  await login(page, "reader@example.test");
  await expect(page.locator(".cms-error")).toContainText(
    "does not have administrator access",
  );
  expect((await page.request.get("/api/admin/posts")).status()).toBe(401);
});
test("write, format, insert an image between paragraphs, preview, publish, reopen, and archive", async ({
  page,
}) => {
  await login(page);
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("link", { name: "New article", exact: true }).click();
  await page
    .getByLabel("Title", { exact: true })
    .fill("A considered product page");
  await page
    .getByLabel("Excerpt", { exact: true })
    .fill(
      "A practical editorial note about organizing useful product information for customers.",
    );
  const prose = page.getByRole("textbox", { name: "Article content" });
  await prose.fill(
    "First paragraph: a product page should answer the customer’s questions with clear and useful information.",
  );
  await prose.press("End");
  await prose.press("Enter");
  const image = articles.find((a) => a.featuredImage.src)!.featuredImage;
  await page.route("**/api/admin/upload", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        media: {
          src: image.src,
          width: image.width,
          height: image.height,
          alt: "",
        },
      }),
    }),
  );
  await page.getByRole("button", { name: "Insert image", exact: true }).click();
  await page.getByLabel("Image file").setInputFiles({
    name: "test.webp",
    mimeType: "image/webp",
    buffer: fs.readFileSync(`public${image.src}`),
  });
  await page
    .getByLabel("Alternative text", { exact: true })
    .fill("A genuine supplied storefront capture");
  await page
    .getByLabel("Caption", { exact: true })
    .fill("Product information in context.");
  await page
    .getByRole("button", { name: "Insert image", exact: true })
    .last()
    .click();
  await expect(prose.locator("img")).toHaveCount(1);
  await prose.press("Control+End");
  await prose.press("Enter");
  await page.keyboard.type(
    "A second paragraph follows the image, preserving the intended reading order.",
  );
  await page.getByRole("button", { name: "Bold", exact: true }).click();
  await page.keyboard.type(" A useful detail.");
  await page.getByRole("button", { name: "Bold", exact: true }).click();
  await page
    .getByLabel("Tags", { exact: true })
    .fill("Shopify, Product content");
  await page.getByLabel(/SEO title/).fill("Product pages with purpose");
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(page.locator(".cms-preview img")).toHaveCount(1);
  await expect(page.locator(".cms-preview strong")).toContainText(
    "A useful detail.",
  );
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/posts\/[\da-f-]{36}$/);
  await expect(
    page.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  const draft = await page.request.get("/blogs/a-considered-product-page");
  expect(draft.status()).toBe(404);
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("published");
  await page
    .getByRole("button", { name: "Publish article", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Published version saved." }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("URL slug")).toHaveAttribute("readonly", "");
  await expect(prose.locator("img")).toHaveCount(1);
  await expect(prose).toContainText("second paragraph");
  const url = page.url();
  await page.goto("/blogs/a-considered-product-page");
  await expect(page.locator("h1")).toHaveText("A considered product page");
  await expect(page.locator(".rich-article img")).toHaveCount(1);
  await expect(page.locator(".rich-article")).toContainText(
    "A second paragraph",
  );
  await expect(page).toHaveTitle(/Product pages with purpose/);
  const sitemap = await page.request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("a-considered-product-page");
  await page.goto(url);
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("archived");
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Archive article", exact: true })
    .click();
  await expect(
    page.getByText("Article archived.", { exact: true }),
  ).toBeVisible();
  expect(
    (await page.request.get("/blogs/a-considered-product-page")).status(),
  ).toBe(404);
  expect(await (await page.request.get("/sitemap.xml")).text()).not.toContain(
    "a-considered-product-page",
  );
});
test("import is retry safe, dates survive, and stale saves and changed published URLs are refused", async ({
  page,
}) => {
  await login(page);
  await expect(page).toHaveURL(/\/admin$/);
  const api = page.request;
  const imported = await api.post("/api/admin/import", {
    headers: { Origin: origin },
  });
  expect(imported.status()).toBe(200);
  expect((await imported.json()).imported).toBe(35);
  expect(
    (
      await (
        await api.post("/api/admin/import", { headers: { Origin: origin } })
      ).json()
    ).imported,
  ).toBe(0);
  const posts = (await (await api.get("/api/admin/posts")).json()).posts;
  expect(posts).toHaveLength(35);
  const first = (
    await (await api.get(`/api/admin/posts/${posts[0].id}`)).json()
  ).post;
  const input = importArticle(articles.find((a) => a.slug === first.slug)!);
  const edit = await api.put(`/api/admin/posts/${first.id}`, {
    headers: { Origin: origin },
    data: {
      ...input,
      title: "Revised editorial title",
      version: first.updated_at,
    },
  });
  expect(edit.status()).toBe(200);
  const stale = await api.put(`/api/admin/posts/${first.id}`, {
    headers: { Origin: origin },
    data: { ...input, version: first.updated_at },
  });
  expect(stale.status()).toBe(409);
  const row = (await edit.json()).post;
  const rename = await api.put(`/api/admin/posts/${first.id}`, {
    headers: { Origin: origin },
    data: { ...input, slug: "a-different-address", version: row.updated_at },
  });
  expect(rename.status()).toBe(409);
  await page.goto(`/blogs/${first.slug}`);
  await expect(page.locator("h1")).toHaveText("Revised editorial title");
});
test("editor and image dialog remain accessible and fit from 320px to 2560px", async ({
  page,
}) => {
  await login(page);
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/posts/new");
  await expect(
    page.getByRole("textbox", { name: "Article content" }),
  ).toBeVisible();
  for (const width of [
    320, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, 2560,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `overflow at ${width}`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const a11y = await new AxeBuilder({ page }).analyze();
  expect(
    a11y.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "Insert image", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByLabel("Title", { exact: true }).fill("Unsaved title");
  page.once("dialog", (d) => d.dismiss());
  await page.getByRole("link", { name: "All articles", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/posts\/new$/);
  await page.screenshot({
    path: ".artifacts/cms-editor-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: ".artifacts/cms-editor-desktop.png",
    fullPage: true,
  });
});

test("invalid writes and unsafe uploads fail without losing the editor draft", async ({
  page,
}) => {
  await login(page);
  await expect(page).toHaveURL(/\/admin$/);
  const api = page.request;
  const input = importArticle(articles[0]);
  const bad = await api.post("/api/admin/posts", {
    headers: { Origin: origin },
    data: {
      ...input,
      content: {
        type: "doc",
        content: [
          {
            type: "text",
            text: "unsafe",
            marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
          },
        ],
      },
    },
  });
  expect(bad.status()).toBe(400);
  const unsafe = await api.post("/api/admin/upload", {
    headers: { Origin: origin },
    multipart: {
      file: {
        name: "bad.svg",
        mimeType: "image/svg+xml",
        buffer: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
        ),
      },
    },
  });
  expect(unsafe.status()).toBe(400);
  const uploaded = await api.post("/api/admin/upload", {
    headers: { Origin: origin },
    multipart: {
      file: {
        name: "capture.webp",
        mimeType: "image/webp",
        buffer: fs.readFileSync(
          `public${articles.find((a) => a.featuredImage.src)!.featuredImage.src}`,
        ),
      },
    },
  });
  expect(uploaded.status()).toBe(201);
  const media = (await uploaded.json()).media;
  expect(media.width).toBeLessThanOrEqual(1600);
  expect(media.height).toBeLessThanOrEqual(2400);
  expect(media.src).toMatch(/blog-media\/.+\.webp$/);
  await page.goto("/admin/posts/new");
  await page.getByLabel("Title", { exact: true }).fill("Keep my draft");
  await page
    .getByRole("textbox", { name: "Article content" })
    .fill("These unsaved words must survive a failed request.");
  await page.route("**/api/admin/posts", (r) =>
    r.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "The database is unavailable." }),
    }),
  );
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.locator(".cms-error")).toHaveText(
    "The database is unavailable.",
  );
  await expect(
    page.getByRole("textbox", { name: "Article content" }),
  ).toContainText("These unsaved words must survive");
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "Keep my draft",
  );
});
