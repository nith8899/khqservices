import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/shared/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata(
  "Terms of Service",
  "Terms covering enquiries, quotations, service confirmation, third-party providers, and cargo documentation for KHQ Services.",
  "/terms",
);

export default function TermsPage() {
  return (
    <LegalPage
      breadcrumb="Terms of Service"
      title="Terms of Service"
      intro={`Terms that apply to enquiries and use of the ${siteConfig.name} website.`}
      sections={[
        {
          heading: "Enquiry and quotation conditions",
          body: (
            <p>
              Submitting an enquiry does not create a booking or contract. A quotation is valid only for the period
              and conditions stated in it, and depends on the accuracy of the information you provide.
            </p>
          ),
        },
        {
          heading: "Service confirmation",
          body: <p>Services are arranged only after you confirm a quotation and {siteConfig.name} confirms in writing.</p>,
        },
        {
          heading: "Third-party logistics providers",
          body: (
            <p>
              Some services, such as freight, customs clearance, storage, and local transport, may be performed by
              third-party providers. Their terms may apply in addition to these terms. [Provider terms to be added.]
            </p>
          ),
        },
        {
          heading: "Cargo documentation responsibilities",
          body: (
            <p>
              Customers are responsible for the accuracy and completeness of cargo descriptions, values, and
              documents they supply, and for any permits or licences their cargo requires.
            </p>
          ),
        },
        {
          heading: "Shipment estimates and dependencies",
          body: (
            <p>
              Prices, transit times, customs processing, and delivery dates are estimates that depend on provider
              confirmation, cargo details, and external factors. They are not guarantees unless confirmed in writing.
            </p>
          ),
        },
        {
          heading: "Claims and liability",
          body: <p>[Claims procedure, liability limits, and insurance terms to be defined and approved through legal review.]</p>,
        },
        {
          heading: "Privacy and contact",
          body: (
            <p>
              See our <Link className="font-semibold text-brand hover:underline" href="/privacy">Privacy Policy</Link> and
              the <Link className="font-semibold text-brand hover:underline" href="/contact">Contact page</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
