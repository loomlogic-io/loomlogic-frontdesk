import Link from "next/link";

import { BrandMark } from "@/components/marketing/brand-mark";

/*
 * Only links that resolve today. No social profiles, addresses, or legal pages
 * are invented; those arrive when the routes exist.
 */
const columns = [
  {
    heading: "Product",
    links: [
      { href: "#platform", label: "Platform" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#recovery-case", label: "Recovery Cases" },
      { href: "#revenue", label: "Recovered revenue" },
    ],
  },
  {
    heading: "Use cases",
    links: [
      { href: "#use-cases", label: "Missed-call recovery" },
      { href: "#use-cases", label: "After-hours booking" },
      { href: "#use-cases", label: "Callback enforcement" },
      { href: "#reliability", label: "Reliability and control" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-brand-line border-t px-5 py-14 sm:px-8">
      <div className="mx-auto grid w-full max-w-[86rem] gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_minmax(0,1.1fr)]">
        <div>
          <BrandMark />
          <p className="text-brand-ink-secondary mt-4 max-w-[34ch] text-[0.875rem] leading-6">
            An AI front desk and revenue-recovery platform for appointment-driven and
            lead-driven businesses.
          </p>
        </div>

        {columns.map((column) => (
          <nav aria-label={column.heading} key={column.heading}>
            <h2 className="text-[0.8125rem] font-semibold">{column.heading}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-brand-ink-secondary hover:text-brand-ink text-[0.875rem] transition-colors duration-[var(--brand-duration-hover)]"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-[0.8125rem] font-semibold">Get started</h2>
          <div className="mt-4 flex flex-col items-start gap-3">
            <Link
              className="bg-brand-accent hover:bg-brand-accent-hover rounded-brand-button inline-flex min-h-11 items-center px-4 text-[0.875rem] font-semibold text-white transition-colors duration-[var(--brand-duration-hover)]"
              href="/sign-up"
            >
              Create workspace
            </Link>
            <Link
              className="text-brand-ink-secondary hover:text-brand-ink text-[0.875rem] font-medium transition-colors duration-[var(--brand-duration-hover)]"
              href="/sign-in"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div className="border-brand-line mx-auto mt-12 w-full max-w-[86rem] border-t pt-6">
        <p className="text-brand-ink-tertiary text-[0.8125rem]">
          © {new Date().getFullYear()} LoomLogic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
