import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink, Notice, Section, SectionHeading } from "@/components/shared/ui";
import { QuoteCTA } from "@/components/shared/QuoteCTA";
import { CheckList, FeatureGrid } from "@/components/industries/IndustrySections";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Industrial Logistics Cambodia — Manufacturing & Industry",
  "Logistics coordination for industrial machinery, production components, spare parts, and commercial materials moving into Cambodia.",
  "/industries/manufacturing",
);

const focus = [
  { icon: "Cog", title: "Industrial machinery and equipment", text: "Production equipment and machinery shipments planned around dimensions and site access." },
  { icon: "Boxes", title: "Manufacturing components and spare parts", text: "Recurring and urgent component shipments for production lines." },
  { icon: "Package", title: "Factory supplies and commercial materials", text: "Consumables and materials needed to keep operations running." },
  { icon: "Truck", title: "Supplier pickup and shipment coordination", text: "Coordinating pickup with your supplier and the chosen freight arrangement." },
  { icon: "Factory", title: "Factory, warehouse, and project-site delivery", text: "Delivery arrangements to the agreed facility or project location." },
  { icon: "FileCheck", title: "Import documentation coordination", text: "Help organizing documents with the appropriate authorized providers." },
  { icon: "CalendarCheck", title: "Project shipment scheduling", text: "Phased or multi-shipment plans aligned to installation milestones." },
];

export default function ManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing & Industrial"
        title="Logistics Solutions for Manufacturing & Industry"
        description="Support the movement of industrial equipment, production components, spare parts, and commercial materials through coordinated shipping and delivery arrangements."
        breadcrumbs={[{ label: "Industries" }, { label: "Manufacturing & Industrial" }]}
        actions={<ButtonLink href="/request-quote?industry=manufacturing" arrow>Request an Industrial Logistics Quote</ButtonLink>}
      />
      <Section>
        <SectionHeading title="What we help coordinate" />
        <div className="mt-10"><FeatureGrid items={focus} /></div>
      </Section>
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            title="What we need to quote industrial cargo"
            description="The more complete the details, the faster we can assess arrangements with the relevant providers."
          />
          <CheckList
            items={[
              "Cargo type",
              "Quantity and packaging",
              "Dimensions and weight",
              "Pickup and delivery locations",
              "Cargo value, when relevant",
              "Handling requirements",
              "Target delivery date",
            ]}
          />
        </div>
        <div className="mt-8">
          <Notice title="Special cargo">
            Dangerous goods, oversized or heavy-lift cargo, and temperature-controlled shipments are not offered as
            standard capabilities on this site. If your cargo has special requirements, describe them in your
            enquiry and we will confirm what can be arranged.
          </Notice>
        </div>
      </Section>
      <QuoteCTA
        title="Moving industrial equipment or materials?"
        buttonLabel="Request an Industrial Logistics Quote"
        href="/request-quote?industry=manufacturing"
      />
    </>
  );
}
