"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";
import { WigglyText } from "./WigglyText";
import { HandHighlight } from "./HandHighlight";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { removeLocaleFromPath } from "@/lib/i18n/routing";

const baseLinkClass = "font-hand text-lg uppercase tracking-widest pb-1";

const icons = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  travels: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  onTheRoad: "M5 19a2 2 0 100-4 2 2 0 000 4zM19 9a2 2 0 100-4 2 2 0 000 4zM7 17h6a3 3 0 000-6H11a3 3 0 010-6h6",
  gallery: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5a.5.5 0 100-1 .5.5 0 000 1z",
};

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();

  const cleanPath = removeLocaleFromPath(pathname || "");

  const isActive = (href: string) => {
    if (href === "/") return cleanPath === "/" || cleanPath === "";
    return cleanPath.startsWith(href);
  };

  const links = [
    { href: "/", label: t.navigation.links.home, icon: icons.home },
    { href: "/viaggi", label: t.navigation.links.travels, icon: icons.travels },
    { href: "/on-the-road", label: t.navigation.links.onTheRoad, icon: icons.onTheRoad },
    { href: "/galleria", label: t.navigation.links.gallery, icon: icons.gallery },
  ];

  const linkColor = "transition-colors text-brand-muted hover:text-brand-primary";

  const activeLinkClass = "font-semibold text-brand-primary";

  return (
    <header
      className="fixed top-0 w-full z-50 bg-linear-to-b from-white to-transparent"
    >
      <div className="site-top-bar relative flex justify-center items-center py-4 px-8 max-w-screen-2xl mx-auto">
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <LocalizedLink
              key={l.href}
              href={l.href}
              className={`${baseLinkClass} ${linkColor} ${isActive(l.href) ? activeLinkClass : ""}`}
            >
              <span className="relative inline-block px-[0.4em]">
                {isActive(l.href) && <HandHighlight />}
                <WigglyText text={l.label} />
              </span>
            </LocalizedLink>
          ))}
        </nav>

        <div className="absolute right-8 flex items-center gap-4">
          <Suspense fallback={<div className="h-9 w-20 rounded-lg border border-brand-outline-variant bg-brand-surface-low" />}>
            <LanguageSwitcher />
          </Suspense>
        </div>
      </div>

      <nav
        aria-label={t.navigation.menu}
        className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/40 bg-white/60 p-1.5 shadow-lg backdrop-blur-md md:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        {links.map((l) => (
          <LocalizedLink
            key={l.href}
            href={l.href}
            aria-label={l.label}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
              isActive(l.href)
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-brand-muted hover:text-brand-primary"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d={l.icon} />
            </svg>
          </LocalizedLink>
        ))}
      </nav>
    </header>
  );
}
