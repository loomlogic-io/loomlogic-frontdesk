import { describe, expect, it } from "vitest";

import { redactLogContext } from "@/lib/logging/redact";

describe("redactLogContext", () => {
  it("redacts sensitive fields recursively without changing safe metadata", () => {
    expect(
      redactLogContext({
        requestId: "request-safe",
        authorization: "Bearer secret",
        nested: {
          transcript: "customer content",
          status: "failed",
        },
      }),
    ).toEqual({
      requestId: "request-safe",
      authorization: "[REDACTED]",
      nested: {
        transcript: "[REDACTED]",
        status: "failed",
      },
    });
  });
});
