"use client";

import {
  AddressBook,
  GearSix,
  House,
  Lifebuoy,
  Tray,
  type Icon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utilities/cn";

export type NavigationItem = {
  href: string;
  label: string;
  icon: Icon;
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/app", label: "Overview", icon: House },
  { href: "/app/inbox", label: "Inbox", icon: Tray },
  { href: "/app/recovery", label: "Recovery", icon: Lifebuoy },
  { href: "/app/contacts", label: "Contacts", icon: AddressBook },
  { href: "/app/settings", label: "Settings", icon: GearSix },
];

export function PrimaryNavigation({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="space-y-1">
      {primaryNavigation.map((item) => {
        const isActive =
          item.href === "/app" ? pathname === item.href : pathname.startsWith(item.href);
        const ItemIcon = item.icon;

        return (
          <Link
            {...(isActive ? { "aria-current": "page" as const } : {})}
            className={cn(
              "group flex min-h-10 items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm font-medium transition-[background-color,color,transform] duration-150 active:translate-y-px",
              isActive
                ? "bg-surface-strong text-primary"
                : "text-muted-foreground hover:bg-surface hover:text-foreground",
              compact && "justify-center px-0",
            )}
            href={item.href}
            key={item.href}
            {...(onNavigate ? { onClick: onNavigate } : {})}
            {...(compact ? { title: item.label } : {})}
          >
            <ItemIcon
              aria-hidden="true"
              size={19}
              weight={isActive ? "fill" : "regular"}
            />
            {!compact && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
