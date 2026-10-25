import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink, Notice, Section, SectionHeading } from "@/components/shared/ui";
import { ProcessTimeline } from "@/components/shared/Cards";
import { QuoteCTA } from "@/components/shared/QuoteCTA";
import { journeySteps } from "@/content/en";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "How Our Freight & Import Coordination Process Works",
  "From enquiry to delivery handover: the eight steps KHQ Services follows to coordinate freight, import support, and business deliveries in Cambodia.",
  "/how-it-works",
);

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        title="How It Works"
        description="The customer journey from your first enquiry to delivery and documentation handover."
        breadcrumbs={[{ label: "How It Works" }]}
        actions={<ButtonLink href="/request-quote" arrow>Request a Quote</ButtonLink>}
      />
      <Section>
        <SectionHeading
          title="Eight steps, with your approval where it matters"
          description="Steps marked below need your input or approval. Nothing is arranged until you confirm the quotation."
        />
        <div className="mt-10 max-w-3xl">
          <ProcessTimeline steps={journeySteps} showCustomerBadges />
        </div>
        <div className="mt-10 max-w-3xl">
          <Notice title="Timing and cost depend on your shipment">
            Quotation, transit time, customs processing, and delivery schedules depend on the shipment details and
            service-provider confirmation. Any estimate we share is not a guarantee until confirmed in writing.
          </Notice>
        </div>
      </Section>
      <QuoteCTA />
    </>
  );
}
