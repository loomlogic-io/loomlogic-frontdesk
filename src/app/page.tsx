import {
  ArrowRight,
  CalendarCheck,
  ChatCircleText,
  ClipboardText,
  Clock,
  Lifebuoy,
  PhoneDisconnect,
  ShieldCheck,
  UserCircleGear,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { PlatformExplorer } from "@/components/marketing/platform-explorer";
import { RecoverySequence } from "@/components/marketing/recovery-sequence";
import { Reveal } from "@/components/marketing/reveal";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const failurePoints = [
  {
    icon: PhoneDisconnect,
    title: "The caller tries somewhere else",
    detail:
      "An unanswered phone rarely gets a second attempt. The customer moves to whoever picks up first.",
  },
  {
    icon: Clock,
    title: "The voicemail is never returned",
    detail:
      "Messages land in a queue nobody owns, and the intent behind the call disappears with them.",
  },
  {
    icon: ClipboardText,
    title: "The callback is promised, then forgotten",
    detail:
      "A commitment made on a busy afternoon has no owner, no deadline, and no escalation path.",
  },
  {
    icon: CalendarCheck,
    title: "The requested time was unavailable",
    detail:
      "The conversation ends at “we're full” instead of continuing to an alternative that works.",
  },
] as const;

const workflow = [
  {
    step: "01",
    name: "Capture",
    detail: "Missed, abandoned, and after-hours calls are recorded as structured events.",
  },
  {
    step: "02",
    name: "Understand",
    detail: "The caller, their intent, urgency, and the value at risk are identified.",
  },
  {
    step: "03",
    name: "Recover",
    detail: "A follow-up is drafted, reviewed, and sent through the appropriate channel.",
  },
  {
    step: "04",
    name: "Book",
    detail:
      "The appointment is booked, or the case is assigned to a person with a deadline.",
  },
  {
    step: "05",
    name: "Verify",
    detail:
      "The outcome is confirmed and attributed, so recovery is measured, not assumed.",
  },
] as const;

const caseTimeline = [
  { time: "3:42 PM", label: "Call missed", meta: "Inbound · 14 seconds" },
  { time: "3:42 PM", label: "Recovery Case created", meta: "RC-8F42D1 · high urgency" },
  { time: "3:43 PM", label: "Follow-up drafted", meta: "Held for manager approval" },
  {
    time: "3:44 PM",
    label: "Message approved and sent",
    meta: "Reviewed recipient and content",
  },
  { time: "4:01 PM", label: "Customer replied", meta: "Requested tomorrow morning" },
  { time: "4:03 PM", label: "Appointment booked", meta: "Outcome recorded" },
] as const;

const attributionLevels = [
  {
    level: "Estimated",
    detail: "Derived from the configured value of the service or opportunity at risk.",
  },
  {
    level: "Confirmed",
    detail: "A person confirmed the booking or completed outcome for the case.",
  },
  {
    level: "Verified",
    detail:
      "An authoritative connected system confirms the value. Requires an integration.",
  },
] as const;

const integrations = [
  { name: "Clerk", role: "Identity and organizations", state: "Connected" },
  { name: "Supabase", role: "PostgreSQL and row-level security", state: "Connected" },
  { name: "Twilio", role: "Telephony and SMS", state: "On the roadmap" },
  { name: "ElevenLabs", role: "Conversational voice", state: "On the roadmap" },
  { name: "Google Calendar", role: "Availability and booking", state: "On the roadmap" },
  { name: "Resend", role: "Transactional email", state: "On the roadmap" },
  { name: "OpenAI", role: "Operations copilot", state: "On the roadmap" },
] as const;

const useCases = [
  {
    name: "Missed-call recovery",
    detail: "Turn an unanswered call into an owned, tracked outcome.",
  },
  {
    name: "After-hours booking",
    detail: "Capture intent outside business hours and follow up at open.",
  },
  {
    name: "Overflow call handling",
    detail: "Keep opportunities alive when the desk is already busy.",
  },
  {
    name: "Callback enforcement",
    detail: "Give every promised callback an owner and a deadline.",
  },
  {
    name: "Cancellation filling",
    detail: "Offer freed capacity to customers already waiting.",
  },
  {
    name: "Quote and intake follow-up",
    detail: "Stop stalled requests from quietly going cold.",
  },
] as const;

const controls = [
  {
    icon: ShieldCheck,
    title: "Human approval before contact",
    detail:
      "Outbound follow-ups are drafted and held until an authorized person reviews the recipient and the exact message.",
  },
  {
    icon: ClipboardText,
    title: "Visible action history",
    detail:
      "Every state change, approval, and send is recorded with its actor, time, and reference.",
  },
  {
    icon: UserCircleGear,
    title: "Role-aware access",
    detail:
      "Roles determine who can assign, draft, and approve. Sensitive operations require permission.",
  },
  {
    icon: Lifebuoy,
    title: "Designed for tenant isolation",
    detail:
      "Workspace boundaries are enforced in the database, not only in the interface.",
  },
] as const;

const recoveryStates = [
  "Booked",
  "Resolved",
  "Assigned to a person",
  "Awaiting a known action",
  "Disqualified",
  "Opted out",
  "Explicitly lost",
] as const;

const heroTrust = [
  "Works with your existing business number",
  "Built for front-desk teams",
  "Every action stays visible and auditable",
] as const;

export default function HomePage() {
  return (
    <div className="brand-scope min-h-[100dvh] antialiased">
      <a
        className="bg-brand-accent rounded-brand-button sr-only px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        href="#main"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main">
        <Section className="pt-12 pb-16 sm:pt-16 sm:pb-24" width="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16">
            <div>
              <Eyebrow>AI Front Desk &amp; Revenue Recovery</Eyebrow>
              <h1 className="mt-4 max-w-[15ch] text-[2.5rem] leading-[1.04] text-balance sm:text-[3.25rem] lg:text-[3.75rem]">
                Turn missed calls into booked business.
              </h1>
              <p className="text-brand-ink-secondary mt-6 max-w-[54ch] text-[1.0625rem] leading-7 text-pretty sm:text-[1.125rem]">
                LoomLogic answers when your team cannot, follows up with missed callers,
                books appointments, and tracks the revenue your business recovered.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  className="bg-brand-accent hover:bg-brand-accent-hover rounded-brand-button inline-flex min-h-12 items-center gap-2 px-5 text-[0.9375rem] font-semibold text-white transition-[background-color,transform] duration-[var(--brand-duration-hover)] active:translate-y-px"
                  href="/sign-up"
                >
                  Create workspace
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <a
                  className="border-brand-line-strong hover:bg-brand-canvas-sunken rounded-brand-button inline-flex min-h-12 items-center border px-5 text-[0.9375rem] font-semibold transition-colors duration-[var(--brand-duration-hover)]"
                  href="#how-it-works"
                >
                  See how recovery works
                </a>
              </div>

              <ul className="text-brand-ink-secondary mt-9 flex flex-col gap-2.5 text-[0.875rem] leading-5 sm:flex-row sm:flex-wrap sm:gap-x-7">
                {heroTrust.map((item) => (
                  <li className="flex items-center gap-2" key={item}>
                    <span
                      aria-hidden="true"
                      className="bg-brand-accent size-1.5 shrink-0 rounded-full"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <RecoverySequence />
          </div>
        </Section>

        <Section band="sunken" className="py-20 sm:py-28" labelledBy="problem-heading">
          <Reveal>
            <Eyebrow>The cost of a busy front desk</Eyebrow>
            <SectionHeading
              className="mt-4"
              id="problem-heading"
              support="The call is the visible event. The lost outcome is what actually costs the business."
            >
              A missed call is rarely just a missed call.
            </SectionHeading>
          </Reveal>

          <ol className="mt-12 grid gap-x-10 sm:grid-cols-2">
            {failurePoints.map((point, index) => {
              const PointIcon = point.icon;
              return (
                <Reveal as="li" delay={index * 60} key={point.title}>
                  <div className="border-brand-line flex h-full gap-4 border-t py-7">
                    <span
                      aria-hidden="true"
                      className="bg-brand-surface border-brand-line text-brand-ink-secondary mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border"
                    >
                      <PointIcon size={19} />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem]">{point.title}</h3>
                      <p className="text-brand-ink-secondary mt-2 max-w-[46ch] text-[0.9375rem] leading-6">
                        {point.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </Section>

        <Section
          className="py-20 sm:py-28"
          id="how-it-works"
          labelledBy="workflow-heading"
        >
          <Reveal>
            <Eyebrow>How recovery works</Eyebrow>
            <SectionHeading
              className="mt-4"
              id="workflow-heading"
              support="Five stages, from the moment a call goes unanswered to a confirmed business outcome."
            >
              LoomLogic keeps working after the call ends.
            </SectionHeading>
          </Reveal>

          <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {workflow.map((stage, index) => (
              <Reveal as="li" delay={index * 70} key={stage.step}>
                <div className="flex items-center gap-3">
                  <span className="brand-numeric text-brand-accent text-[0.8125rem] font-semibold">
                    {stage.step}
                  </span>
                  <span aria-hidden="true" className="bg-brand-line h-px flex-1" />
                </div>
                <h3 className="mt-4 text-[1.0625rem]">{stage.name}</h3>
                <p className="text-brand-ink-secondary mt-2 text-[0.9375rem] leading-6">
                  {stage.detail}
                </p>
              </Reveal>
            ))}
          </ol>
        </Section>

        <Section
          band="sunken"
          className="py-20 sm:py-28"
          id="platform"
          labelledBy="platform-heading"
          width="wide"
        >
          <Reveal>
            <Eyebrow>The platform</Eyebrow>
            <SectionHeading
              className="mt-4"
              id="platform-heading"
              support="LoomLogic is an operating system for the front desk, not a phone bot bolted onto a call log."
            >
              Everything the desk needs after the call.
            </SectionHeading>
          </Reveal>
          <PlatformExplorer />
        </Section>

        <Section
          className="py-20 sm:py-28"
          id="recovery-case"
          labelledBy="case-heading"
          width="wide"
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
            <Reveal>
              <Eyebrow>The differentiator</Eyebrow>
              <SectionHeading className="mt-4" id="case-heading">
                The call ends. The recovery process does not.
              </SectionHeading>
              <p className="text-brand-ink-secondary mt-4 max-w-[52ch] text-[1.0625rem] leading-7">
                A Recovery Case is a durable business record. It stays open until there is
                a real outcome, and it carries its own history the whole way.
              </p>
              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {recoveryStates.map((state) => (
                  <li
                    className="text-brand-ink-secondary flex items-center gap-2.5 text-[0.9375rem]"
                    key={state}
                  >
                    <span
                      aria-hidden="true"
                      className="border-brand-accent-line bg-brand-accent-soft size-2 shrink-0 rounded-full border"
                    />
                    {state}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80}>
              <div className="bg-brand-surface border-brand-line rounded-brand-panel shadow-brand-panel border p-6 sm:p-7">
                <div className="border-brand-line flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="brand-numeric text-brand-accent text-[0.75rem] font-semibold">
                      RC-8F42D1
                    </p>
                    <h3 className="mt-1 text-[1.0625rem] font-semibold">Case history</h3>
                  </div>
                  <span className="bg-brand-success-soft text-brand-success inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold">
                    <ChatCircleText aria-hidden="true" size={13} weight="fill" />
                    Booked
                  </span>
                </div>
                <ol className="mt-1">
                  {caseTimeline.map((event) => (
                    <li
                      className="border-brand-line flex items-baseline gap-4 border-b py-3.5 last:border-b-0"
                      key={event.label}
                    >
                      <time className="brand-numeric text-brand-ink-tertiary w-[4.5rem] shrink-0 text-[0.8125rem]">
                        {event.time}
                      </time>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.9375rem] leading-5 font-medium">
                          {event.label}
                        </p>
                        <p className="text-brand-ink-tertiary mt-0.5 text-[0.8125rem] leading-5">
                          {event.meta}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="border-brand-success-line bg-brand-success-soft rounded-brand-surface mt-5 flex items-center justify-between border px-4 py-3">
                  <span className="text-brand-success text-[0.8125rem] font-semibold">
                    Estimated recovered value
                  </span>
                  <span className="brand-numeric text-brand-success text-lg font-semibold">
                    $280
                  </span>
                </div>
                <p className="text-brand-ink-tertiary mt-3 text-[0.75rem] leading-5">
                  Illustrative case with sample data.
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section
          band="sunken"
          className="py-20 sm:py-28"
          id="revenue"
          labelledBy="revenue-heading"
        >
          <Reveal>
            <Eyebrow>Financial visibility</Eyebrow>
            <SectionHeading
              className="mt-4"
              id="revenue-heading"
              support="Recovery is only meaningful if it can be measured. Every case carries the evidence behind its value."
            >
              See the business LoomLogic brought back.
            </SectionHeading>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-3">
            {attributionLevels.map((item, index) => (
              <Reveal delay={index * 70} key={item.level}>
                <div className="border-brand-line h-full border-t pt-6 sm:pr-8">
                  <h3 className="text-brand-ink text-[1.0625rem]">{item.level}</h3>
                  <p className="text-brand-ink-secondary mt-2 max-w-[38ch] text-[0.9375rem] leading-6">
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-brand-ink-tertiary border-brand-line mt-10 max-w-[62ch] border-t pt-6 text-[0.875rem] leading-6">
              Estimated and confirmed values are never summed together. Each case counts
              once, at the highest attribution level it has reached. Verified value
              requires a connected completion or payment system.
            </p>
          </Reveal>
        </Section>

        <Section className="py-20 sm:py-28" labelledBy="integrations-heading">
          <Reveal>
            <Eyebrow>Designed to connect with</Eyebrow>
            <SectionHeading
              className="mt-4"
              id="integrations-heading"
              support="LoomLogic reaches providers through replaceable adapters. Roadmap items are labelled as such."
            >
              Built on infrastructure you already trust.
            </SectionHeading>
          </Reveal>

          <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((item, index) => (
              <Reveal as="li" delay={index * 45} key={item.name}>
                <div className="border-brand-line flex h-full items-baseline justify-between gap-4 border-t py-5">
                  <div>
                    <p className="text-[0.9375rem] font-semibold">{item.name}</p>
                    <p className="text-brand-ink-tertiary mt-1 text-[0.8125rem] leading-5">
                      {item.role}
                    </p>
                  </div>
                  <span
                    className={
                      item.state === "Connected"
                        ? "text-brand-success shrink-0 text-[0.75rem] font-semibold"
                        : "text-brand-ink-tertiary shrink-0 text-[0.75rem] font-medium"
                    }
                  >
                    {item.state}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>

        <Section
          band="sunken"
          className="py-20 sm:py-28"
          id="use-cases"
          labelledBy="use-cases-heading"
        >
          <Reveal>
            <Eyebrow>Where it earns its place</Eyebrow>
            <SectionHeading
              className="mt-4"
              id="use-cases-heading"
              support="Common across automotive service, home services, dental and wellness, professional services, and repair businesses."
            >
              Outcomes, not industries.
            </SectionHeading>
          </Reveal>

          <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item, index) => (
              <Reveal as="li" delay={index * 50} key={item.name}>
                <div className="border-brand-line h-full border-t py-6 sm:pr-8">
                  <h3 className="text-[1.0625rem]">{item.name}</h3>
                  <p className="text-brand-ink-secondary mt-2 text-[0.9375rem] leading-6">
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>

        <Section
          className="py-20 sm:py-28"
          id="reliability"
          labelledBy="reliability-heading"
        >
          <Reveal>
            <Eyebrow>Reliability and control</Eyebrow>
            <SectionHeading
              className="mt-4"
              id="reliability-heading"
              support="Automation only earns trust when a person stays in control of what reaches the customer."
            >
              Nothing reaches a customer without permission.
            </SectionHeading>
          </Reveal>

          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {controls.map((item, index) => {
              const ControlIcon = item.icon;
              return (
                <Reveal delay={index * 60} key={item.title}>
                  <div className="border-brand-line flex gap-4 border-t pt-6">
                    <span
                      aria-hidden="true"
                      className="text-brand-accent mt-0.5 shrink-0"
                    >
                      <ControlIcon size={20} weight="duotone" />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem]">{item.title}</h3>
                      <p className="text-brand-ink-secondary mt-2 max-w-[44ch] text-[0.9375rem] leading-6">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>

        <Section band="ink" className="py-20 sm:py-28" labelledBy="cta-heading">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow tone="inverse">Get started</Eyebrow>
              <SectionHeading
                align="center"
                className="mt-4"
                id="cta-heading"
                tone="inverse"
              >
                Your next customer is already calling.
              </SectionHeading>
              <p className="mx-auto mt-4 max-w-[46ch] text-[1.0625rem] leading-7 text-white/70">
                Make sure the opportunity does not disappear when your team cannot answer.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  className="text-brand-ink rounded-brand-button inline-flex min-h-12 items-center gap-2 bg-white px-5 text-[0.9375rem] font-semibold transition-[background-color,transform] duration-[var(--brand-duration-hover)] hover:bg-white/90 active:translate-y-px"
                  href="/sign-up"
                >
                  Create workspace
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <Link
                  className="rounded-brand-button inline-flex min-h-12 items-center border border-white/25 px-5 text-[0.9375rem] font-semibold text-white transition-colors duration-[var(--brand-duration-hover)] hover:bg-white/10"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
