import "server-only";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

import { requireVerifiedTenant } from "@/lib/auth/context";
import { getServerEnvironment } from "@/lib/env/server";
import type { Database } from "@/types/database.generated";

export async function createServerSupabaseClient() {
  const session = await auth();
  const tenant = requireVerifiedTenant({
    userId: session.userId,
    organizationId: session.orgId ?? null,
    organizationRole: session.orgRole ?? null,
  });
  const environment = getServerEnvironment();

  const client = createClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      accessToken: async () => session.getToken(),
    },
  );

  return { client, tenant };
}
