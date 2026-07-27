export const recoveryCaseStatuses = [
  "new",
  "engaging",
  "qualified",
  "awaiting_customer",
  "awaiting_staff",
  "booking_offered",
  "booked",
  "escalated",
  "recovered",
  "disqualified",
  "opted_out",
  "lost",
  "closed",
] as const;

export type RecoveryCaseStatus = (typeof recoveryCaseStatuses)[number];
export type ResolutionType =
  "booked" | "resolved" | "disqualified" | "opted_out" | "lost";

const allowedTransitions: Readonly<
  Record<RecoveryCaseStatus, readonly RecoveryCaseStatus[]>
> = {
  new: ["engaging", "awaiting_staff", "escalated", "disqualified", "opted_out", "lost"],
  engaging: [
    "qualified",
    "awaiting_customer",
    "awaiting_staff",
    "booking_offered",
    "booked",
    "escalated",
    "disqualified",
    "opted_out",
    "lost",
  ],
  qualified: [
    "awaiting_customer",
    "awaiting_staff",
    "booking_offered",
    "booked",
    "escalated",
    "disqualified",
    "opted_out",
    "lost",
  ],
  awaiting_customer: [
    "engaging",
    "awaiting_staff",
    "booking_offered",
    "booked",
    "escalated",
    "opted_out",
    "lost",
  ],
  awaiting_staff: [
    "engaging",
    "qualified",
    "booking_offered",
    "booked",
    "escalated",
    "disqualified",
    "opted_out",
    "lost",
  ],
  booking_offered: [
    "awaiting_customer",
    "awaiting_staff",
    "booked",
    "escalated",
    "opted_out",
    "lost",
  ],
  booked: ["recovered", "closed"],
  escalated: [
    "engaging",
    "awaiting_customer",
    "awaiting_staff",
    "booked",
    "disqualified",
    "opted_out",
    "lost",
  ],
  recovered: ["closed"],
  disqualified: ["closed"],
  opted_out: ["closed"],
  lost: ["closed"],
  closed: [],
};

export class InvalidRecoveryTransitionError extends Error {
  constructor(from: RecoveryCaseStatus, to: RecoveryCaseStatus) {
    super(`Recovery Case cannot transition from ${from} to ${to}.`);
    this.name = "InvalidRecoveryTransitionError";
  }
}

export type RecoveryTransition = {
  status: RecoveryCaseStatus;
  resolutionType: ResolutionType | null;
  resolvedAt: string | null;
  lostReason: string | null;
};

export function transitionRecoveryCase(
  from: RecoveryCaseStatus,
  to: RecoveryCaseStatus,
  input: {
    now: Date;
    resolutionType?: ResolutionType;
    lostReason?: string;
  },
): RecoveryTransition {
  if (!allowedTransitions[from].includes(to)) {
    throw new InvalidRecoveryTransitionError(from, to);
  }

  const isResolved = [
    "booked",
    "recovered",
    "disqualified",
    "opted_out",
    "lost",
    "closed",
  ].includes(to);

  if (to === "lost" && !input.lostReason?.trim()) {
    throw new Error("A loss reason is required.");
  }

  const inferredResolution: ResolutionType | undefined =
    to === "booked"
      ? "booked"
      : to === "recovered" || to === "closed"
        ? "resolved"
        : to === "disqualified"
          ? "disqualified"
          : to === "opted_out"
            ? "opted_out"
            : to === "lost"
              ? "lost"
              : undefined;

  return {
    status: to,
    resolutionType: isResolved
      ? (input.resolutionType ?? inferredResolution ?? null)
      : null,
    resolvedAt: isResolved ? input.now.toISOString() : null,
    lostReason: to === "lost" ? input.lostReason!.trim() : null,
  };
}

export function isOpenRecoveryStatus(status: RecoveryCaseStatus) {
  return !["booked", "recovered", "disqualified", "opted_out", "lost", "closed"].includes(
    status,
  );
}
