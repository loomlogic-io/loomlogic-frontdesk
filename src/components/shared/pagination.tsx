import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utilities/cn";

export function Pagination({
  basePath,
  page,
  pageSize,
  total,
  searchParams = {},
}: {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  searchParams?: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const hrefForPage = (targetPage: number) => {
    const parameters = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) parameters.set(key, value);
    }
    parameters.set("page", String(targetPage));
    return `${basePath}?${parameters.toString()}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-between border-t pt-5"
    >
      <p className="text-muted-foreground text-sm tabular-nums">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
            href={hrefForPage(page - 1)}
          >
            <ArrowLeft aria-hidden="true" size={15} />
            Previous
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link
            className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
            href={hrefForPage(page + 1)}
          >
            Next
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
