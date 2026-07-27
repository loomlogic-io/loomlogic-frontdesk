import { describe, expect, it } from "vitest";

import {
  payloadSha256,
  signDevelopmentWebhook,
  verifyDevelopmentWebhook,
} from "@/modules/recovery/webhooks/development-signature";

describe("development webhook signing", () => {
  const secret = "development-secret-with-at-least-32-characters";
  const rawBody = '{"provider_event_id":"evt_demo_001"}';
  const now = new Date("2026-07-27T12:00:00.000Z");
  const timestamp = String(Math.floor(now.getTime() / 1000));

  it("accepts a current valid HMAC over the exact raw body", () => {
    const signature = signDevelopmentWebhook(rawBody, timestamp, secret);

    expect(
      verifyDevelopmentWebhook({
        rawBody,
        timestamp,
        signature,
        secret,
        now,
      }),
    ).toBe(true);
  });

  it("rejects payload tampering and stale replay attempts", () => {
    const signature = signDevelopmentWebhook(rawBody, timestamp, secret);

    expect(
      verifyDevelopmentWebhook({
        rawBody: `${rawBody} `,
        timestamp,
        signature,
        secret,
        now,
      }),
    ).toBe(false);
    expect(
      verifyDevelopmentWebhook({
        rawBody,
        timestamp,
        signature,
        secret,
        now: new Date(now.getTime() + 301_000),
      }),
    ).toBe(false);
  });

  it("creates a stable payload hash without retaining payload text", () => {
    expect(payloadSha256(rawBody)).toMatch(/^[a-f0-9]{64}$/);
    expect(payloadSha256(rawBody)).toBe(payloadSha256(rawBody));
  });
});
