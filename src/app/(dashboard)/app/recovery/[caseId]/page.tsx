import {
  ArrowLeft,
  CalendarCheck,
  ChatCircleText,
  ClockCounterClockwise,
  PhoneIncoming,
  ShieldCheck,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { DemoNotice } from "@/components/shared/demo-notice";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ApprovalForm } from "@/modules/recovery/components/approval-form";
import { AssignCaseForm } from "@/modules/recovery/components/assign-case-form";
import { FollowUpComposer } from "@/modules/recovery/components/follow-up-composer";
import { MarkBookedForm } from "@/modules/recovery/components/mark-booked-form";
import {
  formatCurrencyMinor,
  formatDateTime,
} from "@/modules/recovery/presentation/formatters";
import { createRecoveryRequestContext } from "@/modules/recovery/runtime";

export const metadata: Metadata = {
  title: "Recovery Case",
};

const resolvedStatuses = new Set([
  "booked",
  "recovered",
  "disqualified",
  "opted_out",
  "lost",
  "closed",
]);

const mutationRoles = new Set([
  "org:owner",
  "org:admin",
  "org:manager",
  "org:member",
  "owner",
  "admin",
  "manager",
  "member",
]);
const approvalRoles = new Set([
  "org:owner",
  "org:admin",
  "org:manager",
  "owner",
  "admin",
  "manager",
]);

export default async function RecoveryCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const { actor, queries, tenant } = await createRecoveryRequestContext();
  const detail = await queries.getRecoveryCaseDetail(actor.organizationId, caseId);
  const contact = detail.contact;
  const conversation = detail.conversation;
  if (!contact || !conversation) {
    throw new Error("Recovery Case relationships are incomplete.");
  }
  const primaryPhone = detail.channels.find(
    (channel) => channel.type === "phone" && channel.is_primary,
  );
  const canMutate = mutationRoles.has(tenant.organizationRole ?? "");
  const canApprove = approvalRoles.has(tenant.organizationRole ?? "");
  const pendingApprovals = detail.approvals.filter((approval) =>
    ["pending", "approved", "failed"].includes(approval.status),
  );
  const sentMessageExists = detail.messages.some((message) => message.status === "sent");

  return (
    <div>
      <Link
        className="text-muted-foreground hover:text-foreground mb-5 inline-flex items-center gap-2 text-sm font-medium"
        href="/app/recovery"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Recovery queue
      </Link>
      <PageHeader
        action={<StatusBadge status={detail.recoveryCase.status} />}
        description={`${detail.recoveryCase.reference}: ${detail.recoveryCase.reason}`}
        title={contact.display_name}
      />

      {detail.recoveryCase.is_demo ? (
        <div className="mt-6">
          <DemoNotice>
            This Recovery Case is synthetic demo data. The messaging adapter cannot
            contact a real phone number.
          </DemoNotice>
        </div>
      ) : null}

      <dl className="mt-8 grid gap-5 border-y py-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-muted-foreground text-xs font-medium">Value at risk</dt>
          <dd className="mt-1.5 text-lg font-semibold tabular-nums">
            {formatCurrencyMinor(
              detail.recoveryCase.estimated_value_minor,
              detail.recoveryCase.currency_code,
              actor.locale,
            )}
          </dd>
          <p className="text-muted-foreground mt-1 text-xs capitalize">
            {detail.recoveryCase.attribution_level} attribution
          </p>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium">Next action</dt>
          <dd className="mt-1.5 text-sm font-semibold capitalize">
            {detail.recoveryCase.next_action_type?.replaceAll("_", " ") ??
              "Outcome recorded"}
          </dd>
          {detail.recoveryCase.next_action_due_at ? (
            <p className="text-muted-foreground mt-1 text-xs tabular-nums">
              {formatDateTime(
                detail.recoveryCase.next_action_due_at,
                actor.locale,
                actor.timeZone,
              )}
            </p>
          ) : null}
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium">Owner</dt>
          <dd className="mt-1.5 text-sm font-semibold">
            {detail.recoveryCase.assigned_member_id ? "Assigned" : "Unassigned"}
          </dd>
          {!detail.recoveryCase.assigned_member_id && canMutate ? (
            <div className="mt-2">
              <AssignCaseForm recoveryCaseId={detail.recoveryCase.id} />
            </div>
          ) : null}
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium">Opened</dt>
          <dd className="mt-1.5 text-sm font-semibold tabular-nums">
            {formatDateTime(detail.recoveryCase.opened_at, actor.locale, actor.timeZone)}
          </dd>
          <p className="text-muted-foreground mt-1 text-xs capitalize">
            {detail.recoveryCase.urgency} urgency
          </p>
        </div>
      </dl>

      <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="customer-objective">
            <div className="flex items-center gap-3">
              <UserCircle
                aria-hidden="true"
                className="text-primary"
                size={22}
                weight="duotone"
              />
              <h2 className="text-base font-semibold" id="customer-objective">
                Customer objective
              </h2>
            </div>
            <div className="mt-5 rounded-[var(--radius-panel)] border p-5">
              <p className="text-sm font-semibold">{conversation.subject}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {conversation.summary}
              </p>
              <dl className="mt-5 grid gap-4 border-t pt-4 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Phone channel</dt>
                  <dd className="mt-1 font-medium">
                    {primaryPhone?.display_value ?? "No phone channel"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Consent</dt>
                  <dd className="mt-1 font-medium capitalize">
                    {primaryPhone?.consent_status ?? contact.consent_status}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="text-primary text-sm font-semibold hover:underline"
                  href={`/app/inbox/${conversation.id}`}
                >
                  Open conversation
                </Link>
                <Link
                  className="text-primary text-sm font-semibold hover:underline"
                  href={`/app/contacts/${contact.id}`}
                >
                  Open contact
                </Link>
              </div>
            </div>
          </section>

          <section aria-labelledby="case-history">
            <div className="flex items-center gap-3">
              <ClockCounterClockwise
                aria-hidden="true"
                className="text-primary"
                size={22}
                weight="duotone"
              />
              <h2 className="text-base font-semibold" id="case-history">
                Case history
              </h2>
            </div>
            <ol className="mt-5 border-t">
              {detail.events.map((event) => (
                <li
                  className="grid gap-2 border-b py-5 sm:grid-cols-[1.75rem_minmax(0,1fr)_auto]"
                  key={event.id}
                >
                  <span className="bg-surface-strong text-primary grid size-7 place-items-center rounded-full">
                    <ClockCounterClockwise aria-hidden="true" size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {event.event_type.replaceAll("_", " ")}
                    </p>
                  </div>
                  <time
                    className="text-muted-foreground text-xs tabular-nums"
                    dateTime={event.occurred_at}
                  >
                    {formatDateTime(event.occurred_at, actor.locale, actor.timeZone)}
                  </time>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="audit-trail">
            <div className="flex items-center gap-3">
              <ShieldCheck
                aria-hidden="true"
                className="text-primary"
                size={22}
                weight="duotone"
              />
              <h2 className="text-base font-semibold" id="audit-trail">
                Audit trail
              </h2>
            </div>
            {detail.audits.length ? (
              <ul className="mt-5 space-y-3">
                {detail.audits.map((audit) => (
                  <li
                    className="bg-surface rounded-[var(--radius-control)] px-4 py-3 text-sm"
                    key={audit.id}
                  >
                    <p className="font-medium">{audit.action.replaceAll("_", " ")}</p>
                    <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                      {formatDateTime(audit.created_at, actor.locale, actor.timeZone)}
                      {" / "}
                      {audit.request_id}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-5 text-sm">
                No audit entries are visible for this case yet.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-5" aria-label="Recovery actions">
          {resolvedStatuses.has(detail.recoveryCase.status) ? (
            <section className="bg-success/8 rounded-[var(--radius-panel)] p-5">
              <div className="flex items-center gap-3">
                <CalendarCheck
                  aria-hidden="true"
                  className="text-success"
                  size={21}
                  weight="duotone"
                />
                <h2 className="font-semibold">Outcome recorded</h2>
              </div>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                This case is {detail.recoveryCase.status.replaceAll("_", " ")}. Its
                current attribution is {detail.recoveryCase.attribution_level}.
              </p>
            </section>
          ) : null}

          {pendingApprovals.map((approval) => {
            const message = detail.messages.find(
              (item) => item.id === approval.message_id,
            );
            if (!message) return null;

            return (
              <section
                className="rounded-[var(--radius-panel)] border p-5"
                key={approval.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">Review follow-up</h2>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Recipient and content must be reviewed before execution.
                    </p>
                  </div>
                  <StatusBadge status={approval.status} />
                </div>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs">Recipient</dt>
                    <dd className="mt-1 font-medium">{message.recipient}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Message</dt>
                    <dd className="bg-surface mt-1.5 rounded-[var(--radius-control)] p-3 leading-6">
                      {message.body}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Execution</dt>
                    <dd className="mt-1 font-medium">Local mock adapter only</dd>
                  </div>
                </dl>
                {canApprove ? (
                  <div className="mt-5">
                    <ApprovalForm approvalId={approval.id} />
                  </div>
                ) : (
                  <p className="text-warning mt-5 text-sm" role="status">
                    Manager approval is required.
                  </p>
                )}
              </section>
            );
          })}

          {!resolvedStatuses.has(detail.recoveryCase.status) &&
          pendingApprovals.length === 0 &&
          primaryPhone &&
          canMutate ? (
            <section className="rounded-[var(--radius-panel)] border p-5">
              <div className="flex items-center gap-3">
                <ChatCircleText
                  aria-hidden="true"
                  className="text-primary"
                  size={21}
                  weight="duotone"
                />
                <h2 className="font-semibold">Draft follow-up</h2>
              </div>
              <FollowUpComposer
                contactName={contact.first_name ?? contact.display_name}
                recipient={primaryPhone.normalized_value}
                recoveryCaseId={detail.recoveryCase.id}
              />
            </section>
          ) : null}

          {!resolvedStatuses.has(detail.recoveryCase.status) &&
          sentMessageExists &&
          canMutate ? (
            <section className="bg-surface rounded-[var(--radius-panel)] p-5">
              <div className="flex items-center gap-3">
                <PhoneIncoming
                  aria-hidden="true"
                  className="text-primary"
                  size={21}
                  weight="duotone"
                />
                <h2 className="font-semibold">Confirm the outcome</h2>
              </div>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Use this only after the customer&apos;s booking is known. It upgrades the
                attribution from estimated to confirmed.
              </p>
              <div className="mt-4">
                <MarkBookedForm recoveryCaseId={detail.recoveryCase.id} />
              </div>
            </section>
          ) : null}

          {!canMutate && !resolvedStatuses.has(detail.recoveryCase.status) ? (
            <section className="bg-surface rounded-[var(--radius-panel)] p-5">
              <h2 className="font-semibold">Read-only access</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Your workspace role can inspect this case but cannot change it.
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
