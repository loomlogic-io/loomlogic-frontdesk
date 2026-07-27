import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
};

export function PageHeader({ action, description, eyebrow, title }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-primary mb-2 text-xs font-semibold">{eyebrow}</p>}
        <h1 className="text-foreground text-2xl font-semibold tracking-[-0.025em] text-balance sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-[68ch] text-sm leading-6 text-pretty">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}
