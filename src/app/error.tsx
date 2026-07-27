"use client";

import { WarningCircle } from "@phosphor-icons/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("root_render_error", {
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 py-12">
      <section className="max-w-md text-center" role="alert">
        <WarningCircle
          aria-hidden="true"
          className="text-danger mx-auto"
          size={34}
          weight="duotone"
        />
        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.025em]">
          LoomLogic could not load
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Try again. Unexpected errors are reported with safe metadata only.
        </p>
        <Button className="mt-7" onClick={reset} type="button">
          Try again
        </Button>
      </section>
    </main>
  );
}
