import {
  ArrowLeftRight, Boxes, Briefcase, CalendarCheck, ClipboardList, Cog, FileCheck, FileText,
  Factory, FolderCheck, Handshake, HardDrive, Landmark, Layers, MessageSquareText, Monitor,
  Network, Server, Ship, Shuffle, Truck, Warehouse, BatteryCharging, Router, Package, Container,
  ShieldCheck, Cable, Cpu, Building2, type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  ArrowLeftRight, Boxes, Briefcase, CalendarCheck, ClipboardList, Cog, FileCheck, FileText,
  Factory, FolderCheck, Handshake, HardDrive, Landmark, Layers, MessageSquareText, Monitor,
  Network, Server, Ship, Shuffle, Truck, Warehouse, BatteryCharging, Router, Package, Container,
  ShieldCheck, Cable, Cpu, Building2,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = icons[name] ?? Package;
  return <Cmp className={className} aria-hidden="true" />;
}
