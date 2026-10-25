import type { ServiceItem } from "@/types/content";

export const services: ServiceItem[] = [
  {
    slug: "international-freight-coordination",
    title: "International Freight Coordination",
    icon: "Ship",
    short:
      "Coordinate suitable air, sea, or land freight arrangements through available providers.",
    problem:
      "Choosing between air, sea, and land options while balancing urgency, cargo size, and budget is time-consuming for procurement and project teams.",
    description:
      "We coordinate suitable air, sea, or land freight arrangements through available providers, based on origin, cargo dimensions, urgency, and budget.",
    cargo: [
      "Palletised or crated industrial equipment",
      "Enterprise IT hardware and networking gear",
      "Consolidated commercial supplies",
      "Project cargo with multiple items",
    ],
    requiredInfo: [
      "Origin country and supplier location",
      "Cargo description, dimensions, and weight",
      "Preferred freight method (or 'not sure')",
      "Target delivery date and budget expectations",
    ],
    related: ["import-export-support", "customs-documentation-coordination", "local-transportation-delivery"],
    thirdParty: true,
  },
  {
    slug: "import-export-support",
    title: "Import & Export Support",
    icon: "ArrowLeftRight",
    short:
      "Shipment planning, supplier coordination, and documentation requirements support.",
    problem:
      "Importers often need to coordinate suppliers, paperwork, and service providers at the same time, with little visibility into what is required next.",
    description:
      "We assist customers with shipment planning, supplier coordination, documentation requirements, and relevant service-provider coordination.",
    cargo: [
      "Equipment and components purchased from overseas suppliers",
      "Commercial goods for resale or internal use",
      "Spare parts and replacement units",
    ],
    requiredInfo: [
      "Supplier name and pickup/ship-from location",
      "Pro forma or commercial invoice, if available",
      "Packing list or equipment list",
      "Incoterms agreed with the supplier, if known",
    ],
    related: ["customs-documentation-coordination", "international-freight-coordination"],
    thirdParty: true,
  },
  {
    slug: "customs-documentation-coordination",
    title: "Customs Documentation Coordination",
    icon: "FileCheck",
    short:
      "Coordinate required shipment documents and clearance arrangements with the appropriate authorized provider.",
    problem:
      "Missing or inconsistent shipment documents can delay clearance and delivery.",
    description:
      "We help customers coordinate the required shipment documentation and relevant customs-clearance arrangements with the appropriate authorized provider. KHQ Services is not a customs authority; clearance itself is performed by authorized parties.",
    cargo: [
      "Imported equipment requiring documentation review",
      "Mixed shipments with multiple invoices",
      "Project shipments with equipment lists",
    ],
    requiredInfo: [
      "Commercial/pro forma invoice and packing list",
      "Product descriptions and quantities",
      "Consignee details",
      "Any permits or approvals the customer already holds",
    ],
    related: ["import-export-support", "international-freight-coordination"],
    thirdParty: true,
  },
  {
    slug: "local-transportation-delivery",
    title: "Local Transportation & Delivery",
    icon: "Truck",
    short:
      "Delivery arrangements to your business address, project site, office, warehouse, or facility.",
    problem:
      "Cargo that has arrived still has to reach the right site on time, with the receiving team ready.",
    description:
      "We coordinate suitable delivery arrangements to the agreed business address, project site, office, warehouse, or facility.",
    cargo: [
      "Factory and warehouse deliveries",
      "Office and data-room equipment",
      "Multi-drop deliveries for project sites",
    ],
    requiredInfo: [
      "Delivery address and site contact",
      "Site access or receiving-hour restrictions",
      "Cargo dimensions, weight, and handling needs",
      "Preferred delivery date",
    ],
    related: ["project-logistics", "warehousing-distribution-coordination"],
    thirdParty: true,
  },
  {
    slug: "project-logistics",
    title: "Project Logistics",
    icon: "ClipboardList",
    short:
      "Support for shipments with special scheduling, multiple delivery locations, or project milestones.",
    problem:
      "Projects with phased deliveries, multiple sites, or long equipment lists need a coordinator who can keep the plan organized.",
    description:
      "We support shipments with special scheduling, multiple delivery locations, equipment lists, or project milestones.",
    cargo: [
      "Multi-site equipment rollouts",
      "Data center or infrastructure build-outs",
      "Phased factory equipment installations",
    ],
    requiredInfo: [
      "Equipment list or bill of materials",
      "Project milestones and delivery windows",
      "List of delivery locations and site contacts",
      "Purchase-order or project reference numbers",
    ],
    related: ["local-transportation-delivery", "warehousing-distribution-coordination"],
    thirdParty: false,
    note: "Planning and coordination are performed by KHQ Services; physical transport is arranged through providers.",
  },
  {
    slug: "warehousing-distribution-coordination",
    title: "Warehousing & Distribution Coordination",
    icon: "Warehouse",
    short:
      "Coordinate storage or distribution through available providers when the service is confirmed.",
    problem:
      "Cargo sometimes needs to be held or split before final delivery, but storage options are not always easy to source.",
    description:
      "We coordinate storage or distribution through available providers when the service is confirmed for the relevant location and cargo type.",
    cargo: [
      "Short-term holding before site readiness",
      "Staged distribution to several locations",
      "Consolidation of partial deliveries",
    ],
    requiredInfo: [
      "Storage duration and location needs",
      "Cargo volume and handling requirements",
      "Distribution list and schedule",
    ],
    related: ["local-transportation-delivery", "project-logistics"],
    thirdParty: true,
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export const SERVICE_AVAILABILITY_NOTE =
  "Actual service availability, routes, customs services, warehousing, and transport arrangements are subject to confirmation and may involve third-party providers.";
