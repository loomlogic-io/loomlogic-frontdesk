"use client";

import {
  ArrowUUpLeft,
  CalendarCheck,
  ChatCircleText,
  CheckCircle,
  Lifebuoy,
  PhoneDisconnect,
  PhoneIncoming,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utilities/cn";
import { usePrefersReducedMotion } from "@/components/marketing/use-prefers-reduced-motion";

/*
 * Illustrative product sequence.
 *
 * Every value below is fictional demonstration content using the repository's
 * reserved 555-01xx phone range. It is not live data and is labelled as such
 * beneath the scene.
 */
const STEP_DELAY_MS = 850;
const TOTAL_STEPS = 7;

const timeline = [
  {
    step: 2,
    time: "4:12 PM",
    icon: Lifebuoy,
    label: "Recovery Case opened",
    detail: "RC-8F42D1 · brake service enquiry",
  },
  {
    step: 3,
    time: "4:13 PM",
    icon: ChatCircleText,
    label: "Follow-up approved and sent",
    detail: "Reviewed by a manager before delivery",
  },
  {
    step: 4,
    time: "4:31 PM",
    icon: ArrowUUpLeft,
    label: "Customer replied",
    detail: "“Tomorrow morning works.”",
  },
  {
    step: 5,
    time: "4:33 PM",
    icon: CalendarCheck,
    label: "Appointment booked",
    detail: "Thu 9:30 AM · Bay 2",
  },
] as const;

export function RecoverySequence() {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Starts complete: that is the server-rendered, no-JS, and reduced-motion
  // state. The effect rewinds and replays it once when motion is welcome.
  const [step, setStep] = useState(TOTAL_STEPS - 1);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timers: number[] = [];
    // Scheduled rather than set synchronously, so the first committed frame is
    // the complete scene and no cascading render is triggered from the effect.
    timers.push(
      window.setTimeout(() => {
        setStep(-1);
        for (let index = 0; index < TOTAL_STEPS; index += 1) {
          timers.push(
            window.setTimeout(() => setStep(index), index * STEP_DELAY_MS + 80),
          );
        }
      }, 0),
    );

    // Runs once, then rests. No loop.
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [prefersReducedMotion]);

  const hidden = (index: number) => (step >= index ? undefined : "false");
  const missed = step >= 1;
  const booked = step >= 5;
  const confirmed = step >= 6;

  return (
    <figure className="m-0">
      <div className="bg-brand-surface border-brand-line rounded-brand-panel shadow-brand-panel border p-3 sm:p-4">
        {/* 1–2. Incoming call, then the missed state. */}
        <div
          className={cn(
            "rounded-brand-surface flex items-center gap-3 border px-4 py-3.5 transition-colors duration-500",
            missed
              ? "border-brand-danger-soft bg-brand-danger-soft"
              : "border-brand-accent-line bg-brand-accent-soft",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-500",
              missed ? "bg-brand-danger text-white" : "bg-brand-accent text-white",
            )}
          >
            {missed ? (
              <PhoneDisconnect size={18} weight="fill" />
            ) : (
              <PhoneIncoming size={18} weight="fill" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] leading-5 font-semibold">
              {missed ? "Missed call" : "Incoming call"}
            </p>
            <p className="brand-numeric text-brand-ink-secondary mt-0.5 text-[0.8125rem] leading-5">
              +1 (416) 555-0148 · Dana Whitfield
            </p>
          </div>
          <span
            className={cn(
              "brand-numeric shrink-0 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold transition-colors duration-500",
              missed
                ? "bg-brand-danger/12 text-brand-danger"
                : "bg-brand-accent/12 text-brand-accent",
            )}
          >
            {missed ? "4:12 PM" : "ringing"}
          </span>
        </div>

        {/* 3–6. The Recovery Case that outlives the call. */}
        <div className="brand-step mt-3" data-visible={hidden(2)}>
          <div className="border-brand-line rounded-brand-surface border">
            <div className="border-brand-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
              <div>
                <p className="brand-numeric text-brand-accent text-[0.75rem] font-semibold">
                  RC-8F42D1
                </p>
                <p className="mt-0.5 text-[0.9375rem] font-semibold">Recovery Case</p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold transition-colors duration-500",
                  booked
                    ? "bg-brand-success-soft text-brand-success"
                    : "bg-brand-attention-soft text-brand-attention",
                )}
              >
                <span aria-hidden="true">
                  {booked ? (
                    <CheckCircle size={13} weight="fill" />
                  ) : (
                    <Lifebuoy size={13} weight="fill" />
                  )}
                </span>
                {booked ? "Booked" : "Engaging"}
              </span>
            </div>

            <ol className="px-4 py-1">
              {timeline.map((event) => {
                const EventIcon = event.icon;
                return (
                  <li
                    className="brand-step border-brand-line flex gap-3 border-b py-3 last:border-b-0"
                    data-visible={hidden(event.step)}
                    key={event.label}
                  >
                    <span
                      aria-hidden="true"
                      className="bg-brand-canvas-sunken text-brand-ink-secondary mt-0.5 grid size-6 shrink-0 place-items-center rounded-full"
                    >
                      <EventIcon size={13} weight="fill" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.875rem] leading-5 font-medium">
                        {event.label}
                      </p>
                      <p className="text-brand-ink-tertiary mt-0.5 text-[0.8125rem] leading-5">
                        {event.detail}
                      </p>
                    </div>
                    <time className="brand-numeric text-brand-ink-tertiary shrink-0 text-[0.75rem] leading-5">
                      {event.time}
                    </time>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* 7. The recovered value, recorded with its attribution level. */}
        <div className="brand-step mt-3" data-visible={hidden(6)}>
          <div className="border-brand-success-line bg-brand-success-soft rounded-brand-surface flex items-center justify-between gap-4 border px-4 py-3.5">
            <div>
              <p className="text-brand-success text-[0.8125rem] leading-5 font-semibold">
                Recovered value recorded
              </p>
              <p className="text-brand-ink-secondary mt-0.5 text-[0.8125rem] leading-5">
                Attribution: {confirmed ? "confirmed" : "estimated"}
              </p>
            </div>
            <p className="brand-numeric text-brand-success text-2xl font-semibold">
              $280
            </p>
          </div>
        </div>
      </div>

      <figcaption className="text-brand-ink-tertiary mt-3 text-center text-[0.75rem] leading-5">
        Illustrative product sequence with sample data. Not a live workspace.
      </figcaption>
    </figure>
  );
}
