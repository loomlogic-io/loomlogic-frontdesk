import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const MAX_AGE_SECONDS = 5 * 60;

export function payloadSha256(rawBody: string) {
  return createHash("sha256").update(rawBody).digest("hex");
}

export function signDevelopmentWebhook(
  rawBody: string,
  timestamp: string,
  secret: string,
) {
  return createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
}

export function verifyDevelopmentWebhook(input: {
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
  secret: string;
  now?: Date;
}) {
  if (!input.timestamp || !input.signature || !/^[a-f0-9]{64}$/i.test(input.signature)) {
    return false;
  }

  const timestampSeconds = Number.parseInt(input.timestamp, 10);
  if (!Number.isSafeInteger(timestampSeconds)) {
    return false;
  }

  const nowSeconds = Math.floor((input.now ?? new Date()).getTime() / 1000);
  if (Math.abs(nowSeconds - timestampSeconds) > MAX_AGE_SECONDS) {
    return false;
  }

  const expected = signDevelopmentWebhook(input.rawBody, input.timestamp, input.secret);
  return timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(input.signature, "hex"),
  );
}
