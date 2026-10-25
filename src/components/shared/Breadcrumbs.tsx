import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items, light = true }: { items: { label: string; href?: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-white/70" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li><Link href="/" className="hover:underline">Home</Link></li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:underline">{item.label}</Link>
            ) : (
              <span aria-current="page" className={light ? "text-white" : "text-navy-900"}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
