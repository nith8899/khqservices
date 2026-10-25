import { z } from "zod";
import { services } from "@/content/en/services";

export const INDUSTRY_OPTIONS = [
  "Manufacturing",
  "IT & Technology",
  "Government & Public Sector",
  "Other",
] as const;

export const FREIGHT_METHODS = ["Air", "Sea", "Land", "Not sure"] as const;

export const CARGO_CATEGORIES = [
  "Industrial machinery and components",
  "Servers and enterprise hardware",
  "Storage and backup appliances",
  "Networking and telecommunications equipment",
  "Server racks, cabinets, and data center equipment",
  "UPS and IT power equipment",
  "Office and institutional equipment",
  "Commercial supplies",
  "Other",
] as const;

export const SERVICE_SLUGS = services.map((s) => s.slug) as [string, ...string[]];

export const ENQUIRY_STATUSES = [
  "New",
  "Under Review",
  "Quotation in Progress",
  "Quotation Sent",
  "Confirmed",
  "In Progress",
  "Delivered",
  "Closed",
  "Cancelled",
] as const;

const optionalText = (max: number) =>
  z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().or(z.literal(""));

/** Disallow control characters (keeps log/email injection surface small). */
const noControlChars = (v: string) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(v);

const requiredText = (label: string, max = 200) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be under ${max} characters.`)
    .refine(noControlChars, `${label} contains invalid characters.`);

const emailField = z
  .string()
  .trim()
  .min(1, "Business email is required.")
  .max(254, "Email address is too long.")
  .pipe(z.email("Please enter a valid email address."));

export const enquirySchema = z.object({
  // A. Customer details
  companyName: requiredText("Company name"),
  contactPerson: requiredText("Contact person"),
  email: emailField,
  phone: requiredText("Telephone or messaging contact", 100),
  industry: z.enum(INDUSTRY_OPTIONS, { error: "Please select an industry." }),

  // B. Shipment details
  cargoDescription: requiredText("Cargo description", 2000),
  cargoCategory: optionalText(120),
  quantity: optionalText(100),
  weight: optionalText(100),
  dimensions: optionalText(200),
  cargoValue: optionalText(100),
  originCountry: requiredText("Country of origin", 100),
  pickupAddress: optionalText(500),
  destinationCountry: requiredText("Destination country", 100),
  deliveryLocation: optionalText(500),
  freightMethod: z.enum(FREIGHT_METHODS).default("Not sure"),
  preferredDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Please enter a valid date.")
    .refine((v) => {
      if (!v) return true;
      const d = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, "Preferred delivery date cannot be in the past."),
  specialHandling: optionalText(1000),
  notes: optionalText(2000),

  // C. Service requirements
  services: z.array(z.enum(SERVICE_SLUGS)).default([]),

  // Anti-abuse / idempotency (not user-visible)
  submissionId: z.string().uuid("Invalid submission id."),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot, must stay empty
  startedAt: z.number().int().nonnegative().optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;

export const contactSchema = z.object({
  name: requiredText("Name", 120),
  company: optionalText(200),
  email: emailField,
  phone: optionalText(100),
  message: requiredText("Message", 3000),
  submissionId: z.string().uuid("Invalid submission id."),
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Minimum time (ms) a human needs to fill a form; faster submissions are treated as bots. */
export const MIN_FILL_MS = 1500;

export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
