import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireActiveTenant } from "@/lib/auth/runtime";
import {
  ActiveOrganizationRequiredError,
  AuthenticationRequiredError,
} from "@/lib/errors/app-error";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  try {
    await requireActiveTenant();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      redirect("/sign-in");
    }

    if (error instanceof ActiveOrganizationRequiredError) {
      redirect("/organization");
    }

    throw error;
  }

  return <AppShell>{children}</AppShell>;
}
