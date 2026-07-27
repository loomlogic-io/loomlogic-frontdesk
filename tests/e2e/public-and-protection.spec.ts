import { expect, test } from "@playwright/test";

test("public entry positions LoomLogic and routes to the working sign-up flow", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Turn missed calls into booked business.",
    }),
  ).toBeVisible();
  await expect(page.getByText("AI Front Desk & Revenue Recovery").first()).toBeVisible();

  const navigation = page.getByRole("navigation", { name: "Public navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("button", { name: "Sign in" })).toBeVisible();

  // The primary call to action must reach the real Clerk sign-up route.
  await page.getByRole("link", { name: "Create workspace" }).first().click();
  await expect(page).toHaveURL(/\/sign-up/);
});

test("public entry explains the recovery model without inventing proof", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "The call ends. The recovery process does not." }),
  ).toBeVisible();
  await expect(
    page.getByText("Illustrative product sequence", { exact: false }),
  ).toBeVisible();

  // Roadmap integrations must never be presented as connected.
  await expect(page.getByText("On the roadmap").first()).toBeVisible();
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
      name: "Turn missed calls into booked business.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Public navigation" })).toBeVisible();

  // The drawer is a real modal dialog: it traps focus and closes on Escape.
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Site menu" });
  await expect(menu).toBeVisible();
  await expect(page.locator("body")).toHaveAttribute("style", /overflow: hidden/);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.locator("body")).not.toHaveAttribute("style", /overflow: hidden/);
});
