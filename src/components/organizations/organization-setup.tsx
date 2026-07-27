"use client";

import { OrganizationList } from "@clerk/nextjs";

export function OrganizationSetup() {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/app"
      afterSelectOrganizationUrl="/app"
      hidePersonal
    />
  );
}
