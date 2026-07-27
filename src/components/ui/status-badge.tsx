import {
  CheckCircle,
  Clock,
  Prohibit,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utilities/cn";

const successStates = new Set(["booked", "recovered", "sent", "succeeded", "completed"]);
const warningStates = new Set([
  "new",
  "awaiting_staff",
  "pending",
  "high",
  "escalated",
  "failed",
]);
const mutedStates = new Set(["closed", "disqualified", "opted_out", "lost", "cancelled"]);

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const Icon = successStates.has(normalized)
    ? CheckCircle
    : warningStates.has(normalized)
      ? WarningCircle
      : mutedStates.has(normalized)
        ? Prohibit
        : Clock;

  return (
    <span
      className={cn(
        "inline-flex min-h-7 w-fit items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
        successStates.has(normalized) && "bg-success/10 text-success",
        warningStates.has(normalized) && "bg-warning/12 text-foreground",
        mutedStates.has(normalized) && "bg-surface-strong text-muted-foreground",
        !successStates.has(normalized) &&
          !warningStates.has(normalized) &&
          !mutedStates.has(normalized) &&
          "bg-primary/8 text-primary",
      )}
    >
      <Icon aria-hidden="true" size={14} weight="fill" />
      {status.replaceAll("_", " ")}
    </span>
  );
}
