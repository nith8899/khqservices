import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const paths = [
  "/", "/services", "/industries/manufacturing", "/industries/it-technology", "/industries/government",
  "/about", "/how-it-works", "/request-quote", "/contact", "/privacy", "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({
    url: `${siteConfig.url}${p === "/" ? "" : p}`,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
