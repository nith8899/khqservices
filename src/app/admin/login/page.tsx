import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Notice, Section } from "@/components/shared/ui";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Admin sign-in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <Section tone="surface" className="min-h-[60vh]">
      <div className="mx-auto max-w-sm rounded-xl border border-line bg-white p-7 shadow-card">
        <h1 className="text-2xl font-bold">Admin sign-in</h1>
        <div className="mt-6">
          {adminConfigured() ? (
            <LoginForm />
          ) : (
            <Notice tone="warning" title="Admin is not configured">
              Set ADMIN_USERNAME, ADMIN_PASSWORD_HASH, and ADMIN_SESSION_SECRET in the server environment
              (see the README), then restart the site.
            </Notice>
          )}
        </div>
      </div>
    </Section>
  );
}
