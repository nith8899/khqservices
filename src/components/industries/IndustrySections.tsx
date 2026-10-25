import { Check } from "lucide-react";
import { Icon } from "@/components/shared/Icon";

export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: { icon?: string; title: string; text?: string }[];
  columns?: 2 | 3;
}) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((it) => (
        <div key={it.title} className="flex gap-4 rounded-xl border border-line bg-white p-5 shadow-card">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            {it.icon ? <Icon name={it.icon} className="h-5 w-5" /> : <Check className="h-5 w-5" aria-hidden="true" />}
          </span>
          <div>
            <h3 className="font-semibold">{it.title}</h3>
            {it.text && <p className="mt-1 text-sm leading-relaxed text-muted">{it.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CheckList({ items, title }: { items: string[]; title?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6 shadow-card">
      {title && <h3 className="mb-4 font-semibold">{title}</h3>}
      <ul className="space-y-2.5 text-sm">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
