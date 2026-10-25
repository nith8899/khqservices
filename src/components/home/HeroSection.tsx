import Image from "next/image";
import { heroValueProps } from "@/content/en";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/shared/ui";
import { Icon } from "@/components/shared/Icon";

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-navy-900 text-white">
      <Image
        src="/images/hero-logistics.svg"
        alt="Stylised illustration of freight containers and a shipping route"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/30" />
      <div className="container-page py-20 sm:py-28 lg:py-32">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight !text-white sm:text-5xl lg:text-6xl">
          {siteConfig.tagline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
          {siteConfig.description}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/request-quote" arrow>Request a Quote</ButtonLink>
          <ButtonLink href="/services" variant="ghost-light">Explore Our Services</ButtonLink>
        </div>
        <ul className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {heroValueProps.map((v) => (
            <li key={v.label} className="flex items-center gap-3 text-sm font-medium text-white/90">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent">
                <Icon name={v.icon} className="h-5 w-5" />
              </span>
              {v.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
