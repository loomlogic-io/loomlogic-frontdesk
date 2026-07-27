import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: Icon;
  title: string;
  description: string;
  action?: ReactNode;
  note?: string;
};

export function EmptyState({
  action,
  description,
  icon: EmptyIcon,
  note,
  title,
}: EmptyStateProps) {
  return (
    <section
      aria-labelledby="empty-state-title"
      className="mx-auto flex max-w-xl flex-col items-start py-16 sm:py-24"
    >
      <div className="bg-surface-strong text-primary mb-6 grid size-11 place-items-center rounded-[var(--radius-panel)]">
        <EmptyIcon aria-hidden="true" size={22} weight="duotone" />
      </div>
      <h2
        className="text-foreground text-xl font-semibold tracking-[-0.02em]"
        id="empty-state-title"
      >
        {title}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-[60ch] text-sm leading-6 text-pretty">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
      {note && (
        <p className="text-muted-foreground mt-8 border-t pt-4 text-xs leading-5">
          {note}
        </p>
      )}
    </section>
  );
}
