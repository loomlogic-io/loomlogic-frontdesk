"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { ReactNode } from "react";

const clerkTheme = {
  ...shadcn,
  cssLayerName: shadcn.cssLayerName ?? "clerk",
};

export function Providers({ children }: { children: ReactNode }) {
  return <ClerkProvider appearance={{ theme: clerkTheme }}>{children}</ClerkProvider>;
}
