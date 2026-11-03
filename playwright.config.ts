import { defineConfig } from "@playwright/test";

const previewOrigin = new URL(process.env.PORTFOLIO_PREVIEW_ORIGIN ?? "http://127.0.0.1:4398");
// Opt-in trust for our self-signed loopback fixture only. Remote preview origins retain
// normal certificate verification; site CSP/headers and assertions stay intact.
const localTLS = process.env.PORTFOLIO_LOCAL_TLS === "1"
  && previewOrigin.protocol === "https:"
  && ["127.0.0.1", "localhost"].includes(previewOrigin.hostname);

// Serve the exact export with `wrangler pages dev out --port 4398` first.
// The browser plugin is unavailable in the cloud task; use Playwright directly.
export default defineConfig({
  testDir: "./scripts/browser-regressions/playwright",
  outputDir: "./artifacts/frontend-review/browser-results",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  workers: 2,
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "artifacts/frontend-review/playwright-results.json" }]],
  use: {
    baseURL: previewOrigin.origin,
    ignoreHTTPSErrors: localTLS,
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    timezoneId: "Australia/Sydney",
    locale: "en-AU",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium", launchOptions: {
      executablePath: process.env.PORTFOLIO_CHROMIUM_PATH || undefined,
    } } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
