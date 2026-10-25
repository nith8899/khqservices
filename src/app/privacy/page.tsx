import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/shared/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata(
  "Privacy Policy",
  "How KHQ Services collects, uses, stores, and protects enquiry information and uploaded documents.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <LegalPage
      breadcrumb="Privacy Policy"
      title="Privacy Policy"
      intro={`How ${siteConfig.name} handles information you share through this website.`}
      sections={[
        {
          heading: "Information collected",
          body: (
            <p>
              When you submit a quote request or contact form we collect the details you provide: company name,
              contact person, business email, telephone or messaging contact, industry, shipment details, notes, and
              any documents you upload (for example a BOM, packing list, or pro forma invoice).
            </p>
          ),
        },
        {
          heading: "How enquiries are processed",
          body: (
            <p>
              Enquiries are used to assess your request, prepare a quotation, and communicate with you about your
              shipment. Where needed, relevant shipment details may be shared with logistics service providers to
              obtain arrangements for your cargo.
            </p>
          ),
        },
        {
          heading: "How uploaded documents are handled",
          body: (
            <p>
              Uploaded documents are checked for allowed types and size and stored privately. They are not published
              at any public web address and are not attached to notification emails. They are not sent to
              third-party services without your authorization, except to providers involved in your shipment where
              you have asked us to proceed. [Confirm storage location and provider before launch.]
            </p>
          ),
        },
        {
          heading: "Data retention",
          body: <p>[Retention period to be defined by {siteConfig.name} and confirmed by legal review.]</p>,
        },
        {
          heading: "Access controls",
          body: (
            <p>
              Access to enquiry data and documents is limited to authorized {siteConfig.name} personnel. This website
              provides no public way to list or download enquiries or documents.
            </p>
          ),
        },
        {
          heading: "Third-party service use",
          body: (
            <p>
              We may use third-party services such as an email delivery provider and hosting provider to operate the
              website and respond to enquiries. [List the actual providers once selected.]
            </p>
          ),
        },
        {
          heading: "Contact for privacy questions",
          body: (
            <p>
              {siteConfig.privacyContactNote} See the <Link className="font-semibold text-brand hover:underline" href="/contact">Contact page</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
