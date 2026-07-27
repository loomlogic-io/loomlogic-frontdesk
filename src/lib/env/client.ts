import {
  clientEnvironmentSchema,
  parseEnvironment,
  type ClientEnvironment,
} from "@/lib/env/schema";

export function getClientEnvironment(): ClientEnvironment {
  return parseEnvironment(
    clientEnvironmentSchema,
    {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
    "client",
  );
}
