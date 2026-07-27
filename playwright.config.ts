import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const hasClerkE2EConfiguration = Boolean(
  process.env.CLERK_SECRET_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.E2E_CLERK_USER_EMAIL &&
  process.env.E2E_CLERK_ORGANIZATION_NAME,
);

const applicationEnvironment = {
  NEXT_PUBLIC_APP_URL: baseURL,
  ...(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ? {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      }
    : {}),
  ...(process.env.CLERK_SECRET_KEY
    ? { CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY }
    : {}),
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_phase_0_test",
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: ["**/*.authenticated.spec.ts", "**/clerk.setup.ts"],
      grepInvert: /@mobile/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      testIgnore: ["**/*.authenticated.spec.ts", "**/clerk.setup.ts"],
      grep: /@mobile/,
      use: { ...devices["Pixel 7"] },
    },
    ...(hasClerkE2EConfiguration
      ? [
          {
            name: "clerk-setup",
            testMatch: /clerk\.setup\.ts/,
          },
          {
            name: "authenticated-chromium",
            dependencies: ["clerk-setup"],
            testMatch: /.*\.authenticated\.spec\.ts/,
            use: { ...devices["Desktop Chrome"] },
          },
        ]
      : []),
  ],
  ...(process.env.PLAYWRIGHT_BASE_URL
    ? {}
    : {
        webServer: {
          command: "pnpm dev",
          env: applicationEnvironment,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
