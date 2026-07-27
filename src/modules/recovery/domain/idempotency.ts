import { createHash } from "node:crypto";

export function deterministicUuid(namespace: string, key: string): string {
  const hex = createHash("sha256")
    .update(`${namespace}:${key}`)
    .digest("hex")
    .slice(0, 32);
  const characters = hex.split("");

  characters[12] = "4";
  characters[16] = ["8", "9", "a", "b"][Number.parseInt(characters[16]!, 16) % 4]!;

  const value = characters.join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

/**
 * Natural key for "the follow-up draft belonging to this Recovery Case".
 *
 * It must be derived on the server from durable domain state, never supplied by
 * the browser and never regenerated per render: `draftFollowUp` short-circuits
 * on this key and derives the message, approval, event, and audit UUIDs from it,
 * so an unstable key silently creates duplicate records instead of deduplicating.
 *
 * Phase 1 allows one draft per Recovery Case: the composer is hidden while an
 * approval is pending, approved, or failed, and a resolved case is rejected by
 * the service. A later phase that supports cancelling a draft and composing a
 * replacement must extend this key (for example with an attempt ordinal) rather
 * than reintroduce a random value.
 */
export function draftFollowUpIdempotencyKey(recoveryCaseId: string): string {
  return `draft:${recoveryCaseId}`;
}

export function recoveryReference(providerEventId: string): string {
  const suffix = createHash("sha256")
    .update(providerEventId)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();

  return `RC-${suffix}`;
}
