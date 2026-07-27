import {
  ArrowLeft,
  ChatCircleText,
  Phone,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { DemoNotice } from "@/components/shared/demo-notice";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatCurrencyMinor,
  formatDateTime,
} from "@/modules/recovery/presentation/formatters";
import { createRecoveryRequestContext } from "@/modules/recovery/runtime";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  const { actor, queries } = await createRecoveryRequestContext();
  const detail = await queries.getContactDetail(actor.organizationId, contactId);

  return (
    <div>
      <Link
        className="text-muted-foreground hover:text-foreground mb-5 inline-flex items-center gap-2 text-sm font-medium"
        href="/app/contacts"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Contacts
      </Link>
      <PageHeader
        action={<StatusBadge status={detail.contact.lifecycle_status} />}
        description="Identity, consent, conversation history, and Recovery outcomes within the active workspace."
        title={detail.contact.display_name}
      />

      {detail.contact.is_demo ? (
        <div className="mt-6">
          <DemoNotice>
            This contact is synthetic demo data using a fictional 555 phone number.
          </DemoNotice>
        </div>
      ) : null}

      <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <div className="space-y-8">
          <section aria-labelledby="contact-details">
            <div className="flex items-center gap-3">
              <Phone aria-hidden="true" className="text-primary" size={21} />
              <h2 className="font-semibold" id="contact-details">
                Contact details
              </h2>
            </div>
            <dl className="mt-5 divide-y rounded-[var(--radius-panel)] border px-5">
              {detail.channels.map((channel) => (
                <div className="py-4" key={channel.id}>
                  <dt className="text-muted-foreground text-xs capitalize">
                    {channel.type}
                    {channel.is_primary ? " / Primary" : ""}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold">
                    {channel.display_value}
                  </dd>
                  <p className="text-muted-foreground mt-1 text-xs capitalize">
                    {channel.is_verified ? "Verified" : "Unverified"} /{" "}
                    {channel.consent_status} consent
                  </p>
                </div>
              ))}
              <div className="py-4">
                <dt className="text-muted-foreground text-xs">Preferences</dt>
                <dd className="mt-1.5 text-sm font-medium">
                  {detail.contact.preferred_language.toUpperCase()} /{" "}
                  {detail.contact.time_zone ?? "Workspace time zone"}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="contact-governance">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="text-primary" size={21} />
              <h2 className="font-semibold" id="contact-governance">
                Data governance
              </h2>
            </div>
            <dl className="bg-surface mt-5 space-y-4 rounded-[var(--radius-panel)] p-5 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Contact consent</dt>
                <dd className="mt-1 font-medium capitalize">
                  {detail.contact.consent_status}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Record created</dt>
                <dd className="mt-1 font-medium tabular-nums">
                  {formatDateTime(
                    detail.contact.created_at,
                    actor.locale,
                    actor.timeZone,
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-10">
          <section aria-labelledby="contact-recovery">
            <h2 className="font-semibold" id="contact-recovery">
              Recovery Cases
            </h2>
            {detail.cases.length ? (
              <ul className="mt-5 divide-y border-y">
                {detail.cases.map((recoveryCase) => (
                  <li key={recoveryCase.id}>
                    <Link
                      className="hover:bg-surface grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-3"
                      href={`/app/recovery/${recoveryCase.id}`}
                    >
                      <div>
                        <p className="text-primary text-xs font-semibold">
                          {recoveryCase.reference}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold">
                          {recoveryCase.reason}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                          {formatDateTime(
                            recoveryCase.opened_at,
                            actor.locale,
                            actor.timeZone,
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <StatusBadge status={recoveryCase.status} />
                        <span className="text-sm font-semibold tabular-nums">
                          {formatCurrencyMinor(
                            recoveryCase.estimated_value_minor,
                            recoveryCase.currency_code,
                            actor.locale,
                          )}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                description="This contact has no Recovery Case in the active workspace."
                icon={Phone}
                title="No Recovery history"
              />
            )}
          </section>

          <section aria-labelledby="contact-conversations">
            <div className="flex items-center gap-3">
              <ChatCircleText aria-hidden="true" className="text-primary" size={21} />
              <h2 className="font-semibold" id="contact-conversations">
                Conversations
              </h2>
            </div>
            {detail.conversations.length ? (
              <ul className="mt-5 divide-y rounded-[var(--radius-panel)] border px-5">
                {detail.conversations.map((conversation) => (
                  <li className="py-4" key={conversation.id}>
                    <Link
                      className="hover:text-primary font-semibold"
                      href={`/app/inbox/${conversation.id}`}
                    >
                      {conversation.subject}
                    </Link>
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                      {conversation.summary ?? "No summary is available."}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs tabular-nums">
                      {formatDateTime(
                        conversation.last_activity_at,
                        actor.locale,
                        actor.timeZone,
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
