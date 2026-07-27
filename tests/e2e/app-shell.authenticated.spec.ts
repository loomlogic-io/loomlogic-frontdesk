import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";

const emailAddress = process.env.E2E_CLERK_USER_EMAIL;
const organizationName = process.env.E2E_CLERK_ORGANIZATION_NAME;

test("an authenticated member can select an organization and use the app shell", async ({
  page,
}) => {
  test.skip(
    !emailAddress || !organizationName,
    "Requires E2E_CLERK_USER_EMAIL and E2E_CLERK_ORGANIZATION_NAME.",
  );

  await page.goto("/");
  await clerk.signIn({ page, emailAddress: emailAddress! });
  await page.goto("/organization");

  if (page.url().includes("/organization")) {
    await page.getByText(organizationName!, { exact: true }).click();
  }

  await page.goto("/app");

  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(
    page.getByText(
      "Authoritative Recovery Case, follow-up, outcome, and attribution data for the active workspace.",
    ),
  ).toBeVisible();
});
