"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export function WorkspaceSwitcher() {
  return (
    <OrganizationSwitcher
      afterCreateOrganizationUrl="/app"
      afterSelectOrganizationUrl="/app"
      hidePersonal
      organizationProfileMode="modal"
    />
  );
}

export function AccountMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-8",
        },
      }}
    />
  );
}
