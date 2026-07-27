"use client";

import type { RecoveryActionState } from "@/modules/recovery/actions/recovery-actions";
import { cn } from "@/lib/utilities/cn";

export function ActionFeedback({ state }: { state: RecoveryActionState }) {
  if (state.status === "idle") return null;

  return (
    <p
      className={cn(
        "mt-3 rounded-[var(--radius-control)] px-3 py-2 text-sm leading-5",
        state.status === "success"
          ? "bg-success/10 text-foreground"
          : "bg-danger/10 text-danger",
      )}
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}
