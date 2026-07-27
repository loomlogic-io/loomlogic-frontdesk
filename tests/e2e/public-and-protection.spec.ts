import { expect, test } from "@playwright/test";

test("public entry explains the Phase 1 product boundary", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Turn missed calls into owned outcomes.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Phase 1 scope")).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Public navigation" })
      .getByRole("button", { name: "Sign in" }),
  ).toBeVisible();
});

test("an unauthenticated user cannot open the application", async ({ page }) => {
  test.skip(
    !process.env.E2E_CLERK_USER_EMAIL ||
      !process.env.E2E_CLERK_ORGANIZATION_NAME ||
      !process.env.CLERK_SECRET_KEY ||
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    "Requires a real Clerk development instance.",
  );

  await page.goto("/app");

  await expect(page).toHaveURL(/\/sign-in/);
});

test("public entry remains usable at a mobile viewport @mobile", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Turn missed calls into owned outcomes.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Public navigation" })).toBeVisible();
});
