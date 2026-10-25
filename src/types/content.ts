export type IconName = string;

export interface ServiceItem {
  slug: string;
  title: string;
  icon: IconName;
  short: string;
  problem: string;
  description: string;
  cargo: string[];
  requiredInfo: string[];
  related: string[];
  /** True when delivery depends on third-party providers. */
  thirdParty: boolean;
  note?: string;
}

export interface IndustryItem {
  slug: "manufacturing" | "it-technology" | "government";
  title: string;
  icon: IconName;
  short: string;
  href: string;
  image: string;
  imageAlt: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface ProcessStep {
  title: string;
  description: string;
  customerAction?: boolean;
}
