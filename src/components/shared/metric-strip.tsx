import type { ReactNode } from "react";

export type MetricItem = {
  label: string;
  value: ReactNode;
  detail: string;
};

export function MetricStrip({ items }: { items: readonly MetricItem[] }) {
  return (
    <dl className="mt-8 grid border-y sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <div
          className="border-b px-0 py-5 first:pl-0 last:border-r-0 sm:px-5 xl:border-r xl:border-b-0"
          key={item.label}
        >
          <dt className="text-muted-foreground text-xs font-medium">{item.label}</dt>
          <dd className="mt-2 text-2xl font-semibold tracking-[-0.025em] tabular-nums">
            {item.value}
          </dd>
          <p className="text-muted-foreground mt-1 text-xs leading-5">{item.detail}</p>
        </div>
      ))}
    </dl>
  );
}
