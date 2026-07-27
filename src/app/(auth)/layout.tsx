import type { ReactNode } from "react";

import { Brand } from "@/components/shared/brand";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-surface grid min-h-[100dvh] place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <Brand className="mb-8 justify-center" />
        <div className="flex justify-center">{children}</div>
        <p className="text-muted-foreground mx-auto mt-8 max-w-sm text-center text-xs leading-5">
          Access is scoped to your active Clerk Organization and enforced again by
          PostgreSQL Row Level Security.
        </p>
      </div>
    </main>
  );
}
