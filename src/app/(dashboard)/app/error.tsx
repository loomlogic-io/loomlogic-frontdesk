"use client";

import { WarningCircle } from "@phosphor-icons/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("dashboard_render_error", {
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  return (
    <section className="mx-auto max-w-lg py-20" role="alert">
      <div className="bg-surface-strong text-danger grid size-11 place-items-center rounded-[var(--radius-panel)]">
        <WarningCircle aria-hidden="true" size={23} weight="duotone" />
      </div>
      <h1 className="mt-6 text-xl font-semibold tracking-[-0.02em]">
        This workspace could not load
      </h1>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        Try the request again. If the problem continues, share the request time with
        support. Sensitive details are not written to the browser log.
      </p>
      <Button className="mt-6" onClick={reset} type="button">
        Try again
      </Button>
    </section>
  );
}
