import "server-only";

import {
  parseEnvironment,
  serverEnvironmentSchema,
  type ServerEnvironment,
} from "@/lib/env/schema";

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnvironment(): ServerEnvironment {
  cachedEnvironment ??= parseEnvironment(
    serverEnvironmentSchema,
    {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET || undefined,
      DEV_WEBHOOK_SIGNING_SECRET: process.env.DEV_WEBHOOK_SIGNING_SECRET || undefined,
      LOG_LEVEL: process.env.LOG_LEVEL || undefined,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
    },
    "server",
  );

  return cachedEnvironment;
}
