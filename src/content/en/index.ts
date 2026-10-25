import type { IndustryItem, NavLink, ProcessStep } from "@/types/content";
import { services } from "./services";

export { services, serviceBySlug, SERVICE_AVAILABILITY_NOTE } from "./services";

export const industries: IndustryItem[] = [
  {
    slug: "manufacturing",
    title: "Manufacturing & Industrial",
    icon: "Factory",
    short:
      "Logistics coordination for machinery, production equipment, spare parts, components, and industrial supplies.",
    href: "/industries/manufacturing",
    image: "/images/industrial.svg",
    imageAlt: "Illustration of industrial equipment and shipping crates",
  },
  {
    slug: "it-technology",
    title: "IT & Technology",
    icon: "Server",
    short:
      "Import and delivery coordination for servers, storage systems, networking equipment, backup appliances, and enterprise IT infrastructure.",
    href: "/industries/it-technology",
    image: "/images/it-racks.svg",
    imageAlt: "Illustration of server racks and networking equipment",
  },
  {
    slug: "government",
    title: "Government & Public Sector",
    icon: "Landmark",
    short:
      "Structured delivery coordination and documentation support for institutional equipment and public-sector projects.",
    href: "/industries/government",
    image: "/images/institutional.svg",
    imageAlt: "Illustration of an institutional building and delivery documents",
  },
];

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      label: s.title,
      href: `/services#${s.slug}`,
      description: s.short,
    })),
  },
  {
    label: "Industries",
    href: "/industries/manufacturing",
    children: industries.map((i) => ({ label: i.title, href: i.href, description: i.short })),
  },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
];

export const homeSteps: ProcessStep[] = [
  { title: "Submit your shipment requirements", description: "Tell us what you need to move and where." },
  { title: "Share cargo and supplier information", description: "Provide cargo details and supplier contacts." },
  { title: "Receive a quotation and proposed arrangements", description: "We review the details and propose arrangements." },
  { title: "Confirm the shipment and coordinate transportation", description: "You approve; we coordinate with the relevant providers." },
  { title: "Receive delivery updates and documentation", description: "Updates and relevant documents are shared as the shipment progresses." },
];

export const journeySteps: ProcessStep[] = [
  {
    title: "Enquiry submission",
    description: "You submit the Request a Quote form with your cargo, origin, destination, and requirements.",
    customerAction: true,
  },
  {
    title: "Cargo information review",
    description:
      "We review the details and may ask for clarifications such as dimensions, weight, packaging, or a packing list.",
  },
  {
    title: "Route and service assessment",
    description:
      "We assess possible routes and arrangements with relevant service providers, depending on availability.",
  },
  {
    title: "Quotation preparation",
    description:
      "We prepare a quotation and proposed arrangements based on the confirmed details and provider responses.",
  },
  {
    title: "Customer confirmation",
    description: "You review the quotation and confirm if you wish to proceed. Nothing is arranged before you approve.",
    customerAction: true,
  },
  {
    title: "Supplier and shipping coordination",
    description:
      "We coordinate supplier pickup, shipping, and documentation with the relevant parties. You may be asked to provide or approve documents.",
    customerAction: true,
  },
  {
    title: "Shipment updates",
    description: "We share shipment updates as information is received from the relevant parties.",
  },
  {
    title: "Delivery and documentation handover",
    description:
      "The shipment is delivered to the agreed address and relevant delivery documentation is handed over where available. The receiving team confirms receipt.",
    customerAction: true,
  },
];

export const valueProps = [
  { icon: "Layers", title: "Flexible logistics coordination", text: "Arrangements are shaped around your cargo and timeline rather than a fixed package." },
  { icon: "Factory", title: "Industry-specific shipment requirements", text: "Manufacturing, IT, and institutional cargo each have different documentation and handling needs." },
  { icon: "MessageSquareText", title: "Clear quotation and communication process", text: "A defined enquiry-to-quotation process with responsive communication." },
  { icon: "FileText", title: "Practical documentation support", text: "Help organizing the shipment documents that providers and receivers typically ask for." },
  { icon: "CalendarCheck", title: "Delivery planning based on project needs", text: "Scheduling that reflects site readiness, milestones, and multiple locations." },
  { icon: "Handshake", title: "Coordination with relevant service partners", text: "Freight, customs, and delivery providers coordinated on your behalf where needed." },
];

export const heroValueProps = [
  { icon: "Briefcase", label: "Business-focused logistics" },
  { icon: "Shuffle", label: "Flexible shipping coordination" },
  { icon: "FolderCheck", label: "Organized delivery documentation" },
];

export const equipmentCategories = [
  { icon: "Cog", title: "Industrial machinery and components", text: "Production equipment, spare parts, and components." },
  { icon: "Server", title: "Enterprise servers and storage", text: "Rack servers, storage arrays, and related hardware." },
  { icon: "Network", title: "Networking and telecommunications equipment", text: "Switches, routers, firewalls, and wireless equipment." },
  { icon: "HardDrive", title: "Backup appliances and IT infrastructure", text: "Backup systems and supporting infrastructure." },
  { icon: "Monitor", title: "Office and institutional equipment", text: "Computers, peripherals, and furnishings for institutions." },
  { icon: "Boxes", title: "Commercial supplies", text: "General business goods and consumable supplies." },
];
