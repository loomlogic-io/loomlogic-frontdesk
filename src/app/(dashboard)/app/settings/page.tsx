import { Clock, GlobeHemisphereWest, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Settings",
};

const settingsFoundations = [
  {
    icon: ShieldCheck,
    title: "Membership authority",
    detail:
      "Invite and role management remain in Clerk Organizations. Database access mirrors active membership.",
  },
  {
    icon: Clock,
    title: "Organization time zone",
    detail:
      "The schema stores an IANA time zone per workspace. Scheduling controls arrive with the business domain.",
  },
  {
    icon: GlobeHemisphereWest,
    title: "Locale and currency",
    detail:
      "The foundation stores locale and ISO currency defaults without hard-coding presentation formats.",
  },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        description="Workspace-level controls will expand as business capabilities are introduced."
        title="Settings"
      />
      <section aria-labelledby="settings-foundation" className="py-10">
        <h2 className="text-base font-semibold" id="settings-foundation">
          Workspace foundation
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          These boundaries are established before editable business settings.
        </p>
        <div className="bg-border mt-7 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border md:grid-cols-3">
          {settingsFoundations.map((item) => {
            const ItemIcon = item.icon;

            return (
              <article className="bg-background p-6" key={item.title}>
                <ItemIcon
                  aria-hidden="true"
                  className="text-primary"
                  size={22}
                  weight="duotone"
                />
                <h3 className="mt-5 text-sm font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {item.detail}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
