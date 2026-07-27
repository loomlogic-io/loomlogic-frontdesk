export type SendTextInput = {
  organizationId: string;
  messageId: string;
  recipient: string;
  body: string;
  idempotencyKey: string;
  correlationId: string;
  fixtureOutcome?: "success" | "failure";
};

export type SendTextResult =
  | {
      status: "sent";
      providerMessageId: string;
    }
  | {
      status: "failed";
      errorCode: string;
    };

export interface MessagingProvider {
  readonly providerName: "mock";
  sendText(input: SendTextInput): Promise<SendTextResult>;
}
