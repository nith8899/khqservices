import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Section } from "@/components/shared/ui";
import { isAdmin } from "@/lib/admin/auth";
import { getSiteSettings, readStored } from "@/lib/settings";

export const metadata: Metadata = { title: "Site settings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [stored, resolved] = await Promise.all([readStored(), getSiteSettings()]);
  return (
    <Section tone="surface">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Site settings</h1>
          <LogoutButton />
        </div>
        <SettingsForm
          logoUrl={resolved.logoUrl}
          initial={{
            email: stored.email ?? "",
            phone: stored.phone ?? "",
            messaging: stored.messaging ?? "",
            address: stored.address ?? "",
            hours: stored.hours ?? "",
            social: stored.social ?? [],
          }}
        />
      </div>
    </Section>
  );
}
