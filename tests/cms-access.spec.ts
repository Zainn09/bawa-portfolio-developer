import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("unconfigured dashboard fails closed without demo access", async ({
  page,
  request,
}) => {
  await page.goto("/admin/posts/new");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByText("Connect Supabase to enable sign-in."),
  ).toBeVisible();
  await expect(page.locator("input[type=password]")).toHaveCount(0);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    /noindex/,
  );
  for (const url of [
    "/api/admin/posts",
    "/api/admin/posts/00000000-0000-4000-8000-000000000001",
  ])
    expect((await request.get(url)).status()).toBe(503);
  const cross = await request.post("/api/admin/posts", {
    headers: { Origin: "https://attacker.test" },
    data: {},
  });
  expect(cross.status()).toBe(403);
  const missing = await request.post("/api/admin/session", {
    headers: { Origin: "http://localhost:3000" },
    data: { email: "not-an-admin@example.test", password: "not-a-password" },
  });
  expect(missing.status()).toBe(503);
  expect(missing.headers()["cache-control"]).toContain("no-store");
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id),
  ).toEqual([]);
});
test("setup screen fits all supported widths, including a dark preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/admin/login");
  for (const width of [
    320, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, 2560,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${width}px`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id),
  ).toEqual([]);
});
