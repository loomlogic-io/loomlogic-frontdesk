import { ArrowRight, ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { DemoNotice } from "@/components/shared/demo-notice";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricStrip } from "@/components/shared/metric-strip";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { createRecoveryRequestContext } from "@/modules/recovery/runtime";
import {
  formatCurrencyMinor,
  formatDateTime,
} from "@/modules/recovery/presentation/formatters";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  const { actor, queries } = await createRecoveryRequestContext();
  const overview = await queries.getOverview(actor.organizationId);
  const recoveredValue =
    overview.recoveredValue.length === 0
      ? formatCurrencyMinor(0, actor.currencyCode, actor.locale)
      : overview.recoveredValue
          .map((item) =>
            formatCurrencyMinor(item.amountMinor, item.currencyCode, actor.locale),
          )
          .join(" + ");

  return (
    <div>
      <PageHeader
        action={
          <Link className={buttonVariants({ size: "sm" })} href="/app/recovery">
            Open recovery queue
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        }
        description="Authoritative Recovery Case, follow-up, outcome, and attribution data for the active workspace."
        title="Overview"
      />

      <div className="mt-6">
        <DemoNotice />
      </div>

      <MetricStrip
        items={[
          {
            label: "Open Recovery Cases",
            value: overview.openCases,
            detail: "Unresolved outcomes still owned by the team.",
          },
          {
            label: "Require attention",
            value: overview.requiringAttention,
            detail: "High urgency or past the next-action deadline.",
          },
          {
            label: "Mock follow-ups sent",
            value: overview.mockFollowUpsSent,
            detail: "Approved records from the local messaging adapter.",
          },
          {
            label: "Booked outcomes",
            value: overview.bookedOutcomes,
            detail: "Cases with a booked, recovered, or closed outcome.",
          },
          {
            label: "Recovered value",
            value: recoveredValue,
            detail: "Highest current attribution per Recovery Case.",
          },
        ]}
      />

      <section aria-labelledby="recent-recovery-activity" className="py-10 sm:py-12">
        <div className="flex items-start gap-3">
          <ClockCounterClockwise
            aria-hidden="true"
            className="text-primary mt-0.5"
            size={22}
            weight="duotone"
          />
          <div>
            <h2 className="text-base font-semibold" id="recent-recovery-activity">
              Recent recovery activity
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Append-only events from the active workspace.
            </p>
          </div>
        </div>

        {overview.activity.length ? (
          <ol className="mt-7 border-t">
            {overview.activity.map((event) => (
              <li
                className="grid gap-2 border-b py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                key={event.id}
              >
                <div>
                  <Link
                    className="hover:text-primary font-medium"
                    href={`/app/recovery/${event.recovery_case_id}`}
                  >
                    {event.description}
                  </Link>
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
        ) : (
          <EmptyState
            description="A verified development missed-call fixture will create the first Recovery Case and its event history."
            icon={ClockCounterClockwise}
            title="No recovery activity yet"
          />
        )}
      </section>
    </div>
  );
}
