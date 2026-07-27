import { describe, expect, it } from "vitest";

import {
  createAttribution,
  selectCurrentAttribution,
} from "@/modules/recovery/domain/attribution";

describe("revenue attribution", () => {
  it("creates an estimated attribution using integer minor units", () => {
    expect(
      createAttribution({
        level: "estimated",
        amountMinor: 24900,
        currencyCode: "CAD",
        caseStatus: "new",
      }),
    ).toEqual({
      level: "estimated",
      amountMinor: 24900,
      currencyCode: "CAD",
      confidence: 0.65,
      evidenceType: "case_estimate",
      evidenceReference: null,
    });
  });

  it("rejects confirmed value before a booked outcome", () => {
    expect(() =>
      createAttribution({
        level: "confirmed",
        amountMinor: 24900,
        currencyCode: "CAD",
        caseStatus: "awaiting_customer",
      }),
    ).toThrow("Confirmed attribution requires a booked or recovered case.");
  });

  it("rejects unsafe money and currency representations", () => {
    expect(() =>
      createAttribution({
        level: "estimated",
        amountMinor: 12.5,
        currencyCode: "CAD",
        caseStatus: "new",
      }),
    ).toThrow("Attribution amount must be a non-negative integer.");
    expect(() =>
      createAttribution({
        level: "estimated",
        amountMinor: 1250,
        currencyCode: "cad",
        caseStatus: "new",
      }),
    ).toThrow("Attribution currency must be an ISO 4217 code.");
  });

  it("selects one highest-confidence attribution instead of double counting", () => {
    const current = selectCurrentAttribution([
      { id: "estimated", level: "estimated" as const },
      { id: "verified", level: "verified" as const },
      { id: "confirmed", level: "confirmed" as const },
    ]);

    expect(current).toEqual({ id: "verified", level: "verified" });
  });
});
