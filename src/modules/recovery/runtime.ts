import "server-only";

import { createServerSupabaseClient } from "@/lib/db/server";
import { RecoveryCommandRepository } from "@/modules/recovery/repositories/recovery-command-repository";
import { RecoveryQueryRepository } from "@/modules/recovery/repositories/recovery-query-repository";

export async function createRecoveryRequestContext() {
  const { client, tenant } = await createServerSupabaseClient();
  const commands = new RecoveryCommandRepository(client);
  const actor = await commands.resolveApplicationActor(
    tenant.clerkOrganizationId,
    tenant.clerkUserId,
  );

  return {
    actor,
    commands,
    queries: new RecoveryQueryRepository(client),
    tenant,
  };
}
