import Link from "next/link";
import { siteConfig } from "@/config/site";
import { industries, services } from "@/content/en";
import { Logo } from "./Logo";
import { getSiteSettings } from "@/lib/settings";
import { ContactDetails } from "@/components/shared/ContactDetails";

export async function SiteFooter({ logoUrl }: { logoUrl?: string }) {
  const { social } = await getSiteSettings();
  return (
    <footer className="bg-navy-900 text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-lg bg-white p-2.5">
            <Logo logoUrl={logoUrl} className="h-20" />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Practical logistics coordination for manufacturing, IT and technology, and public-sector
            projects in Cambodia. Services may be provided through qualified third-party partners.
          </p>
        </div>
        <FooterList title="Services">
          {services.map((s) => (
            <FooterLink key={s.slug} href={`/services#${s.slug}`}>{s.title}</FooterLink>
          ))}
        </FooterList>
        <FooterList title="Industries">
          {industries.map((i) => (
            <FooterLink key={i.slug} href={i.href}>{i.title}</FooterLink>
          ))}
          <FooterLink href="/how-it-works">How It Works</FooterLink>
          <FooterLink href="/about">About Us</FooterLink>
        </FooterList>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h2>
          <div className="mt-4">
            <ContactDetails tone="dark" compact />
            {social.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">{s.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-white">{children}</Link>
    </li>
  );
}
