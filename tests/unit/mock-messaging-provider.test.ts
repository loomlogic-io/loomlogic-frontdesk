import { describe, expect, it } from "vitest";

import { MockMessagingProvider } from "@/modules/integrations/messaging/mock-messaging-provider";

const baseInput = {
  organizationId: "11000000-0000-4000-8000-000000000001",
  messageId: "99000000-0000-4000-8000-000000000009",
  recipient: "+15550101420",
  body: "Synthetic follow-up.",
  idempotencyKey: "send:fixture-001",
  correlationId: "request-001",
} as const;

describe("MockMessagingProvider", () => {
  it("returns the same deterministic result for repeated idempotency keys", async () => {
    const provider = new MockMessagingProvider();

    const first = await provider.sendText(baseInput);
    const duplicate = await provider.sendText({
      ...baseInput,
      body: "A later request cannot change the recorded result.",
    });

    expect(first).toEqual(duplicate);
    expect(first).toEqual({
      status: "sent",
      providerMessageId: expect.stringMatching(/^mock_[a-f0-9]{20}$/),
    });
  });

  it("supports a deterministic local failure fixture", async () => {
    const provider = new MockMessagingProvider();

    await expect(
      provider.sendText({
        ...baseInput,
        idempotencyKey: "send:fixture-failure",
        fixtureOutcome: "failure",
      }),
    ).resolves.toEqual({
      status: "failed",
      errorCode: "MOCK_DELIVERY_REJECTED",
    });
  });
});
