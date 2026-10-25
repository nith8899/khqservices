"use client";

import { Button } from "@/components/shared/ui";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">An unexpected error occurred. Please try again.</p>
      <div className="mt-8"><Button onClick={reset}>Try again</Button></div>
    </div>
  );
}
