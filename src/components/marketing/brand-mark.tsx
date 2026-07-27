import Link from "next/link";

import { cn } from "@/lib/utilities/cn";

/**
 * Public LoomLogic wordmark.
 *
 * LoomLogic stays the customer-facing master brand; "Resolve" remains the
 * internal product codename and is not shown publicly.
 */
export function BrandMark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "inverse";
}) {
  return (
    <Link
      aria-label="LoomLogic home"
      className={cn("inline-flex items-center gap-2.5", className)}
      href="/"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-8 place-items-center rounded-[0.5rem] text-[0.8125rem] font-bold tracking-[-0.03em]",
          tone === "inverse" ? "text-brand-ink bg-white" : "bg-brand-accent text-white",
        )}
      >
        LL
      </span>
      <span
        className={cn(
          "brand-title text-[1.125rem]",
          tone === "inverse" ? "text-white" : "text-brand-ink",
        )}
      >
        LoomLogic
      </span>
    </Link>
  );
}
