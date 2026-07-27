import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="bg-background min-h-[100dvh]">
      <nav
        aria-label="Public navigation"
        className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Brand />
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <Button size="sm">Create workspace</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button asChild size="sm">
              <Link href="/app">Open workspace</Link>
            </Button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8",
                },
              }}
            />
          </Show>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.65fr)] lg:items-center lg:py-36">
        <div>
          <p className="text-primary mb-4 flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck aria-hidden="true" size={18} weight="duotone" />
            Secure local Recovery workflow
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
            Turn missed calls into owned outcomes.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-[62ch] text-base leading-7 text-pretty sm:text-lg">
            LoomLogic keeps unresolved customer opportunities visible until they are
            booked, resolved, or safely handed to a person.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Show when="signed-out">
              <SignUpButton mode="redirect">
                <Button>
                  Create workspace
                  <ArrowRight aria-hidden="true" size={17} />
                </Button>
              </SignUpButton>
              <SignInButton mode="redirect">
                <Button variant="secondary">Sign in</Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Button asChild>
                <Link href="/app">
                  Open workspace
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
              </Button>
            </Show>
          </div>
        </div>

        <aside className="bg-surface border-border rounded-[var(--radius-panel)] border p-6 sm:p-8">
          <p className="text-sm font-semibold">Phase 1 scope</p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Missed-call recovery, human approval, mock follow-up, and booked-value
            attribution on a tenant-isolated foundation.
          </p>
          <dl className="mt-7 space-y-5">
            {[
              ["Identity", "Clerk Organizations"],
              ["Data boundary", "PostgreSQL RLS"],
              ["Provider status", "Local mocks only"],
            ].map(([term, detail]) => (
              <div className="border-border border-t pt-4" key={term}>
                <dt className="text-muted-foreground text-xs">{term}</dt>
                <dd className="mt-1 text-sm font-medium">{detail}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>
    </main>
  );
}
