import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink, Notice, Section } from "@/components/shared/ui";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactDetails } from "@/components/shared/ContactDetails";
import { pageMetadata } from "@/lib/metadata";
import { storageMode } from "@/lib/enquiries/mode";

export const metadata: Metadata = pageMetadata(
  "Contact KHQ Services — Logistics Company in Cambodia",
  "Contact KHQ Services for general enquiries about freight, import support, and business delivery services in Cambodia.",
  "/contact",
);

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        description="For general enquiries, send us a message. For a shipment quotation, use the Request a Quote form."
        breadcrumbs={[{ label: "Contact" }]}
        actions={<ButtonLink href="/request-quote" arrow>Request a Quote</ButtonLink>}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">Send a general enquiry</h2>
            {storageMode() === "demo" && (
              <div className="mt-4">
                <Notice tone="warning" title="Demo mode">Enquiry storage is not enabled; messages will not be stored or sent.</Notice>
              </div>
            )}
            <div className="mt-6"><ContactForm /></div>
          </div>
          <aside className="h-fit rounded-xl border border-line bg-surface p-6">
            <h2 className="text-xl font-bold">Company details</h2>
            <div className="mt-5"><ContactDetails /></div>
            <p className="mt-6 text-xs text-muted">
              Placeholders in [brackets] will be replaced once the company details are confirmed.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
