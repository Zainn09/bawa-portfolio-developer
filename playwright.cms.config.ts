import { defineConfig } from "@playwright/test";
import chromium from "@sparticuz/chromium";
export default defineConfig({
  testDir: "./tests",
  testMatch: "cms-integration.spec.ts",
  workers: 1,
  expect: { timeout: 15000 },
  timeout: 90000,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      executablePath: "/tmp/chromium",
      args: chromium.args.filter(
        (a) => !["--single-process", "--disable-web-security"].includes(a),
      ),
      env: {
        ...process.env,
        LD_LIBRARY_PATH: `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH || ""}`,
      },
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node tests/fixtures/cms-supabase.mjs",
      url: "http://127.0.0.1:4010/__reset",
      reuseExistingServer: false,
    },
    {
      command: "npx next dev --hostname 0.0.0.0 --port 3001",
      url: "http://localhost:3001/admin/login",
      timeout: 120000,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4010",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          "test-only-not-a-real-project-key",
        BLOG_CONTENT_SOURCE: "database",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3001",
      },
    },
  ],
});
