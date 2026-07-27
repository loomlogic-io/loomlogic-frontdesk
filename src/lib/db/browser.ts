"use client";

import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";

import { getClientEnvironment } from "@/lib/env/client";
import type { Database } from "@/types/database.generated";

export function useBrowserSupabaseClient() {
  const { session } = useSession();

  return useMemo(() => {
    const environment = getClientEnvironment();

    return createClient<Database>(
      environment.NEXT_PUBLIC_SUPABASE_URL,
      environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        accessToken: async () => session?.getToken() ?? null,
      },
    );
  }, [session]);
}
