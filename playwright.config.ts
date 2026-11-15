import { defineConfig, devices } from "@playwright/test";

const schemes = ["light", "dark"] as const;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 180_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/serve.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: schemes.flatMap((colorScheme) => [
    {
      name: `iphone-${colorScheme}`,
      use: { ...devices["iPhone 13"], colorScheme, browserName: "webkit" },
    },
    {
      name: `narrow-${colorScheme}`,
      use: {
        browserName: "chromium",
        viewport: { width: 320, height: 720 },
        colorScheme,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: `tablet-${colorScheme}`,
      use: {
        browserName: "chromium",
        viewport: { width: 768, height: 1024 },
        colorScheme,
      },
    },
    {
      name: `desktop-${colorScheme}`,
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 800 },
        colorScheme,
      },
    },
  ]),
});
