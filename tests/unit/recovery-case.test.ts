import { describe, expect, it } from "vitest";

import {
  InvalidRecoveryTransitionError,
  isOpenRecoveryStatus,
  transitionRecoveryCase,
} from "@/modules/recovery/domain/recovery-case";

describe("Recovery Case state transitions", () => {
  const now = new Date("2026-07-27T12:00:00.000Z");

  it("moves an engaging case to a booked outcome with a resolution timestamp", () => {
    expect(transitionRecoveryCase("engaging", "booked", { now })).toEqual({
      status: "booked",
      resolutionType: "booked",
      resolvedAt: now.toISOString(),
      lostReason: null,
    });
  });

  it("keeps an in-progress transition unresolved", () => {
    expect(transitionRecoveryCase("new", "awaiting_staff", { now })).toEqual({
      status: "awaiting_staff",
      resolutionType: null,
      resolvedAt: null,
      lostReason: null,
    });
  });

  it("rejects an invalid transition from a terminal case", () => {
    expect(() => transitionRecoveryCase("closed", "engaging", { now })).toThrow(
      InvalidRecoveryTransitionError,
    );
  });

  it("requires a loss reason", () => {
    expect(() => transitionRecoveryCase("engaging", "lost", { now })).toThrow(
      "A loss reason is required.",
    );
  });

  it("identifies open and terminal statuses", () => {
    expect(isOpenRecoveryStatus("awaiting_customer")).toBe(true);
    expect(isOpenRecoveryStatus("booked")).toBe(false);
  });
});
