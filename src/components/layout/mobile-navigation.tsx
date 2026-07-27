"use client";

import { List, X } from "@phosphor-icons/react";
import { useState } from "react";

import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { PrimaryNavigation } from "@/components/layout/primary-navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((current) => !current)}
        size="icon"
        type="button"
        variant="ghost"
      >
        {isOpen ? (
          <X aria-hidden="true" size={21} />
        ) : (
          <List aria-hidden="true" size={21} />
        )}
      </Button>
      {isOpen && (
        <div className="bg-background fixed inset-0 top-16 z-30 border-t px-5 py-6 lg:hidden">
          <Brand className="mb-8" />
          <PrimaryNavigation onNavigate={() => setIsOpen(false)} />
          <p className="text-muted-foreground mt-8 border-t pt-5 text-xs leading-5">
            Assistant actions arrive in Phase 6. All future mutations will require an
            explicit approval policy.
          </p>
        </div>
      )}
    </>
  );
}
