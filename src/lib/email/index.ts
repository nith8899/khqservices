import { siteConfig } from "@/config/site";

export type EmailResult = "sent" | "skipped" | "failed";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

const resendConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
const smtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_FROM);

/** Resend (HTTPS API, works on Cloudflare Workers) or SMTP (Node hosts). */
export function emailConfigured(): boolean {
  return resendConfigured() || smtpConfigured();
}

async function sendViaResend(msg: EmailMessage): Promise<EmailResult> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      reply_to: msg.replyTo,
    }),
  });
  return res.ok ? "sent" : "failed";
}

/**
 * Sends via SMTP when configured. Never reports "sent" unless the provider
 * accepted the message. When SMTP is not configured the result is "skipped"
 * (development fallback) and nothing is logged beyond a generic notice.
 * Message bodies and attachments are never logged.
 */
export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  if (!emailConfigured()) return "skipped";
  try {
    if (resendConfigured()) return await sendViaResend(msg);
    const { default: nodemailer } = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
      replyTo: msg.replyTo,
    });
    return info.accepted && info.accepted.length > 0 ? "sent" : "failed";
  } catch {
    console.error("[email] delivery failed"); // no recipient/body details
    return "failed";
  }
}

const line = (label: string, value: unknown) =>
  value === undefined || value === "" || value === null ? "" : `${label}: ${String(value)}\n`;

export function buildInternalNotification(
  reference: string,
  data: Record<string, unknown>,
  fileNames: string[],
): { subject: string; text: string } {
  const text =
    `New enquiry received — ${reference}\n\n` +
    line("Company", data.companyName ?? data.company) +
    line("Contact", data.contactPerson ?? data.name) +
    line("Email", data.email) +
    line("Phone/messaging", data.phone) +
    line("Industry", data.industry) +
    line("Cargo", data.cargoDescription) +
    line("Category", data.cargoCategory) +
    line("Quantity", data.quantity) +
    line("Weight", data.weight) +
    line("Dimensions", data.dimensions) +
    line("Origin", data.originCountry) +
    line("Destination", data.destinationCountry) +
    line("Delivery location", data.deliveryLocation) +
    line("Freight method", data.freightMethod) +
    line("Preferred date", data.preferredDate) +
    line("Services", Array.isArray(data.services) ? (data.services as string[]).join(", ") : "") +
    line("Message", data.message) +
    line("Notes", data.notes) +
    (fileNames.length ? `\nUploaded documents (${fileNames.length}) are stored privately on the server; they are not attached to this email.\n` : "");
  return { subject: `[${siteConfig.name}] New enquiry ${reference}`, text };
}

export function buildCustomerConfirmation(reference: string, name: string) {
  return {
    subject: `${siteConfig.name} — we received your enquiry (${reference})`,
    text:
      `Hello ${name},\n\n` +
      `Thank you for contacting ${siteConfig.name}. Your enquiry has been received.\n` +
      `Your enquiry reference is ${reference}. Please keep it for follow-up.\n\n` +
      `Our team will review the details and respond with the next steps. ` +
      `This message is an acknowledgement only and is not a quotation or a booking.\n\n` +
      `${siteConfig.name}\n`,
  };
}
