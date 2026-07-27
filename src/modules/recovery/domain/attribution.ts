import type { RecoveryCaseStatus } from "@/modules/recovery/domain/recovery-case";

export type AttributionLevel = "estimated" | "confirmed" | "verified";

export type AttributionInput = {
  level: AttributionLevel;
  amountMinor: number;
  currencyCode: string;
  caseStatus: RecoveryCaseStatus;
  evidenceReference?: string;
};

export type Attribution = {
  level: AttributionLevel;
  amountMinor: number;
  currencyCode: string;
  confidence: number;
  evidenceType: "case_estimate" | "user_confirmed_booking" | "external_verification";
  evidenceReference: string | null;
};

export function createAttribution(input: AttributionInput): Attribution {
  if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor < 0) {
    throw new Error("Attribution amount must be a non-negative integer.");
  }

  if (!/^[A-Z]{3}$/.test(input.currencyCode)) {
    throw new Error("Attribution currency must be an ISO 4217 code.");
  }

  if (
    input.level === "confirmed" &&
    !["booked", "recovered", "closed"].includes(input.caseStatus)
  ) {
    throw new Error("Confirmed attribution requires a booked or recovered case.");
  }

  if (input.level === "verified" && !input.evidenceReference) {
    throw new Error("Verified attribution requires authoritative evidence.");
  }

  return {
    level: input.level,
    amountMinor: input.amountMinor,
    currencyCode: input.currencyCode,
    confidence: input.level === "estimated" ? 0.65 : 1,
    evidenceType:
      input.level === "estimated"
        ? "case_estimate"
        : input.level === "confirmed"
          ? "user_confirmed_booking"
          : "external_verification",
    evidenceReference: input.evidenceReference ?? null,
  };
}

export function selectCurrentAttribution<T extends { level: AttributionLevel }>(
  attributions: readonly T[],
): T | null {
  const priority: Readonly<Record<AttributionLevel, number>> = {
    estimated: 1,
    confirmed: 2,
    verified: 3,
  };

  return (
    [...attributions].sort(
      (left, right) => priority[right.level] - priority[left.level],
    )[0] ?? null
  );
}
