import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { Providers } from "@/components/providers";

import "@/styles/globals.css";

const brandDisplay = localFont({
  src: "../assets/fonts/league-spartan/league-spartan-latin.woff2",
  display: "swap",
  weight: "700",
  variable: "--font-brand-display",
});

const brandSans = localFont({
  src: "../assets/fonts/montserrat/montserrat-latin.woff2",
  display: "swap",
  weight: "400 600",
  variable: "--font-brand-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const description =
  "LoomLogic answers missed and after-hours calls, follows up with customers, books appointments, and helps businesses recover opportunities before they disappear.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LoomLogic — AI Front Desk & Revenue Recovery",
    template: "%s | LoomLogic",
  },
  description,
  applicationName: "LoomLogic",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "LoomLogic",
    title: "LoomLogic — AI Front Desk & Revenue Recovery",
    description,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "LoomLogic — AI Front Desk & Revenue Recovery",
    description,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={`${brandDisplay.variable} ${brandSans.variable}`} lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
