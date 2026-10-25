import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: FieldError | { message?: string };
  registration: UseFormRegisterReturn;
}

type Props =
  | (BaseProps & { as?: "input"; type?: string; placeholder?: string; autoComplete?: string; min?: string })
  | (BaseProps & { as: "textarea"; rows?: number; placeholder?: string })
  | (BaseProps & { as: "select"; options: readonly string[]; placeholderOption?: string });

const control =
  "mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function FormField(props: Props) {
  const { id, label, required, hint, error, registration } = props;
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const cls = `${control} ${error ? "border-red-500" : "border-line"}`;
  const common = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
    ...registration,
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-600" aria-hidden="true"> *</span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {props.as === "textarea" ? (
        <textarea {...common} rows={props.rows ?? 4} placeholder={props.placeholder} className={cls} />
      ) : props.as === "select" ? (
        <select {...common} className={cls} defaultValue="">
          <option value="">{props.placeholderOption ?? "Select…"}</option>
          {props.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          min={props.min}
          className={cls}
        />
      )}
      {hint && <p id={hintId} className="mt-1 text-xs text-muted">{hint}</p>}
      {error?.message && (
        <p id={errId} className="mt-1 text-xs font-medium text-red-700">{error.message}</p>
      )}
    </div>
  );
}
