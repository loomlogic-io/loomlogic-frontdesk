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

export function recoveryReference(providerEventId: string): string {
  const suffix = createHash("sha256")
    .update(providerEventId)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();

  return `RC-${suffix}`;
}
