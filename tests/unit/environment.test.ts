import { describe, expect, it } from "vitest";

import { clientEnvironmentSchema, parseEnvironment } from "@/lib/env/schema";
import { ConfigurationError } from "@/lib/errors/app-error";

describe("client environment validation", () => {
  it("accepts a complete public environment", () => {
    const result = parseEnvironment(
      clientEnvironmentSchema,
      {
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_example",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      },
      "client",
    );

    expect(result.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("fails with a safe configuration error when required values are absent", () => {
    expect(() => parseEnvironment(clientEnvironmentSchema, {}, "client")).toThrow(
      ConfigurationError,
    );
  });
});
