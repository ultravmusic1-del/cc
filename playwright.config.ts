import { defineConfig } from "@playwright/test";

/**
 * Smoke tests against a production build (`next start`), not the dev server:
 * dev compiles on demand and runs React Strict Mode, so it is slower and
 * behaves differently from what visitors get.
 *
 *   npm run test:e2e      # builds into .next-e2e, then runs the suite
 *
 * The separate build folder means this is safe while `npm run dev` is running.
 */
const PORT = 3200;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { browserName: "chromium", viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    env: { NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next-e2e" },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
