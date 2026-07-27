import {
  ActiveOrganizationRequiredError,
  AuthenticationRequiredError,
  ForbiddenError,
} from "@/lib/errors/app-error";

export type VerifiedSession = {
  userId: string | null;
  organizationId: string | null;
  organizationRole?: string | null;
};

export type TenantContext = {
  clerkUserId: string;
  clerkOrganizationId: string;
  organizationRole: string | null;
};

export function requireVerifiedTenant(session: VerifiedSession): TenantContext {
  if (!session.userId) {
    throw new AuthenticationRequiredError();
  }

  if (!session.organizationId) {
    throw new ActiveOrganizationRequiredError();
  }

  return {
    clerkUserId: session.userId,
    clerkOrganizationId: session.organizationId,
    organizationRole: session.organizationRole ?? null,
  };
}

/**
 * A request may include an organization ID as a routing hint, but never as
 * authorization evidence. Compare it to the verified Clerk session or reject it.
 */
export function assertOrganizationMatchesSession(
  tenant: TenantContext,
  requestedOrganizationId: string | null | undefined,
) {
  if (requestedOrganizationId && requestedOrganizationId !== tenant.clerkOrganizationId) {
    throw new ForbiddenError("The requested workspace is not active.");
  }
}
