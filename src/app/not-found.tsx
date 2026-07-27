import { Compass } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 py-12">
      <div className="max-w-md text-center">
        <Brand className="mb-10 justify-center" />
        <Compass
          aria-hidden="true"
          className="text-primary mx-auto"
          size={32}
          weight="duotone"
        />
        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.025em]">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          The address may be incorrect, or the page may not be available in this phase.
        </p>
        <Button asChild className="mt-7">
          <Link href="/app">Return to overview</Link>
        </Button>
      </div>
    </main>
  );
}
