import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Notice, Section } from "@/components/shared/ui";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { INDUSTRY_OPTIONS } from "@/lib/validation/enquiry";
import { pageMetadata } from "@/lib/metadata";
import { storageMode } from "@/lib/enquiries/mode";

export const metadata: Metadata = pageMetadata(
  "Request a Quote — Freight & Delivery Coordination in Cambodia",
  "Tell KHQ Services about your cargo, origin, destination, and delivery requirements to receive the next steps for your shipment.",
  "/request-quote",
);

const industryKeys: Record<string, (typeof INDUSTRY_OPTIONS)[number]> = {
  manufacturing: "Manufacturing",
  "it-technology": "IT & Technology",
  government: "Government & Public Sector",
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string | string[] }>;
}) {
  const { industry } = await searchParams;
  const key = Array.isArray(industry) ? industry[0] : industry;
  const defaultIndustry = key ? industryKeys[key] : undefined;

  return (
    <>
      <PageHero
        title="Request a Quote"
        description="Tell us about your cargo, origin, destination, and delivery requirements. Our team can review the details and respond with the next steps."
        breadcrumbs={[{ label: "Request a Quote" }]}
      />
      <Section tone="surface">
        <div className="mx-auto max-w-3xl">
          {storageMode() === "demo" && (
            <div className="mb-6">
              <Notice tone="warning" title="Demo mode">
                Enquiry storage is not enabled on this site. You can try the form, but submissions will not be
                stored or sent.
              </Notice>
            </div>
          )}
          <QuoteForm defaultIndustry={defaultIndustry} />
        </div>
      </Section>
    </>
  );
}
