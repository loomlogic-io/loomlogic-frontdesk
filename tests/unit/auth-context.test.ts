import { describe, expect, it } from "vitest";

import {
  assertOrganizationMatchesSession,
  requireVerifiedTenant,
} from "@/lib/auth/context";
import {
  ActiveOrganizationRequiredError,
  AuthenticationRequiredError,
  ForbiddenError,
} from "@/lib/errors/app-error";

describe("requireVerifiedTenant", () => {
  it("returns only verified session tenant context", () => {
    expect(
      requireVerifiedTenant({
        userId: "user_a",
        organizationId: "org_a",
        organizationRole: "org:manager",
      }),
    ).toEqual({
      clerkUserId: "user_a",
      clerkOrganizationId: "org_a",
      organizationRole: "org:manager",
    });
  });

  it("rejects an unauthenticated session", () => {
    expect(() =>
      requireVerifiedTenant({
        userId: null,
        organizationId: null,
      }),
    ).toThrow(AuthenticationRequiredError);
  });

  it("rejects a session without an active organization", () => {
    expect(() =>
      requireVerifiedTenant({
        userId: "user_a",
        organizationId: null,
      }),
    ).toThrow(ActiveOrganizationRequiredError);
  });
});

describe("assertOrganizationMatchesSession", () => {
  const tenant = requireVerifiedTenant({
    userId: "user_a",
    organizationId: "org_a",
  });

  it("accepts an absent routing hint", () => {
    expect(() => assertOrganizationMatchesSession(tenant, undefined)).not.toThrow();
  });

  it("accepts the active verified organization", () => {
    expect(() => assertOrganizationMatchesSession(tenant, "org_a")).not.toThrow();
  });

  it("rejects a client-supplied organization mismatch", () => {
    expect(() => assertOrganizationMatchesSession(tenant, "org_b")).toThrow(
      ForbiddenError,
    );
  });
});
