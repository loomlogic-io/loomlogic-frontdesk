import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utilities/cn";

/**
 * Editorial container system for the public page.
 *
 * `width` varies deliberately so sections do not all sit inside one centred
 * rectangle: prose stays narrow, product visualisations run wider, and banded
 * sections carry their own background.
 */
type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
  width?: "prose" | "standard" | "wide";
  band?: "none" | "sunken" | "ink";
  labelledBy?: string;
};

const widths = {
  prose: "max-w-3xl",
  standard: "max-w-6xl",
  wide: "max-w-[86rem]",
} as const;

const bands = {
  none: "",
  sunken: "bg-brand-canvas-sunken",
  ink: "bg-brand-ink text-white",
} as const;

export function Section({
  as: Component = "section",
  band = "none",
  children,
  className,
  id,
  labelledBy,
  width = "standard",
}: SectionProps) {
  return (
    <Component
      className={cn("px-5 sm:px-8", bands[band], className)}
      {...(id ? { id } : {})}
      {...(labelledBy ? { "aria-labelledby": labelledBy } : {})}
    >
      <div className={cn("mx-auto w-full", widths[width])}>{children}</div>
    </Component>
  );
}

export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "inverse";
}) {
  return (
    <p
      className={cn(
        "text-[0.8125rem] leading-5 font-semibold tracking-[0.01em]",
        tone === "accent" ? "text-brand-accent" : "text-white/70",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  align = "start",
  children,
  className,
  id,
  level = 2,
  support,
  tone = "ink",
}: {
  align?: "start" | "center";
  children: ReactNode;
  className?: string;
  id?: string;
  level?: 2 | 3;
  support?: ReactNode;
  tone?: "ink" | "inverse";
}) {
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Heading
        className={cn(
          "text-balance",
          level === 2
            ? "text-[1.75rem] leading-[1.15] sm:text-[2.125rem]"
            : "text-xl leading-tight",
          tone === "inverse" ? "text-white" : "text-brand-ink",
        )}
        {...(id ? { id } : {})}
      >
        {children}
      </Heading>
      {support ? (
        <p
          className={cn(
            "mt-4 max-w-[58ch] text-[1.0625rem] leading-7 text-pretty",
            align === "center" && "mx-auto",
            tone === "inverse" ? "text-white/70" : "text-brand-ink-secondary",
          )}
        >
          {support}
        </p>
      ) : null}
    </div>
  );
}
