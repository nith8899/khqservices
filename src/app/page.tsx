import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { Section, SectionHeading, Notice } from "@/components/shared/ui";
import {
  EquipmentCategoryCard, IndustryCard, ProcessTimeline, ServiceCard, ValuePropositionCard,
} from "@/components/shared/Cards";
import { QuoteCTA } from "@/components/shared/QuoteCTA";
import {
  equipmentCategories, homeSteps, industries, services, valueProps, SERVICE_AVAILABILITY_NOTE,
} from "@/content/en";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Logistics Company in Cambodia — Freight, Import & Delivery Coordination",
  "KHQ Services coordinates freight, imports, equipment transportation, and business delivery services into Cambodia for manufacturing, IT, and public-sector customers.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <Section id="services">
        <SectionHeading
          eyebrow="Services"
          title="Logistics coordination for business cargo"
          description="Freight, import and export support, documentation, delivery, and project logistics coordinated around your shipment."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
        <div className="mt-8"><Notice>{SERVICE_AVAILABILITY_NOTE}</Notice></div>
      </Section>

      <Section tone="surface" id="industries">
        <SectionHeading
          eyebrow="Industries we serve"
          title="Built around how your industry ships"
          description="Manufacturing, IT, and public-sector cargo each come with different documentation, handling, and delivery requirements."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {industries.map((i) => <IndustryCard key={i.slug} industry={i} />)}
        </div>
      </Section>

      <Section id="how-it-works">
        <SectionHeading eyebrow="How it works" title="From enquiry to delivery in five steps" />
        <div className="mt-10"><ProcessTimeline steps={homeSteps} horizontal /></div>
        <p className="mt-8 text-sm text-muted">
          Quotation, transit time, customs processing, and delivery schedules depend on shipment details and
          service-provider confirmation. <Link className="font-semibold text-brand hover:underline" href="/how-it-works">See the full process</Link>.
        </p>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Our approach"
          title="Why choose KHQ Services?"
          description="This is how we approach each shipment."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((v) => <ValuePropositionCard key={v.title} {...v} />)}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Featured equipment and cargo"
          title="Illustrative cargo categories"
          description="Examples of the equipment and goods our customers typically need coordinated. Handling requirements are confirmed per shipment."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {equipmentCategories.map((c) => <EquipmentCategoryCard key={c.title} {...c} />)}
        </div>
      </Section>

      <QuoteCTA />
    </>
  );
}
