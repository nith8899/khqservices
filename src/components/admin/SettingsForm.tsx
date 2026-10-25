"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { settingsSchema, type EditableSettings } from "@/lib/settings-schema";
import { FormField } from "@/components/forms/FormField";
import { Button, ErrorMessage, Notice } from "@/components/shared/ui";

export function SettingsForm({ initial, logoUrl }: { initial: EditableSettings; logoUrl?: string }) {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [logoError, setLogoError] = useState<string>();
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({ kind: "idle" });
  const [currentLogo, setCurrentLogo] = useState(logoUrl);

  const { register, control, handleSubmit, setError, formState: { errors } } = useForm<EditableSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initial,
  });
  const social = useFieldArray({ control, name: "social" });

  async function onSubmit(values: EditableSettings) {
    setStatus({ kind: "saving" });
    const fd = new FormData();
    fd.append("payload", JSON.stringify(values));
    if (logoFile) fd.append("logo", logoFile);
    if (removeLogo) fd.append("removeLogo", "true");
    try {
      const res = await fetch("/api/admin/settings", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean; message?: string; errors?: Record<string, string>; logoUrl?: string | null;
      };
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok || !json.ok) {
        for (const [k, m] of Object.entries(json.errors ?? {})) {
          if (k === "logo") setLogoError(m);
          else setError(k as keyof EditableSettings, { message: m });
        }
        setStatus({ kind: "error", message: json.message ?? "Could not save." });
        return;
      }
      setCurrentLogo(json.logoUrl ?? undefined);
      setLogoFile(null);
      setRemoveLogo(false);
      setLogoError(undefined);
      setStatus({ kind: "saved", message: "Saved. The public site now shows these details." });
      router.refresh();
    } catch {
      setStatus({ kind: "error", message: "Could not reach the server." });
    }
  }

  const card = "rounded-xl border border-line bg-white p-5 shadow-card sm:p-7";

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate className="space-y-8">
      <fieldset className={card}>
        <legend className="px-1 text-lg font-bold text-navy-900">Logo</legend>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex h-20 w-48 items-center justify-center rounded-lg border border-line bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded logo */}
            <img src={currentLogo && !removeLogo ? currentLogo : "/images/logo.jpg"} alt="Current logo" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor="logo" className="block text-sm font-semibold text-navy-900">Upload a new logo</label>
            <input
              id="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f && f.size > 2 * 1024 * 1024) {
                  setLogoError("Logo must be 2 MB or less.");
                  e.target.value = "";
                  return;
                }
                setLogoError(undefined);
                setLogoFile(f);
              }}
              className="mt-1.5 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            <p className="mt-1 text-xs text-muted">PNG, JPG, or WebP, up to 2 MB. The header is white, so dark-on-white or transparent logos work best.</p>
            {logoError && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{logoError}</p>}
            {currentLogo && (
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={removeLogo} onChange={(e) => setRemoveLogo(e.target.checked)} className="accent-brand" />
                Remove the uploaded logo and go back to the default logo
              </label>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className={card}>
        <legend className="px-1 text-lg font-bold text-navy-900">Contact details</legend>
        <p className="mt-2 text-sm text-muted">Leave a field empty to show the “[to be supplied]” placeholder on the site.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <FormField id="s-email" label="Business email" type="email" registration={register("email")} error={errors.email} />
          <FormField id="s-phone" label="Telephone" registration={register("phone")} error={errors.phone} />
          <FormField id="s-messaging" label="Messaging contact" registration={register("messaging")} error={errors.messaging} hint="e.g. Telegram or WhatsApp number/handle" />
          <FormField id="s-hours" label="Business hours" registration={register("hours")} error={errors.hours} />
          <div className="sm:col-span-2">
            <FormField id="s-address" label="Office address" as="textarea" rows={3} registration={register("address")} error={errors.address} />
          </div>
        </div>
      </fieldset>

      <fieldset className={card}>
        <legend className="px-1 text-lg font-bold text-navy-900">Social links</legend>
        <div className="mt-4 space-y-4">
          {social.fields.map((f, i) => (
            <div key={f.id} className="grid items-start gap-3 sm:grid-cols-[1fr_2fr_auto]">
              <FormField id={`s-social-label-${i}`} label="Label" registration={register(`social.${i}.label`)} error={errors.social?.[i]?.label} />
              <FormField id={`s-social-href-${i}`} label="URL" type="url" registration={register(`social.${i}.href`)} error={errors.social?.[i]?.href} placeholder="https://" />
              <button type="button" onClick={() => social.remove(i)} aria-label={`Remove link ${i + 1}`} className="mt-7 rounded-lg p-2.5 text-muted hover:bg-surface hover:text-red-700">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          {social.fields.length < 6 && (
            <Button type="button" variant="outline" onClick={() => social.append({ label: "", href: "" })}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Add link
            </Button>
          )}
        </div>
      </fieldset>

      <Notice>Only enter details that are confirmed and accurate; they appear publicly in the footer and on the Contact page.</Notice>
      {status.kind === "error" && <ErrorMessage>{status.message}</ErrorMessage>}
      {status.kind === "saved" && (
        <div role="status" className="rounded-lg border border-brand/30 bg-green-50 p-4 text-sm font-medium text-green-900">{status.message}</div>
      )}
      <Button type="submit" loading={status.kind === "saving"}>{status.kind === "saving" ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
