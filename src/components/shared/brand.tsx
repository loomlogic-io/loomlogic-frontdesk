import Link from "next/link";

import { cn } from "@/lib/utilities/cn";

type BrandProps = {
  compact?: boolean;
  className?: string;
};

export function Brand({ className, compact = false }: BrandProps) {
  return (
    <Link
      aria-label="LoomLogic Resolve home"
      className={cn(
        "group inline-flex items-center gap-3 rounded-md font-semibold",
        className,
      )}
      href="/"
    >
      <span
        aria-hidden="true"
        className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-[0.6rem] text-sm font-bold tracking-[-0.03em] transition-transform duration-150 group-active:translate-y-px"
      >
        LL
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[0.9375rem] tracking-[-0.02em]">LoomLogic</span>
          <span className="text-muted-foreground mt-1 text-[0.6875rem] font-medium tracking-[0.04em]">
            Resolve
          </span>
        </span>
      )}
    </Link>
  );
}
