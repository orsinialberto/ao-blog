"use client";

import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";
import { WigglyText } from "./WigglyText";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { removeLocaleFromPath } from "@/lib/i18n/routing";

const baseLinkClass = "font-hand text-lg uppercase tracking-widest pb-1";

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
    { href: "/on-the-road", label: t.navigation.links.onTheRoad },
    { href: "/galleria", label: t.navigation.links.gallery },
  ];

  const linkColor = "transition-colors text-brand-muted hover:text-brand-primary";

  const activeLinkClass = "font-semibold text-brand-primary border-b-2 border-brand-primary";

  return (
    <header
      className="fixed top-0 w-full z-50 bg-linear-to-b from-white to-transparent"
    >
      <div className="relative flex justify-center items-center py-4 px-8 max-w-screen-2xl mx-auto">
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <LocalizedLink
              key={l.href}
              href={l.href}
              className={`${baseLinkClass} ${linkColor} ${isActive(l.href) ? activeLinkClass : "border-b-2 border-transparent"}`}
            >
              <WigglyText text={l.label} />
            </LocalizedLink>
          ))}
        </nav>

        <div className="absolute right-8 flex items-center gap-4">
          <button
            className={`flex items-center justify-center rounded-lg p-2 md:hidden transition-colors text-brand-muted hover:text-brand-primary`}
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
            <LanguageSwitcher />
          </Suspense>
        </div>
      </div>

      {isOpen && (
        <nav className={`border-t px-8 py-4 md:hidden border-brand-outline-variant/30`}>
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <LocalizedLink
                  href={l.href}
                  className={`${baseLinkClass} ${linkColor} ${isActive(l.href) ? activeLinkClass : "border-b-2 border-transparent"} inline-block`}
                  onClick={() => setIsOpen(false)}
                >
                  <WigglyText text={l.label} />
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
