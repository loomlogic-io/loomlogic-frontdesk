import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";

export function FilterBar({
  query,
  status,
  statuses,
  showQuery = true,
}: {
  query?: string;
  status?: string;
  statuses?: readonly { value: string; label: string }[];
  showQuery?: boolean;
}) {
  return (
    <form
      className="bg-surface mt-6 flex flex-col gap-3 rounded-[var(--radius-panel)] p-3 sm:flex-row sm:items-end"
      method="get"
    >
      {showQuery ? (
        <label className="min-w-0 flex-1">
          <span className="text-muted-foreground mb-1.5 block text-xs font-medium">
            Search
          </span>
          <span className="bg-background flex min-h-10 items-center gap-2 rounded-[var(--radius-control)] border px-3">
            <MagnifyingGlass
              aria-hidden="true"
              className="text-muted-foreground"
              size={16}
            />
            <input
              className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
              defaultValue={query}
              name="q"
              placeholder="Name, reason, or reference"
              type="search"
            />
          </span>
        </label>
      ) : null}
      {statuses ? (
        <label className="sm:w-48">
          <span className="text-muted-foreground mb-1.5 block text-xs font-medium">
            Status
          </span>
          <span className="bg-background flex min-h-10 items-center gap-2 rounded-[var(--radius-control)] border px-3">
            <FunnelSimple
              aria-hidden="true"
              className="text-muted-foreground"
              size={16}
            />
            <select
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              defaultValue={status ?? "all"}
              name="status"
            >
              {statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </label>
      ) : null}
      <Button size="sm" type="submit" variant="secondary">
        Apply
      </Button>
    </form>
  );
}
