import { describe, expect, it } from "vitest";

import {
  deterministicUuid,
  draftFollowUpIdempotencyKey,
} from "@/modules/recovery/domain/idempotency";
import { draftFollowUpSchema } from "@/modules/recovery/schemas/recovery-schemas";

const recoveryCaseId = "f1000000-0000-4000-8000-000000000001";
const otherRecoveryCaseId = "f1000000-0000-4000-8000-000000000002";

describe("draft follow-up idempotency key", () => {
  it("is stable across repeated derivations for the same Recovery Case", () => {
    // Regression: the key was previously built in the render path with
    // randomUUID(), so every render produced a new key, the approval
    // short-circuit never matched, and a retry created duplicate records.
    const keys = new Set(
      Array.from({ length: 100 }, () => draftFollowUpIdempotencyKey(recoveryCaseId)),
    );

    expect(keys.size).toBe(1);
  });

  it("distinguishes different Recovery Cases", () => {
    expect(draftFollowUpIdempotencyKey(recoveryCaseId)).not.toBe(
      draftFollowUpIdempotencyKey(otherRecoveryCaseId),
    );
  });

  it("produces stable derived record identities", () => {
    const key = draftFollowUpIdempotencyKey(recoveryCaseId);

    for (const namespace of ["message", "approval", "draft-event", "draft-audit"]) {
      expect(deterministicUuid(namespace, key)).toBe(
        deterministicUuid(namespace, draftFollowUpIdempotencyKey(recoveryCaseId)),
      );
    }
  });

  it("gives each derived record a distinct identity from the same key", () => {
    const key = draftFollowUpIdempotencyKey(recoveryCaseId);
    const ids = new Set(
      ["message", "approval", "draft-event", "draft-audit"].map((namespace) =>
        deterministicUuid(namespace, key),
      ),
    );

    expect(ids.size).toBe(4);
  });

  it("stays within the action_approvals idempotency key length budget", () => {
    expect(draftFollowUpIdempotencyKey(recoveryCaseId).length).toBeLessThanOrEqual(160);
  });
});

describe("draft follow-up input contract", () => {
  const validInput = {
    recoveryCaseId,
    recipient: "+15555550123",
    body: "Following up on your missed call.",
  };

  it("accepts a request that carries no idempotency key", () => {
    expect(draftFollowUpSchema.parse(validInput)).toEqual(validInput);
  });

  it("ignores a browser-supplied idempotency key", () => {
    const parsed = draftFollowUpSchema.parse({
      ...validInput,
      idempotencyKey: "attacker-chosen-approval-identity",
    });

    expect(parsed).not.toHaveProperty("idempotencyKey");
  });
});
