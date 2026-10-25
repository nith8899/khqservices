import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Notice, Section, SectionHeading } from "@/components/shared/ui";
import { IndustryCard, ValuePropositionCard } from "@/components/shared/Cards";
import { QuoteCTA } from "@/components/shared/QuoteCTA";
import { industries, valueProps } from "@/content/en";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "About KHQ Services — Logistics Coordination in Cambodia",
  "KHQ Services supports businesses and organizations with practical logistics coordination across manufacturing, IT and technology, and public-sector projects.",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About KHQ Services"
        description="KHQ Services supports businesses and organizations with practical logistics coordination across manufacturing, IT and technology, and public-sector projects."
        breadcrumbs={[{ label: "About Us" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title="Company introduction" />
            <p className="mt-4 leading-relaxed">
              KHQ Services is a Cambodia-focused B2B logistics and supply-chain coordination business. We help
              customers plan and coordinate the movement of equipment, materials, and commercial goods, with
              responsive communication and organized delivery documentation.
            </p>
            <p className="mt-4 text-sm italic text-muted">
              [Company background details — founding year, registration, team — to be supplied by KHQ Services.]
            </p>
          </div>
          <div className="rounded-xl bg-surface p-8">
            <h2 className="text-xl font-bold">Our mission</h2>
            <p className="mt-3 text-lg leading-relaxed">
              To simplify business logistics through responsive coordination, practical planning, and clear
              communication.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Service approach" title="How we work with customers" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((v) => <ValuePropositionCard key={v.title} {...v} />)}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Industries served" title="Three sectors, one coordination approach" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {industries.map((i) => <IndustryCard key={i.slug} industry={i} />)}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading title="Operating model" />
            <p className="mt-4 leading-relaxed">
              KHQ Services coordinates shipments: we gather your requirements, assess options, prepare a quotation,
              and coordinate the chosen arrangements. Transportation, freight, customs clearance, storage, and
              similar services may be performed by qualified third-party providers.
            </p>
          </div>
          <div>
            <SectionHeading title="Partner coordination" />
            <p className="mt-4 leading-relaxed">
              We work with relevant service partners where a shipment requires them. The partners involved in your
              shipment will depend on the route, cargo, and services confirmed in your quotation.
            </p>
            <div className="mt-5">
              <Notice>
                KHQ Services is not presented here as a carrier, customs authority, or asset-owning transport
                operator. Details of owned assets, licences, certifications, and partner agreements will be added
                only once verified.
              </Notice>
            </div>
          </div>
        </div>
      </Section>

      <QuoteCTA
        title="Talk to us about your next shipment"
        text="Tell us about your cargo and delivery requirements. Our team can review the details and respond with the next steps."
      />
    </>
  );
}
