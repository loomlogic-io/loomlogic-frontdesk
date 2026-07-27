import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/components/providers";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "LoomLogic Resolve",
    template: "%s | LoomLogic Resolve",
  },
  description:
    "A secure front-desk and revenue-recovery operating system for appointment-driven businesses.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
