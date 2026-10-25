import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink, Notice, Section, SectionHeading } from "@/components/shared/ui";
import { QuoteCTA } from "@/components/shared/QuoteCTA";
import { FeatureGrid } from "@/components/industries/IndustrySections";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Logistics for Public-Sector & Institutional Projects in Cambodia",
  "Structured logistics and delivery coordination for institutional equipment, public-sector project supplies, and business-to-government project requirements in Cambodia.",
  "/industries/government",
);

const items = [
  { icon: "Monitor", title: "Office and institutional equipment delivery", text: "Delivery of furniture, devices, and equipment to institutional sites." },
  { icon: "Server", title: "Computers and IT infrastructure", text: "Coordinated shipping for computers, networking, and supporting hardware." },
  { icon: "Layers", title: "Multi-location delivery planning", text: "Splitting and scheduling deliveries across several sites." },
  { icon: "CalendarCheck", title: "Project shipment scheduling", text: "Schedules aligned to project milestones and site readiness." },
  { icon: "FileText", title: "Packing lists and delivery notes", text: "Organized shipment paperwork for receiving teams." },
  { icon: "ClipboardList", title: "Purchase-order and reference-number handling", text: "PO and project references carried through shipment records." },
  { icon: "FileCheck", title: "Proof-of-delivery coordination", text: "Coordinating signed delivery records with the receiving party." },
  { icon: "FolderCheck", title: "Documentation handover", text: "Handing over relevant shipment documents at completion." },
];

export default function GovernmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Government & Public Sector"
        title="Logistics Coordination for Institutional & Public-Sector Projects"
        description="Structured logistics and delivery coordination for institutional equipment, public-sector project supplies, and business-to-government project requirements."
        breadcrumbs={[{ label: "Industries" }, { label: "Government & Public Sector" }]}
        actions={<ButtonLink href="/request-quote?industry=government" arrow>Discuss Your Project Requirements</ButtonLink>}
      />
      <Section>
        <SectionHeading title="What we help coordinate" />
        <div className="mt-10"><FeatureGrid items={items} columns={2} /></div>
        <div className="mt-8">
          <Notice title="Requirements depend on your project">
            Requirements depend on the relevant procurement rules, project terms, and customer instructions. We
            work to the documentation and delivery instructions you provide.
          </Notice>
        </div>
      </Section>
      <QuoteCTA
        title="Planning an institutional or public-sector delivery?"
        text="Share your equipment list, delivery locations, and documentation needs. We will review the details and respond with the next steps."
        buttonLabel="Discuss Your Project Requirements"
        href="/request-quote?industry=government"
      />
    </>
  );
}
