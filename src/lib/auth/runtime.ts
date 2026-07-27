import "server-only";

import { auth } from "@clerk/nextjs/server";

import { requireVerifiedTenant, type TenantContext } from "@/lib/auth/context";

export async function requireActiveTenant(): Promise<TenantContext> {
  const session = await auth();

  return requireVerifiedTenant({
    userId: session.userId,
    organizationId: session.orgId ?? null,
    organizationRole: session.orgRole ?? null,
  });
}
