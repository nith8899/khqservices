import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHero({
  title,
  description,
  breadcrumbs,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white">
      <div className="container-page py-14 sm:py-20">
        <Breadcrumbs items={breadcrumbs} />
        {eyebrow && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-2" : "mt-6"} max-w-4xl text-3xl font-bold leading-tight tracking-tight !text-white sm:text-5xl`}>
          {title}
        </h1>
        {description && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">{description}</p>}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
