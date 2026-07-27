import type { Icon } from "@phosphor-icons/react";
import {
  CheckCircle,
  Clock,
  Prohibit,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utilities/cn";

type Tone = "success" | "attention" | "danger" | "muted" | "progress";

/*
 * Explicit tone per status rather than set membership with an implicit
 * fallback: an unmapped status renders as neutral "progress" instead of
 * silently borrowing another state's meaning. Every tone pairs colour with an
 * icon and a text label, so status never depends on colour alone.
 */
const statusTones: Record<string, Tone> = {
  // Recovered and completed outcomes.
  booked: "success",
  recovered: "success",
  sent: "success",
  succeeded: "success",
  completed: "success",
  delivered: "success",
  approved: "success",
  resolved: "success",

  // Needs a person.
  new: "attention",
  awaiting_staff: "attention",
  escalated: "attention",
  pending: "attention",
  high: "attention",
  overdue: "attention",

  // Genuine failures, kept distinct from "needs attention".
  failed: "danger",
  rejected: "danger",
  no_show: "danger",

  // Terminal without recovery.
  closed: "muted",
  disqualified: "muted",
  opted_out: "muted",
  lost: "muted",
  cancelled: "muted",
  draft: "muted",

  // Active work in progress.
  engaging: "progress",
  qualified: "progress",
  awaiting_customer: "progress",
  booking_offered: "progress",
  open: "progress",
  waiting: "progress",
  queued: "progress",
};

const toneIcons: Record<Tone, Icon> = {
  success: CheckCircle,
  attention: WarningCircle,
  danger: WarningCircle,
  muted: Prohibit,
  progress: Clock,
};

const toneStyles: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  attention: "bg-warning/12 text-foreground",
  danger: "bg-danger/10 text-danger",
  muted: "bg-surface-strong text-muted-foreground",
  progress: "bg-primary/8 text-primary",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTones[status.toLowerCase()] ?? "progress";
  const ToneIcon = toneIcons[tone];

  return (
    <span
      data-tone={tone}
      className={cn(
        "inline-flex min-h-7 w-fit items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold capitalize",
        toneStyles[tone],
      )}
    >
      <ToneIcon aria-hidden="true" size={14} weight="fill" />
      {status.replaceAll("_", " ")}
    </span>
  );
}
