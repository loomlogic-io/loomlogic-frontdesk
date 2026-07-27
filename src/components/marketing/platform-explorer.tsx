"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "@/lib/utilities/cn";

/*
 * Product modules drawn from the repository's documented domain. Items marked
 * `planned` are on the roadmap in docs/07_BUILD_ROADMAP.md and are labelled as
 * such rather than presented as shipped.
 */
const modules = [
  {
    id: "inbox",
    name: "Unified Inbox",
    status: "available",
    summary:
      "Calls, follow-ups, and recovery ownership in one tenant-scoped queue, filtered by status and assignee.",
    detail: [
      ["Contact", "Dana Whitfield"],
      ["Channel", "Phone · missed"],
      ["Next action", "Approve follow-up"],
      ["Value at risk", "$280"],
    ],
  },
  {
    id: "recovery",
    name: "Recovery Cases",
    status: "available",
    summary:
      "A durable record of the unresolved outcome, with state, urgency, ownership, due action, and full history.",
    detail: [
      ["Reference", "RC-8F42D1"],
      ["Status", "Engaging"],
      ["Urgency", "High"],
      ["Opened", "Today, 4:12 PM"],
    ],
  },
  {
    id: "contacts",
    name: "Contacts & conversations",
    status: "available",
    summary:
      "Identity, channels, consent state, and a complete chronological timeline for every customer.",
    detail: [
      ["Primary channel", "+1 (416) 555-0148"],
      ["Consent", "Granted"],
      ["Open cases", "1"],
      ["Language", "EN"],
    ],
  },
  {
    id: "approval",
    name: "Follow-up & approval",
    status: "available",
    summary:
      "Every outbound message is drafted, reviewed, and explicitly approved by a manager before it is sent.",
    detail: [
      ["Action", "Send follow-up"],
      ["Recipient", "+1 (416) 555-0148"],
      ["Requires approval", "Yes"],
      ["Approved by", "Service manager"],
    ],
  },
  {
    id: "revenue",
    name: "Recovered revenue",
    status: "available",
    summary:
      "Estimated, confirmed, and verified attribution levels, counted once per case at the highest level reached.",
    detail: [
      ["Estimated", "$280"],
      ["Confirmed", "$280"],
      ["Verified", "Requires connected system"],
      ["Counted once", "Highest level"],
    ],
  },
  {
    id: "promises",
    name: "Promise tracking",
    status: "planned",
    summary:
      "Callbacks, quotes, and commitments with owners, deadlines, and escalation when a promise is missed.",
    detail: [
      ["Promise", "Return call with quote"],
      ["Owner", "Assigned advisor"],
      ["Due", "Tomorrow, 10:00 AM"],
      ["Escalation", "On overdue"],
    ],
  },
  {
    id: "copilot",
    name: "Operations copilot",
    status: "planned",
    summary:
      "An assistant that reads tenant-authorized context and proposes typed actions that a person approves.",
    detail: [
      ["Mode", "Read and draft"],
      ["Mutations", "Approval required"],
      ["Database access", "None direct"],
      ["Audit", "Every action recorded"],
    ],
  },
] as const;

export function PlatformExplorer() {
  const [activeId, setActiveId] = useState<string>(modules[0].id);
  const baseId = useId();
  const listRef = useRef<HTMLDivElement | null>(null);
  const active = modules.find((item) => item.id === activeId) ?? modules[0];

  /*
   * Roving tabindex means only the selected tab is reachable by Tab, so the
   * list must implement arrow-key navigation itself or the other modules become
   * keyboard-inaccessible. Follows the WAI-ARIA tabs pattern.
   */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = modules.findIndex((item) => item.id === activeId);
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % modules.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + modules.length) % modules.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = modules.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();

    const next = modules[nextIndex]!;
    setActiveId(next.id);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-tab-${next.id}`)}`)
      ?.focus();
  };

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,16.5rem)_minmax(0,1fr)] lg:gap-12">
      <div
        aria-label="Platform modules"
        onKeyDown={onKeyDown}
        ref={listRef}
        className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
        role="tablist"
      >
        {modules.map((item) => {
          const selected = item.id === active.id;
          return (
            <button
              aria-controls={`${baseId}-panel`}
              aria-selected={selected}
              className={cn(
                "rounded-brand-button flex min-h-11 shrink-0 items-center gap-2 px-3.5 py-2.5 text-left text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-[var(--brand-duration-component)]",
                "lg:rounded-brand-control lg:px-4 lg:py-3 lg:whitespace-normal",
                selected
                  ? "bg-brand-accent-soft text-brand-accent lg:font-semibold"
                  : "text-brand-ink-secondary hover:text-brand-ink hover:bg-brand-canvas-sunken",
              )}
              id={`${baseId}-tab-${item.id}`}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {item.name}
              {item.status === "planned" ? (
                <span className="text-brand-ink-tertiary border-brand-line shrink-0 rounded-full border px-1.5 py-0.5 text-[0.6875rem] font-medium">
                  Planned
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/*
       * `self-start` stops the panel stretching to the tab column's height, and
       * the min-height keeps its size stable as the selected module changes.
       */}
      <div
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className="bg-brand-surface border-brand-line rounded-brand-surface shadow-brand-raised flex min-h-[21rem] flex-col self-start border p-6 sm:p-7"
        id={`${baseId}-panel`}
        role="tabpanel"
      >
        <h3 className="text-lg">{active.name}</h3>
        <p className="text-brand-ink-secondary mt-2 max-w-[52ch] text-[0.9375rem] leading-6">
          {active.summary}
        </p>
        <dl className="border-brand-line mt-6 grid gap-px border-t pt-6 sm:grid-cols-2">
          {active.detail.map(([term, value]) => (
            <div className="py-2.5" key={term}>
              <dt className="text-brand-ink-tertiary text-[0.8125rem] leading-5">
                {term}
              </dt>
              <dd className="brand-numeric mt-1 text-[0.9375rem] font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-brand-ink-tertiary border-brand-line mt-auto border-t pt-4 text-[0.8125rem] leading-5">
          Illustrative module preview with sample data.
          {active.status === "planned"
            ? " On the roadmap; not available in the current release."
            : ""}
        </p>
      </div>
    </div>
  );
}
