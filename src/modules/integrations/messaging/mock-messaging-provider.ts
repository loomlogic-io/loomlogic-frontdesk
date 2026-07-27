import { createHash } from "node:crypto";

import type {
  MessagingProvider,
  SendTextInput,
  SendTextResult,
} from "@/modules/integrations/messaging/messaging-provider";

export class MockMessagingProvider implements MessagingProvider {
  readonly providerName = "mock" as const;
  private readonly results = new Map<string, SendTextResult>();

  async sendText(input: SendTextInput): Promise<SendTextResult> {
    const existing = this.results.get(input.idempotencyKey);
    if (existing) {
      return existing;
    }

    const result: SendTextResult =
      input.fixtureOutcome === "failure"
        ? { status: "failed", errorCode: "MOCK_DELIVERY_REJECTED" }
        : {
            status: "sent",
            providerMessageId: `mock_${createHash("sha256")
              .update(input.idempotencyKey)
              .digest("hex")
              .slice(0, 20)}`,
          };

    this.results.set(input.idempotencyKey, result);
    return result;
  }
}
