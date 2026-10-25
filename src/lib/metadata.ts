import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Page metadata with canonical URL and Open Graph. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${siteConfig.name}`, description, url: path },
  };
}
