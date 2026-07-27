import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utilities/cn";

const buttonVariants = cva(
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 text-sm font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform] duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover border border-transparent",
        secondary:
          "border-border bg-background text-foreground hover:bg-surface-strong border",
        ghost: "text-muted-foreground hover:bg-surface hover:text-foreground",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3 text-[0.8125rem]",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ asChild = false, className, size, variant, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component className={cn(buttonVariants({ className, size, variant }))} {...props} />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
