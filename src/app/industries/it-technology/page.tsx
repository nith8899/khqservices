import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileSpreadsheet, FileText, ListChecks, ReceiptText } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ButtonLink, Notice, Section, SectionHeading } from "@/components/shared/ui";
import { QuoteCTA } from "@/components/shared/QuoteCTA";
import { Icon } from "@/components/shared/Icon";
import { CheckList, FeatureGrid } from "@/components/industries/IndustrySections";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "IT Equipment Shipping & Server Delivery in Cambodia",
  "Coordinated shipping and delivery for servers, storage, networking, racks, data center equipment, and IT infrastructure projects in Cambodia.",
  "/industries/it-technology",
);

const categories = [
  { icon: "Server", title: "Servers and enterprise hardware", text: "Rack and tower servers and related enterprise components." },
  { icon: "HardDrive", title: "Storage systems and backup appliances", text: "Storage arrays, NAS/SAN equipment, and backup appliances." },
  { icon: "Router", title: "Network switches, routers, and firewalls", text: "Core, distribution, and edge networking and security equipment." },
  { icon: "Boxes", title: "Server racks and cabinets", text: "Racks, cabinets, and accessories, which are often large and heavy." },
  { icon: "Cpu", title: "Data center equipment", text: "Cooling, PDUs, cabling, and other data center components." },
  { icon: "BatteryCharging", title: "UPS and related IT power equipment", text: "UPS units and power equipment for IT rooms." },
];

const customers = [
  "IT distributors",
  "System integrators",
  "Enterprise IT teams",
  "Data center operators",
  "Technology resellers",
  "Infrastructure project contractors",
];

const considerations = [
  "Supplier pickup coordination",
  "Cargo dimensions and weight confirmation",
  "Packaging and handling requirements",
  "Shipment documentation",
  "Import and customs coordination",
  "Delivery scheduling",
  "Coordination with site receiving teams",
  "Delivery records and shipment updates",
];

const docs = [
  { icon: ListChecks, title: "Bill of materials (BOM)", text: "Part numbers, descriptions, and quantities for the full order." },
  { icon: FileText, title: "Packing list", text: "Cartons/pallets, weights, and dimensions as packed by the supplier." },
  { icon: ReceiptText, title: "Pro forma invoice", text: "Item values and supplier details for quotation and documentation." },
  { icon: FileSpreadsheet, title: "Equipment list", text: "Model-level list when a BOM is not yet available." },
];

export default function ITTechnologyPage() {
  return (
    <>
      <div className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Breadcrumbs items={[{ label: "Industries" }, { label: "IT & Technology" }]} />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-accent">IT &amp; Technology</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight !text-white sm:text-5xl">
              IT Infrastructure Logistics for Cambodia
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Coordinated shipping and delivery for enterprise technology, data center equipment, and IT
              infrastructure projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/request-quote?industry=it-technology" arrow>Request an IT Hardware Shipping Quote</ButtonLink>
              <ButtonLink href="#bom" variant="ghost-light">How to share your BOM</ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/15 shadow-card-hover">
            <Image
              src="/images/it-racks.svg"
              alt="Stylised illustration of server racks with status lights"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow="Equipment categories"
          title="Hardware we help coordinate"
          description="Categories reflect the equipment our customers typically need moved. Handling requirements are confirmed per shipment."
        />
        <div className="mt-10"><FeatureGrid items={categories} /></div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who we work with" title="Built for technology buyers and project teams" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {customers.map((c) => (
                <li key={c} className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-navy-800">
                  <Icon name="Briefcase" className="h-4 w-4 text-brand" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <CheckList title="Service considerations for IT shipments" items={considerations} />
        </div>
      </Section>

      <Section id="bom">
        <SectionHeading
          eyebrow="Getting a quotation"
          title="Submit your BOM, packing list, or equipment list"
          description="Attach what you have when you request a quote. A complete document set lets us assess arrangements faster and ask fewer follow-up questions."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map(({ icon: I, title, text }) => (
            <div key={title} className="rounded-xl border border-line bg-white p-5 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <I className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Accepted formats: PDF, Excel, CSV, Word, PNG, JPG. Uploaded documents are stored privately and are not
          shared with third parties without your authorization. See our{" "}
          <Link href="/privacy" className="font-semibold text-brand hover:underline">Privacy Policy</Link>.
        </p>
        <div className="mt-8">
          <Notice title="What is and is not promised">
            Specialised handling, insurance, secure chain-of-custody, anti-static packaging, customs clearance, and
            tracking are not assumed. If your shipment needs any of these, include it in your enquiry and we will
            confirm whether it can be arranged and through which provider.
          </Notice>
        </div>
      </Section>

      <QuoteCTA
        title="Shipping IT hardware to Cambodia?"
        text="Share your equipment list, supplier location, and delivery site. We will review the details and respond with the next steps."
        buttonLabel="Request an IT Hardware Shipping Quote"
        href="/request-quote?industry=it-technology"
      />
    </>
  );
}
