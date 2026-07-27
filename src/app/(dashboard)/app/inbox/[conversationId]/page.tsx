import { ArrowLeft, ChatCircleText, PhoneIncoming } from "@phosphor-icons/react/dist/ssr";
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
  title: "Conversation",
};

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const { actor, queries } = await createRecoveryRequestContext();
  const detail = await queries.getConversationDetail(
    actor.organizationId,
    conversationId,
  );
  const contact = detail.contact;
  if (!contact) {
    throw new Error("Conversation contact is unavailable.");
  }

  return (
    <div>
      <Link
        className="text-muted-foreground hover:text-foreground mb-5 inline-flex items-center gap-2 text-sm font-medium"
        href="/app/inbox"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Inbox
      </Link>
      <PageHeader
        action={<StatusBadge status={detail.conversation.status} />}
        description={`${contact.display_name} / ${detail.conversation.primary_channel} conversation`}
        title={detail.conversation.subject}
      />

      {detail.conversation.is_demo ? (
        <div className="mt-6">
          <DemoNotice>
            This conversation, its calls, and its messages are synthetic demo records.
          </DemoNotice>
        </div>
      ) : null}

      <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <div className="space-y-10">
          <section aria-labelledby="conversation-summary">
            <div className="flex items-center gap-3">
              <ChatCircleText aria-hidden="true" className="text-primary" size={22} />
              <h2 className="font-semibold" id="conversation-summary">
                Conversation
              </h2>
            </div>
            <div className="mt-5 rounded-[var(--radius-panel)] border p-5">
              <p className="text-sm leading-6">
                {detail.conversation.summary ?? "No summary is available."}
              </p>
              <p className="text-muted-foreground mt-4 text-xs tabular-nums">
                Last activity{" "}
                {formatDateTime(
                  detail.conversation.last_activity_at,
                  actor.locale,
                  actor.timeZone,
                )}
              </p>
            </div>
          </section>

          <section aria-labelledby="call-records">
            <div className="flex items-center gap-3">
              <PhoneIncoming aria-hidden="true" className="text-primary" size={22} />
              <h2 className="font-semibold" id="call-records">
                Call detail
              </h2>
            </div>
            {detail.calls.length ? (
              <ul className="mt-5 space-y-4">
                {detail.calls.map((call) => (
                  <li className="rounded-[var(--radius-panel)] border p-5" key={call.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold capitalize">
                          {call.direction} {call.status} call
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                          {formatDateTime(call.started_at, actor.locale, actor.timeZone)}
                        </p>
                      </div>
                      <StatusBadge status={call.disposition ?? call.status} />
                    </div>
                    <dl className="mt-5 grid gap-4 border-t pt-4 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground text-xs">From</dt>
                        <dd className="mt-1 font-medium">{call.from_number}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground text-xs">To</dt>
                        <dd className="mt-1 font-medium">{call.to_number}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground text-xs">Routing outcome</dt>
                        <dd className="mt-1 font-medium capitalize">
                          {call.routing_outcome?.replaceAll("_", " ") ?? "Not recorded"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground text-xs">
                          Recording consent
                        </dt>
                        <dd className="mt-1 font-medium capitalize">
                          {call.recording_consent_state}
                        </dd>
                      </div>
                    </dl>
                    {call.summary ? (
                      <p className="bg-surface mt-4 rounded-[var(--radius-control)] p-3 text-sm leading-6">
                        {call.summary}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                description="This conversation has no call records."
                icon={PhoneIncoming}
                title="No calls"
              />
            )}
          </section>

          <section aria-labelledby="message-records">
            <h2 className="font-semibold" id="message-records">
              Approved mock messages
            </h2>
            {detail.messages.length ? (
              <ol className="mt-5 space-y-4">
                {detail.messages.map((message) => (
                  <li
                    className="ml-auto max-w-xl rounded-[var(--radius-panel)] border p-5"
                    key={message.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs font-semibold capitalize">
                        {message.direction} / {message.channel}
                      </p>
                      <StatusBadge status={message.status} />
                    </div>
                    <p className="mt-4 text-sm leading-6">{message.body}</p>
                    <p className="text-muted-foreground mt-3 text-xs tabular-nums">
                      {formatDateTime(
                        message.sent_at ?? message.created_at,
                        actor.locale,
                        actor.timeZone,
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground mt-5 text-sm">
                No approved mock messages have been sent.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-5" aria-label="Conversation context">
          <section className="bg-surface rounded-[var(--radius-panel)] p-5">
            <h2 className="font-semibold">Contact</h2>
            <Link
              className="text-primary mt-3 inline-flex font-semibold hover:underline"
              href={`/app/contacts/${contact.id}`}
            >
              {contact.display_name}
            </Link>
            <p className="text-muted-foreground mt-2 text-xs capitalize">
              {contact.consent_status} consent
            </p>
          </section>

          {detail.cases.map((recoveryCase) => (
            <section
              className="rounded-[var(--radius-panel)] border p-5"
              key={recoveryCase.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-primary text-xs font-semibold">
                    {recoveryCase.reference}
                  </p>
                  <h2 className="mt-1.5 font-semibold">Recovery Case</h2>
                </div>
                <StatusBadge status={recoveryCase.status} />
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                {recoveryCase.reason}
              </p>
              <p className="mt-4 text-lg font-semibold tabular-nums">
                {formatCurrencyMinor(
                  recoveryCase.estimated_value_minor,
                  recoveryCase.currency_code,
                  actor.locale,
                )}
              </p>
              <Link
                className="text-primary mt-4 inline-flex text-sm font-semibold hover:underline"
                href={`/app/recovery/${recoveryCase.id}`}
              >
                Open Recovery Case
              </Link>
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}
