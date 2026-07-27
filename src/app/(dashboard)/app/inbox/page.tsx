import { ArrowRight, Tray } from "@phosphor-icons/react/dist/ssr";
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
  title: "Inbox",
};

const pageSize = 20;
const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "waiting", label: "Waiting" },
  { value: "resolved", label: "Resolved" },
] as const;

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const parameters = await searchParams;
  const page = Math.max(1, Number.parseInt(parameters.page ?? "1", 10) || 1);
  const { actor, queries } = await createRecoveryRequestContext();
  const result = await queries.listConversations({
    organizationId: actor.organizationId,
    page,
    pageSize,
    ...(parameters.status ? { status: parameters.status } : {}),
  });

  return (
    <div>
      <PageHeader
        description="Calls, approved mock messages, and Recovery ownership in one tenant-scoped work queue."
        title="Inbox"
      />
      <div className="mt-6">
        <DemoNotice />
      </div>
      <FilterBar
        {...(parameters.status ? { status: parameters.status } : {})}
        showQuery={false}
        statuses={statusOptions}
      />

      {result.items.length ? (
        <>
          <div className="mt-6 overflow-hidden rounded-[var(--radius-panel)] border">
            <ul className="divide-y">
              {result.items.map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    className="hover:bg-surface focus-visible:bg-surface grid gap-4 px-4 py-5 outline-none sm:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_auto] sm:items-center"
                    href={`/app/inbox/${conversation.id}`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">
                          {conversation.contact.display_name}
                        </span>
                        <StatusBadge status={conversation.status} />
                      </div>
                      <p className="mt-2 text-sm font-medium">{conversation.subject}</p>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-5">
                        {conversation.summary ?? "No conversation summary is available."}
                      </p>
                    </div>
                    <div>
                      {conversation.recoveryCase ? (
                        <>
                          <p className="text-primary text-xs font-semibold">
                            {conversation.recoveryCase.reference}
                          </p>
                          <p className="mt-1 text-sm font-semibold tabular-nums">
                            {formatCurrencyMinor(
                              conversation.recoveryCase.estimated_value_minor,
                              conversation.recoveryCase.currency_code,
                              actor.locale,
                            )}
                          </p>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-xs">No Recovery Case</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <time
                        className="text-muted-foreground text-xs tabular-nums"
                        dateTime={conversation.last_activity_at}
                      >
                        {formatDateTime(
                          conversation.last_activity_at,
                          actor.locale,
                          actor.timeZone,
                        )}
                      </time>
                      <ArrowRight aria-hidden="true" className="text-primary" size={17} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Pagination
            basePath="/app/inbox"
            page={page}
            pageSize={pageSize}
            searchParams={{ status: parameters.status }}
            total={result.total}
          />
        </>
      ) : (
        <EmptyState
          description={
            parameters.status && parameters.status !== "all"
              ? "No conversations match this status."
              : "A signed development missed-call fixture creates the first conversation."
          }
          icon={Tray}
          title={
            parameters.status && parameters.status !== "all"
              ? "No matching conversations"
              : "Inbox is clear"
          }
        />
      )}
    </div>
  );
}
