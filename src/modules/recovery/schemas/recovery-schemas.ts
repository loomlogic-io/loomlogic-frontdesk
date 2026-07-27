import { z } from "zod";

const e164Schema = z.string().regex(/^\+[1-9][0-9]{7,14}$/, "Use an E.164 phone number.");

export const missedCallFixtureSchema = z
  .object({
    provider_event_id: z.string().min(8).max(160),
    provider_call_id: z.string().min(8).max(160),
    event_type: z.literal("missed_call"),
    from_number: e164Schema,
    to_number: e164Schema,
    occurred_at: z.string().datetime({ offset: true }),
    contact: z
      .object({
        display_name: z.string().trim().min(1).max(200),
        first_name: z.string().trim().min(1).max(100).optional(),
        last_name: z.string().trim().min(1).max(100).optional(),
      })
      .strict(),
    reason: z.string().trim().min(1).max(240),
    summary: z.string().trim().min(1).max(1000),
    intent: z.string().trim().min(1).max(100),
    urgency: z.enum(["low", "normal", "high"]).default("normal"),
    estimated_value_minor: z.number().int().nonnegative(),
    currency_code: z.string().regex(/^[A-Z]{3}$/),
    fixture_outcome: z.enum(["success", "failure"]).default("success"),
  })
  .strict();

export const draftFollowUpSchema = z.object({
  recoveryCaseId: z.string().uuid(),
  recipient: e164Schema,
  body: z.string().trim().min(1).max(1000),
  idempotencyKey: z.string().min(8).max(160),
});

export const approvalActionSchema = z.object({
  approvalId: z.string().uuid(),
});

export const markBookedSchema = z.object({
  recoveryCaseId: z.string().uuid(),
});

export const assignCaseSchema = markBookedSchema;

export type MissedCallFixture = z.infer<typeof missedCallFixtureSchema>;
export type DraftFollowUpInput = z.infer<typeof draftFollowUpSchema>;
