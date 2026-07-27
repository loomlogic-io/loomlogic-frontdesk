import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";

const emailAddress = process.env.E2E_CLERK_USER_EMAIL;
const organizationName = process.env.E2E_CLERK_ORGANIZATION_NAME;
const recoveryCaseId = process.env.E2E_RECOVERY_CASE_ID;

test("a manager can approve a mock follow-up and confirm recovered value", async ({
  page,
}) => {
  test.skip(
    !emailAddress || !organizationName || !recoveryCaseId,
    "Requires Clerk credentials plus E2E_RECOVERY_CASE_ID for an unresolved fixture.",
  );

  await page.goto("/");
  await clerk.signIn({ page, emailAddress: emailAddress! });
  await page.goto("/organization");

  if (page.url().includes("/organization")) {
    await page.getByText(organizationName!, { exact: true }).click();
  }

  await page.goto(`/app/recovery/${recoveryCaseId!}`);
  await expect(page.getByText("Draft follow-up")).toBeVisible();

  await page.getByRole("button", { name: "Save for approval" }).click();
  await expect(
    page.getByText("Draft saved. Review it below before approving the mock send."),
  ).toBeVisible();
  await expect(page.getByText("Review follow-up")).toBeVisible();

  await page.getByRole("button", { name: "Approve and run mock send" }).click();
  await expect(
    page.getByText("Approved. The mock adapter recorded the follow-up as sent."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Mark booked" }).click();
  await expect(
    page.getByText("Booking confirmed. Recovered value is now confirmed."),
  ).toBeVisible();
  await expect(page.getByText("Outcome recorded")).toBeVisible();

  await page.goto("/app");
  await expect(page.getByText("Booked outcomes")).toBeVisible();
  await expect(page.getByText("Recovered value")).toBeVisible();
});
