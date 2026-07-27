import { Flask } from "@phosphor-icons/react/dist/ssr";

export function DemoNotice({
  children = "This workspace contains synthetic demo records. No live provider or real customer is connected.",
}: {
  children?: string;
}) {
  return (
    <div
      className="bg-primary/6 text-foreground flex items-start gap-3 rounded-[var(--radius-panel)] px-4 py-3 text-sm leading-5"
      role="note"
    >
      <Flask aria-hidden="true" className="text-primary mt-0.5 shrink-0" size={17} />
      <span>{children}</span>
    </div>
  );
}
