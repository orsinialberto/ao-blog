"use client";

import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { removeLocaleFromPath } from "@/lib/i18n/routing";

const baseLinkClass =
  "font-label text-sm uppercase tracking-widest text-brand-muted transition-colors hover:text-brand-primary pb-1";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const cleanPath = removeLocaleFromPath(pathname || "");

  const isActive = (href: string) => {
    if (href === "/") return cleanPath === "/" || cleanPath === "";
    return cleanPath.startsWith(href);
  };

  const links = [
    { href: "/", label: t.navigation.links.home },
    { href: "/viaggi", label: t.navigation.links.travels },
    { href: "/galleria", label: t.navigation.links.gallery },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md">
      <div className="flex justify-between items-center py-6 px-8 max-w-screen-2xl mx-auto">
        <LocalizedLink
          href="/"
          className="whitespace-nowrap font-headline text-2xl font-bold tracking-tight text-brand-primary hover:opacity-80 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          {t.common.siteName}
        </LocalizedLink>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <LocalizedLink
              key={l.href}
              href={l.href}
              className={`${baseLinkClass} ${isActive(l.href) ? "font-semibold text-brand-primary border-b-2 border-brand-primary" : "border-b-2 border-transparent"}`}
            >
              {l.label}
            </LocalizedLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center rounded-lg p-2 text-brand-muted transition-colors hover:text-brand-primary md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? t.navigation.close : t.navigation.menu}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
          <Suspense fallback={<div className="h-9 w-20 rounded-lg border border-brand-outline-variant bg-brand-surface-low" />}>
            <LanguageSwitcher isTransparent={false} />
          </Suspense>
        </div>
      </div>

      {isOpen && (
        <nav className="border-t border-brand-outline-variant/30 px-8 py-4 md:hidden">
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <LocalizedLink
                  href={l.href}
                  className={`${baseLinkClass} ${isActive(l.href) ? "font-semibold text-brand-primary border-b-2 border-brand-primary" : "border-b-2 border-transparent"} inline-block`}
                  onClick={() => setIsOpen(false)}
                >
                  {l.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
