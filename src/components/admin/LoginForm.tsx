"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorMessage } from "@/components/shared/ui";

const input =
  "mt-1.5 block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (res.ok && json.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(json.message ?? "Sign-in failed.");
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-semibold text-navy-900">Username</label>
        <input id="username" name="username" autoComplete="username" required className={input} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-navy-900">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit" loading={busy} className="w-full">Sign in</Button>
    </form>
  );
}
