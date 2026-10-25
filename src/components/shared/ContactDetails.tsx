import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { hasRealContact } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";

export async function ContactDetails({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const { contact: c } = await getSiteSettings();
  const rows = [
    { icon: Mail, label: "Email", value: c.email, href: hasRealContact(c.email) ? `mailto:${c.email}` : undefined },
    { icon: Phone, label: "Telephone", value: c.phone, href: hasRealContact(c.phone) ? `tel:${c.phone.replace(/\s/g, "")}` : undefined },
    { icon: MessageCircle, label: "Messaging", value: c.messaging },
    { icon: MapPin, label: "Office", value: c.address },
    { icon: Clock, label: "Business hours", value: c.hours },
  ];
  const text = tone === "dark" ? "text-white/80" : "text-ink";
  const iconCls = tone === "dark" ? "text-accent" : "text-brand";
  return (
    <ul className={`${compact ? "space-y-3" : "space-y-5"} text-sm ${text}`}>
      {rows.map(({ icon: I, label, value, href }) => (
        <li key={label} className="flex gap-3">
          <I className={`mt-0.5 h-4 w-4 shrink-0 ${iconCls}`} aria-hidden="true" />
          <div>
            <span className={compact ? "sr-only" : `block text-xs font-semibold uppercase tracking-wide ${tone === "dark" ? "text-white" : "text-navy-900"}`}>
              {label}
            </span>
            {href ? (
              <a href={href} className="hover:underline">{value}</a>
            ) : (
              <span className={value.startsWith("[") ? "italic opacity-80" : ""}>{value}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
