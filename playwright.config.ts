import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  reporter: [["html"], ["junit", { outputFile: "test-report-e2e.xml" }]],
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 10000,
    // headless: false, // Uncomment if you want to see the browser during test execution
    // launchOptions: {
    //   slowMo: 300,  // Uncomment to slow down actions for better observation
    // },
  },

  projects: [
    {
      name: "firefox",
      testDir: "./e2e-tests/tests/ui",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "chromium",
      testDir: "./e2e-tests/tests/ui",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "edge",
      testDir: "./e2e-tests/tests/ui",
      use: { ...devices["Desktop Edge"] },
    },
    {
      name: "api",
      testDir: "./e2e-tests/tests/api",
    },
  ],

  webServer: {
    command: "nx run application:dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env["CI"],
    timeout: 120000,
  },
});
