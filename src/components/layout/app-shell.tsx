import { Bell, ChatCircleDots, LockKey } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

import { AccountMenu, WorkspaceSwitcher } from "@/components/layout/clerk-controls";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { PrimaryNavigation } from "@/components/layout/primary-navigation";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-[100dvh]">
      <a
        className="bg-primary text-primary-foreground fixed top-3 left-3 z-50 -translate-y-20 rounded-md px-4 py-2 text-sm font-semibold focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>

      <aside className="bg-surface fixed inset-y-0 left-0 hidden w-66 flex-col border-r p-4 lg:flex">
        <Brand className="px-2 py-2" />
        <div className="mt-8">
          <PrimaryNavigation />
        </div>
        <div className="mt-auto space-y-3">
          <Button
            className="w-full justify-start"
            disabled
            title="Assistant workspace arrives in Phase 6"
            variant="secondary"
          >
            <ChatCircleDots aria-hidden="true" size={19} />
            Assistant
            <span className="text-muted-foreground ml-auto text-[0.6875rem] font-medium">
              Later
            </span>
          </Button>
          <div className="text-muted-foreground flex items-start gap-2 px-2 text-xs leading-5">
            <LockKey aria-hidden="true" className="mt-0.5 shrink-0" size={15} />
            <span>Active workspace context is verified on every request.</span>
          </div>
        </div>
      </aside>

      <div className="lg:pl-66">
        <header className="bg-background/95 sticky top-0 z-20 flex h-16 items-center border-b px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="mr-2 lg:hidden">
            <MobileNavigation />
          </div>
          <div className="min-w-0 flex-1">
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Notifications are not available yet"
              disabled
              size="icon"
              title="Notifications arrive in a later phase"
              variant="ghost"
            >
              <Bell aria-hidden="true" size={19} />
            </Button>
            <AccountMenu />
          </div>
        </header>

        <main
          className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
