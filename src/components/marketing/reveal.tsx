"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utilities/cn";
import { usePrefersReducedMotion } from "@/components/marketing/use-prefers-reduced-motion";

/**
 * Single section-reveal primitive: opacity 0 to 1 with a 12px rise, once.
 *
 * Content always renders in its final state. When the element actually enters
 * the viewport, the Web Animations API adds a brief entrance effect without
 * leaving off-screen content hidden for crawlers, screenshots, or no-JS users.
 */
export function Reveal({
  as: Component = "div",
  children,
  className,
  delay = 0,
}: {
  as?: "div" | "li" | "section";
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const elementRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (prefersReducedMotion) {
      return;
    }

    // Already within the first viewport: leave it visible so the top of the
    // page never flashes.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
      return;
    }

    let animation: Animation | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          animation = element.animate(
            [
              { opacity: 0, transform: "translateY(12px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              delay,
              duration: 320,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            },
          );
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [delay, prefersReducedMotion]);

  return (
    <Component className={cn("brand-reveal", className)} ref={elementRef as never}>
      {children}
    </Component>
  );
}
