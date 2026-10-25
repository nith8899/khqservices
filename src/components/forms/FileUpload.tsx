"use client";

import { useId, useRef } from "react";
import { FileText, Upload, X } from "lucide-react";
import { UPLOAD_DEFAULTS } from "@/config/site";
import { precheckFile } from "@/lib/validation/files";

export function FileUpload({
  files,
  onChange,
  error,
  onError,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
  onError: (message: string | undefined) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { maxFiles, maxFileMB, allowedExtensions } = UPLOAD_DEFAULTS;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      const check = precheckFile(f);
      if (!check.ok) return onError(check.error);
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
      if (next.length >= maxFiles) return onError(`You can upload up to ${maxFiles} files.`);
      next.push(f);
    }
    onError(undefined);
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
        Supporting documents <span className="ml-1 text-xs font-normal text-muted">(optional)</span>
      </label>
      <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
        BOM, packing list, pro forma invoice, or cargo specifications. Up to {maxFiles} files, {maxFileMB} MB each.
        Accepted: {allowedExtensions.join(", ").toUpperCase()}.
      </p>
      <div className="mt-2 flex items-center gap-3 rounded-lg border-2 border-dashed border-line bg-surface p-4">
        <Upload className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept={allowedExtensions.map((e) => `.${e}`).join(",")}
          onChange={(e) => addFiles(e.target.files)}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800"
        />
      </div>
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-red-700">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li key={`${f.name}-${f.size}`} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 text-xs text-muted">{(f.size / 1024).toFixed(0)} KB</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((x) => x !== f))}
                aria-label={`Remove ${f.name}`}
                className="rounded p-1 text-muted hover:bg-surface hover:text-red-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
