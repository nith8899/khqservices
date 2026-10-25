import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Icon } from "@/components/shared/Icon";
import { ButtonLink, Notice, Section } from "@/components/shared/ui";
import { QuoteCTA } from "@/components/shared/QuoteCTA";
import { SERVICE_AVAILABILITY_NOTE, serviceBySlug, services } from "@/content/en";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Freight Forwarding & Logistics Services in Cambodia",
  "International freight coordination, import and export support, customs documentation coordination, local delivery, project logistics, and warehousing coordination for Cambodia.",
  "/services",
);

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Logistics Services"
        description="Six coordination services for businesses moving equipment, materials, and commercial goods into Cambodia."
        breadcrumbs={[{ label: "Services" }]}
        actions={<ButtonLink href="/request-quote" arrow>Request a Quote</ButtonLink>}
      />
      <Section tone="surface" className="!py-8">
        <Notice title="Service availability">{SERVICE_AVAILABILITY_NOTE}</Notice>
        <nav aria-label="Services on this page" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="inline-block rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-navy-800 hover:border-brand hover:text-brand">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      {services.map((s, idx) => (
        <Section key={s.slug} id={s.slug} tone={idx % 2 === 0 ? "white" : "surface"}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon name={s.icon} className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">{s.title}</h2>
              <p className="mt-4 leading-relaxed">{s.description}</p>
              <p className="mt-4 rounded-lg bg-white/60 text-sm font-medium text-navy-800">
                {s.thirdParty
                  ? "Depends on third-party providers and their confirmation."
                  : s.note}
              </p>
              <div className="mt-6"><ButtonLink href="/request-quote" arrow>Request a Quote</ButtonLink></div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Block title="The problem it addresses"><p className="text-sm leading-relaxed">{s.problem}</p></Block>
              <Block title="Typical cargo and use cases"><Checks items={s.cargo} /></Block>
              <Block title="Information needed for a quotation"><Checks items={s.requiredInfo} /></Block>
              <Block title="Related services">
                <ul className="space-y-2 text-sm">
                  {s.related.map((r) => {
                    const rs = serviceBySlug(r);
                    return rs && (
                      <li key={r}><a className="font-medium text-brand hover:underline" href={`#${r}`}>{rs.title}</a></li>
                    );
                  })}
                </ul>
              </Block>
            </div>
          </div>
        </Section>
      ))}

      <Section>
        <p className="text-center text-sm text-muted">
          Looking for industry-specific guidance? See{" "}
          <Link className="font-semibold text-brand hover:underline" href="/industries/manufacturing">Manufacturing</Link>,{" "}
          <Link className="font-semibold text-brand hover:underline" href="/industries/it-technology">IT &amp; Technology</Link>, and{" "}
          <Link className="font-semibold text-brand hover:underline" href="/industries/government">Government &amp; Public Sector</Link>.
        </p>
      </Section>
      <QuoteCTA />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-card">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy-800">{title}</h3>
      {children}
    </div>
  );
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((i) => (
        <li key={i} className="flex gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
