import { z } from "zod";

import { ConfigurationError } from "@/lib/errors/app-error";

export const clientEnvironmentSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export const serverEnvironmentSchema = clientEnvironmentSchema.extend({
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().startsWith("whsec_").optional(),
  DEV_WEBHOOK_SIGNING_SECRET: z.string().min(32).optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export type ClientEnvironment = z.infer<typeof clientEnvironmentSchema>;
export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function parseEnvironment<TSchema extends z.ZodType>(
  schema: TSchema,
  source: unknown,
  scope: "client" | "server",
): z.infer<TSchema> {
  const result = schema.safeParse(source);

  if (!result.success) {
    const fields = result.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");

    throw new ConfigurationError(
      `Invalid ${scope} environment configuration${fields ? `: ${fields}` : "."}`,
      { cause: result.error },
    );
  }

  return result.data;
}
