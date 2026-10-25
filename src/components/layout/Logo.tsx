import { siteConfig } from "@/config/site";

/**
 * Company logo. Uses the admin-uploaded logo when set, otherwise the bundled
 * default at /images/logo.jpg. The logo artwork has a white background, so place it on a light background.
 */
export function Logo({ logoUrl, className = "h-16" }: { logoUrl?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- admin-uploadable logo of unknown size
  return <img src={logoUrl ?? "/images/logo.jpg"} alt={siteConfig.name} className={`${className} w-auto max-w-[240px] object-contain`} />;
}
