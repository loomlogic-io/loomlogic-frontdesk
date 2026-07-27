import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OrganizationSetup } from "@/components/organizations/organization-setup";
import { Brand } from "@/components/shared/brand";

export const metadata: Metadata = {
  title: "Select workspace",
};

export default async function OrganizationPage() {
  const { orgId, userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (orgId) {
    redirect("/app");
  }

  return (
    <main className="bg-surface grid min-h-[100dvh] place-items-center px-5 py-12">
      <div className="w-full max-w-2xl">
        <Brand className="mb-10 justify-center" />
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.025em]">
            Choose your workspace
          </h1>
          <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm leading-6">
            An active Organization is required before LoomLogic can load any tenant-owned
            data.
          </p>
        </div>
        <div className="flex justify-center">
          <OrganizationSetup />
        </div>
      </div>
    </main>
  );
}
