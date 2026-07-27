import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServerEnvironment } from "@/lib/env/server";
import { ConfigurationError } from "@/lib/errors/app-error";
import type { Database } from "@/types/database.generated";

/**
 * Trusted infrastructure client for verified webhook and maintenance workflows only.
 * Every repository call made with this client must include an explicit organization ID.
 */
export function createAdminSupabaseClient() {
  const environment = getServerEnvironment();

  if (!environment.SUPABASE_SERVICE_ROLE_KEY) {
    throw new ConfigurationError(
      "SUPABASE_SERVICE_ROLE_KEY is required for trusted server workflows.",
    );
  }

  return createClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
