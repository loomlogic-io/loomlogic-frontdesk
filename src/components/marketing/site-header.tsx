"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BrandMark } from "@/components/marketing/brand-mark";
import { cn } from "@/lib/utilities/cn";

const links = [
  { href: "#platform", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#reliability", label: "Reliability" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Native <dialog> gives a real focus trap, Escape handling, and inert
  // background without adding a dependency.
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog) return;

    if (menuOpen && !dialog.open) {
      const previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
        if (dialog.open) dialog.close();
        trigger?.focus();
      };
    }

    if (dialog.open) dialog.close();
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow]",
        "duration-[var(--brand-duration-panel)] ease-[var(--brand-ease-standard)]",
        scrolled
          ? "border-brand-line bg-brand-canvas/92 border-b backdrop-blur-[6px]"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Public navigation"
        className="mx-auto flex h-16 w-full max-w-[86rem] items-center gap-3 px-5 sm:h-18 sm:gap-6 sm:px-8"
      >
        <BrandMark />

        <ul className="ml-2 hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                className="text-brand-ink-secondary hover:text-brand-ink hover:bg-brand-canvas-sunken rounded-brand-button inline-flex h-9 items-center px-3 text-[0.875rem] font-medium transition-colors duration-[var(--brand-duration-hover)]"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button
                className="text-brand-ink-secondary hover:text-brand-ink hidden h-9 items-center px-3 text-[0.875rem] font-medium transition-colors duration-[var(--brand-duration-hover)] sm:inline-flex"
                type="button"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button
                className="bg-brand-accent hover:bg-brand-accent-hover rounded-brand-button inline-flex min-h-11 items-center px-3.5 text-[0.875rem] font-semibold whitespace-nowrap text-white transition-[background-color,transform] duration-[var(--brand-duration-hover)] active:translate-y-px"
                type="button"
              >
                Create workspace
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              className="bg-brand-accent hover:bg-brand-accent-hover rounded-brand-button inline-flex min-h-11 items-center px-3.5 text-[0.875rem] font-semibold whitespace-nowrap text-white transition-[background-color,transform] duration-[var(--brand-duration-hover)] active:translate-y-px"
              href="/app"
            >
              Open workspace
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
          </Show>

          <button
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="text-brand-ink hover:bg-brand-canvas-sunken rounded-brand-button -mr-1 inline-flex size-11 items-center justify-center transition-colors duration-[var(--brand-duration-hover)] lg:hidden"
            onClick={() => setMenuOpen(true)}
            ref={triggerRef}
            type="button"
          >
            <List aria-hidden="true" size={20} />
          </button>
        </div>
      </nav>

      <dialog
        aria-label="Site menu"
        className="brand-scope bg-brand-canvas backdrop:bg-brand-ink/40 m-0 h-full max-h-none w-full max-w-none p-0 lg:hidden"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        ref={dialogRef}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <BrandMark />
          <button
            aria-label="Close menu"
            className="text-brand-ink hover:bg-brand-canvas-sunken rounded-brand-button -mr-1 inline-flex size-11 items-center justify-center"
            onClick={closeMenu}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        <ul className="border-brand-line mt-2 border-t px-5">
          {links.map((link) => (
            <li className="border-brand-line border-b" key={link.href}>
              <a
                className="flex min-h-14 items-center text-[1.0625rem] font-medium"
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 px-5">
          <Show when="signed-out">
            <SignUpButton mode="redirect">
              <button
                className="bg-brand-accent rounded-brand-button inline-flex min-h-12 w-full items-center justify-center px-4 text-[0.9375rem] font-semibold text-white"
                type="button"
              >
                Create workspace
              </button>
            </SignUpButton>
            <SignInButton mode="redirect">
              <button
                className="border-brand-line-strong rounded-brand-button inline-flex min-h-12 w-full items-center justify-center border px-4 text-[0.9375rem] font-semibold"
                type="button"
              >
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              className="bg-brand-accent rounded-brand-button inline-flex min-h-12 w-full items-center justify-center px-4 text-[0.9375rem] font-semibold text-white"
              href="/app"
              onClick={closeMenu}
            >
              Open workspace
            </Link>
          </Show>
        </div>
      </dialog>
    </header>
  );
}
