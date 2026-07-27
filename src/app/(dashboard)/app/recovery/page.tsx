import { Lifebuoy } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { DemoNotice } from "@/components/shared/demo-notice";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatCurrencyMinor,
  formatDateTime,
} from "@/modules/recovery/presentation/formatters";
import { createRecoveryRequestContext } from "@/modules/recovery/runtime";

export const metadata: Metadata = {
  title: "Recovery",
};

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "awaiting_staff", label: "Awaiting staff" },
  { value: "awaiting_customer", label: "Awaiting customer" },
  { value: "engaging", label: "Engaging" },
  { value: "booked", label: "Booked" },
  { value: "recovered", label: "Recovered" },
] as const;

export default async function RecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const parameters = await searchParams;
  const page = Math.max(1, Number.parseInt(parameters.page ?? "1", 10) || 1);
  const { actor, queries } = await createRecoveryRequestContext();
  const result = await queries.listRecoveryCases({
    organizationId: actor.organizationId,
    page,
    pageSize: 20,
    ...(parameters.q ? { query: parameters.q } : {}),
    ...(parameters.status ? { status: parameters.status } : {}),
  });

  return (
    <div>
      <PageHeader
        description="Prioritize unresolved customer outcomes by urgency, due action, and value at risk."
        title="Recovery"
      />
      <div className="mt-6">
        <DemoNotice />
      </div>
      <FilterBar
        {...(parameters.q ? { query: parameters.q } : {})}
        {...(parameters.status ? { status: parameters.status } : {})}
        statuses={statusOptions}
      />

      {result.items.length ? (
        <>
          <div className="mt-6 hidden overflow-x-auto rounded-[var(--radius-panel)] border md:block">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-surface text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium" scope="col">
                    Contact and reason
                  </th>
                  <th className="px-4 py-3 font-medium" scope="col">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium" scope="col">
                    Value at risk
                  </th>
                  <th className="px-4 py-3 font-medium" scope="col">
                    Next action
                  </th>
                  <th className="px-4 py-3 font-medium" scope="col">
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr className="border-t align-top" key={item.id}>
                    <td className="px-4 py-4">
                      <Link
                        className="hover:text-primary font-semibold"
                        href={`/app/recovery/${item.id}`}
                      >
                        {item.contact.display_name}
                      </Link>
                      <p className="text-muted-foreground mt-1 max-w-md text-xs leading-5">
                        {item.reason}
                      </p>
                      <p className="text-primary mt-1.5 text-xs font-medium">
                        {item.reference}
                        {item.is_demo ? " / Demo" : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                      <p className="text-muted-foreground mt-2 text-xs capitalize">
                        {item.urgency} urgency
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold tabular-nums">
                      {formatCurrencyMinor(
                        item.estimated_value_minor,
                        item.currency_code,
                        actor.locale,
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {item.next_action_type?.replaceAll("_", " ") ??
                          "Outcome recorded"}
                      </p>
                      {item.next_action_due_at ? (
                        <time
                          className="text-muted-foreground mt-1 block text-xs tabular-nums"
                          dateTime={item.next_action_due_at}
                        >
                          {formatDateTime(
                            item.next_action_due_at,
                            actor.locale,
                            actor.timeZone,
                          )}
                        </time>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      {item.assigned_member_id ? "Assigned" : "Unassigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {result.items.map((item) => (
              <article className="rounded-[var(--radius-panel)] border p-4" key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      className="hover:text-primary font-semibold"
                      href={`/app/recovery/${item.id}`}
                    >
                      {item.contact.display_name}
                    </Link>
                    <p className="text-primary mt-1 text-xs font-medium">
                      {item.reference}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  {item.reason}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Value at risk</dt>
                    <dd className="mt-1 font-semibold tabular-nums">
                      {formatCurrencyMinor(
                        item.estimated_value_minor,
                        item.currency_code,
                        actor.locale,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Next action</dt>
                    <dd className="mt-1 font-medium">
                      {item.next_action_type?.replaceAll("_", " ") ?? "Complete"}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <Pagination
            basePath="/app/recovery"
            page={result.page}
            pageSize={result.pageSize}
            searchParams={{ q: parameters.q, status: parameters.status }}
            total={result.total}
          />
        </>
      ) : (
        <EmptyState
          description={
            parameters.q || (parameters.status && parameters.status !== "all")
              ? "No Recovery Cases match these filters. Clear or change the filters."
              : "Send a signed development missed-call fixture to create the first Recovery Case."
          }
          icon={Lifebuoy}
          title={
            parameters.q || (parameters.status && parameters.status !== "all")
              ? "No matching Recovery Cases"
              : "No Recovery Cases yet"
          }
        />
      )}
    </div>
  );
}
