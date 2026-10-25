"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { mainNav } from "@/content/en";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/shared/ui";
import type { NavLink } from "@/types/content";

function isActive(pathname: string, link: NavLink) {
  if (link.href === "/") return pathname === "/";
  if (link.label === "Industries") return pathname.startsWith("/industries");
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export function SiteHeader({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white text-navy-900 shadow-sm">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="shrink-0">
          <Logo logoUrl={logoUrl} />
        </Link>
        <DesktopNavigation pathname={pathname} />
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href="/request-quote" className="!px-4 !py-2.5">Request a Quote</ButtonLink>
          </div>
          <MobileNavigation pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function DesktopNavigation({ pathname }: { pathname: string }) {
  // Menu state is keyed to the pathname it was opened on, so navigating closes it.
  const [openState, setOpenState] = useState<{ label: string; path: string } | null>(null);
  const open = openState && openState.path === pathname ? openState.label : null;
  const setOpen = useCallback(
    (label: string | null) => setOpenState(label ? { label, path: pathname } : null),
    [pathname],
  );
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [setOpen]);


  return (
    <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {mainNav.map((link) => {
          const active = isActive(pathname, link);
          const linkCls = `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface ${
            active ? "text-brand" : "text-navy-900"
          }`;
          if (!link.children) {
            return (
              <li key={link.label}>
                <Link href={link.href} className={linkCls} aria-current={active ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            );
          }
          const isOpen = open === link.label;
          const menuId = `menu-${link.label.toLowerCase()}`;
          return (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => setOpen(link.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <div className="flex items-center">
                <Link href={link.href} className={`${linkCls} pr-1`} aria-current={active ? "page" : undefined}>
                  {link.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  aria-label={`${link.label} submenu`}
                  onClick={() => setOpen(isOpen ? null : link.label)}
                  className="rounded-md p-1.5 text-navy-800 hover:bg-surface"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              </div>
              {isOpen && (
                <div
                  id={menuId}
                  className="absolute left-0 top-full z-50 w-[22rem] pt-2"
                >
                  <ul className="rounded-xl border border-line bg-white p-2 text-ink shadow-card-hover">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 hover:bg-surface"
                          onClick={() => setOpen(null)}
                        >
                          <span className="block text-sm font-semibold text-navy-900">{child.label}</span>
                          {child.description && (
                            <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{child.description}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileNavigation({ pathname }: { pathname: string }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = useCallback((v: boolean) => setOpenPath(v ? pathname : null), [pathname]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel) return;
      const focusables = [buttonRef.current, ...panel.querySelectorAll<HTMLElement>("a[href],button")].filter(
        Boolean,
      ) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close() : setOpen(true))}
        className="relative z-[60] rounded-md p-2 hover:bg-surface"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto bg-white px-5 pb-10 pt-4"
        >
          <ul className="space-y-1">
            {mainNav.map((link) => (
              <li key={link.label}>
                {link.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={expanded === link.label}
                      onClick={() => setExpanded(expanded === link.label ? null : link.label)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium hover:bg-surface"
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expanded === link.label ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {expanded === link.label && (
                      <ul className="mb-2 ml-3 space-y-1 border-l border-line pl-3">
                        <li>
                          <Link href={link.href} className="block rounded-lg px-3 py-2.5 text-sm text-navy-800 hover:bg-surface">
                            {link.label === "Services" ? "All services" : "All industries"}
                          </Link>
                        </li>
                        {link.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-lg px-3 py-2.5 text-sm text-navy-800 hover:bg-surface">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    aria-current={isActive(pathname, link) ? "page" : undefined}
                    className={`block rounded-lg px-3 py-3 text-base font-medium hover:bg-surface ${
                      isActive(pathname, link) ? "text-brand" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <ButtonLink href="/request-quote" className="mt-6 w-full">
            Request a Quote
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
