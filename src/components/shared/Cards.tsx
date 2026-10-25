import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "./Icon";
import type { IndustryItem, ProcessStep, ServiceItem } from "@/types/content";

const card =
  "group flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover";

const iconWrap = "flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className={card}>
      <div className={iconWrap}>
        <Icon name={service.icon} className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.short}</p>
      <Link
        href={`/services#${service.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
      >
        Learn More<span className="sr-only"> about {service.title}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

export function IndustryCard({ industry }: { industry: IndustryItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-[16/9] bg-navy-900">
        <Image
          src={industry.image}
          alt={industry.imageAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon name={industry.icon} className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-semibold">{industry.title}</h3>
        </div>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{industry.short}</p>
        <Link
          href={industry.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Explore {industry.title}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function EquipmentCategoryCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-xl border border-line bg-white p-5 shadow-card">
      <div className={`${iconWrap} h-11 w-11 shrink-0`}>
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}

export function ValuePropositionCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <div className={iconWrap}>
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

/** Vertical on mobile; horizontal on desktop when `horizontal` is set (best for ≤5 steps). */
export function ProcessTimeline({
  steps,
  showCustomerBadges = false,
  horizontal = false,
}: {
  steps: ProcessStep[];
  showCustomerBadges?: boolean;
  horizontal?: boolean;
}) {
  return (
    <>
      <ol className={horizontal ? "space-y-6 lg:hidden" : "space-y-6"}>
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <Node i={i} last={i === steps.length - 1} />
            <StepBody step={step} badge={showCustomerBadges} />
          </li>
        ))}
      </ol>
      {horizontal && (
        <ol
          className="hidden gap-6 lg:grid"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <div className="flex items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                {i < steps.length - 1 && <span className="ml-2 h-px flex-1 bg-line" aria-hidden="true" />}
              </div>
              <div className="mt-4 pr-2">
                <StepBody step={step} badge={showCustomerBadges} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function Node({ i, last }: { i: number; last: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
        {i + 1}
      </span>
      {!last && <span className="mt-1 w-px flex-1 bg-line" aria-hidden="true" />}
    </div>
  );
}

function StepBody({ step, badge }: { step: ProcessStep; badge: boolean }) {
  return (
    <div className="pb-2">
      <h3 className="font-semibold leading-snug">{step.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
      {badge && step.customerAction && (
        <span className="mt-2 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
          Customer approval / input
        </span>
      )}
    </div>
  );
}
