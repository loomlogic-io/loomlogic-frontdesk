import { AddressBook, ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { DemoNotice } from "@/components/shared/demo-notice";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { formatDateTime } from "@/modules/recovery/presentation/formatters";
import { createRecoveryRequestContext } from "@/modules/recovery/runtime";

export const metadata: Metadata = {
  title: "Contacts",
};

const pageSize = 20;

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const parameters = await searchParams;
  const page = Math.max(1, Number.parseInt(parameters.page ?? "1", 10) || 1);
  const { actor, queries } = await createRecoveryRequestContext();
  const result = await queries.listContacts({
    organizationId: actor.organizationId,
    page,
    pageSize,
    ...(parameters.q ? { query: parameters.q } : {}),
  });

  return (
    <div>
      <PageHeader
        description="Identity, communication preferences, consent, and Recovery history for the active workspace."
        title="Contacts"
      />
      <div className="mt-6">
        <DemoNotice />
      </div>
      <FilterBar {...(parameters.q ? { query: parameters.q } : {})} showQuery />

      {result.items.length ? (
        <>
          <div className="mt-6 overflow-hidden rounded-[var(--radius-panel)] border">
            <ul className="divide-y">
              {result.items.map((contact) => {
                const primaryChannel =
                  contact.contact_channels.find((channel) => channel.is_primary) ??
                  contact.contact_channels[0];

                return (
                  <li key={contact.id}>
                    <Link
                      className="hover:bg-surface focus-visible:bg-surface grid gap-4 px-4 py-5 outline-none sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto] sm:items-center"
                      href={`/app/contacts/${contact.id}`}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{contact.display_name}</span>
                          {contact.is_demo ? (
                            <span className="text-primary text-xs font-medium">Demo</span>
                          ) : null}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs capitalize">
                          {contact.lifecycle_status} contact /{" "}
                          {contact.preferred_language.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {primaryChannel?.display_value ?? "No contact channel"}
                        </p>
                        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs capitalize">
                          {primaryChannel?.is_verified ? (
                            <CheckCircle
                              aria-hidden="true"
                              className="text-success"
                              size={14}
                              weight="fill"
                            />
                          ) : null}
                          {primaryChannel?.type ?? "channel"} /{" "}
                          {primaryChannel?.consent_status ?? contact.consent_status}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <time
                          className="text-muted-foreground text-xs tabular-nums"
                          dateTime={contact.updated_at}
                        >
                          {formatDateTime(
                            contact.updated_at,
                            actor.locale,
                            actor.timeZone,
                          )}
                        </time>
                        <ArrowRight
                          aria-hidden="true"
                          className="text-primary"
                          size={17}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <Pagination
            basePath="/app/contacts"
            page={page}
            pageSize={pageSize}
            searchParams={{ q: parameters.q }}
            total={result.total}
          />
        </>
      ) : (
        <EmptyState
          description={
            parameters.q
              ? "No contacts match that name in this workspace."
              : "A signed development missed-call fixture creates the first demo contact."
          }
          icon={AddressBook}
          title={parameters.q ? "No matching contacts" : "No contacts yet"}
        />
      )}
    </div>
  );
}
