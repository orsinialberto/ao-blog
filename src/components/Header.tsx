"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { removeLocaleFromPath } from "@/lib/i18n/routing";

const baseLinkClass = "font-label text-sm uppercase tracking-widest pb-1";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cleanPath = removeLocaleFromPath(pathname || "");
  const isHome = cleanPath === "/" || cleanPath === "";

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }
    setScrolled(window.scrollY > 40);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  const isActive = (href: string) => {
    if (href === "/") return cleanPath === "/" || cleanPath === "";
    if (href === "/viaggi") {
      return (
        cleanPath.startsWith("/viaggi") &&
        !cleanPath.startsWith("/viaggi-in-moto")
      );
    }
    return cleanPath.startsWith(href);
  };

  const links = [
    { href: "/", label: t.navigation.links.home },
    { href: "/viaggi", label: t.navigation.links.travels },
    { href: "/viaggi-in-moto", label: t.navigation.links.motorcycleTravels },
    { href: "/galleria", label: t.navigation.links.gallery },
  ];

  const linkColor = transparent
    ? "text-white/90 hover:text-white"
    : "transition-colors text-brand-muted hover:text-brand-primary";

  const activeLinkClass = transparent
    ? "font-semibold text-white border-b-2 border-white"
    : "font-semibold text-brand-primary border-b-2 border-brand-primary";

  return (
    <header
      className={`fixed top-0 w-full z-50 ${
        transparent
          ? "bg-transparent"
          : "transition-all duration-300 bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="relative flex justify-center items-center py-7 px-8 max-w-screen-2xl mx-auto">
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <LocalizedLink
              key={l.href}
              href={l.href}
              className={`${baseLinkClass} ${linkColor} ${isActive(l.href) ? activeLinkClass : "border-b-2 border-transparent"}`}
            >
              {l.label}
            </LocalizedLink>
          ))}
        </nav>

        <div className="absolute right-8 flex items-center gap-4">
          <button
            className={`flex items-center justify-center rounded-lg p-2 md:hidden ${transparent ? "text-white/90 hover:text-white" : "transition-colors text-brand-muted hover:text-brand-primary"}`}
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
            <LanguageSwitcher isTransparent={transparent} />
          </Suspense>
        </div>
      </div>

      {isOpen && (
        <nav className={`border-t px-8 py-4 md:hidden ${transparent ? "border-white/20 bg-black/40 backdrop-blur-sm" : "border-brand-outline-variant/30"}`}>
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <LocalizedLink
                  href={l.href}
                  className={`${baseLinkClass} ${linkColor} ${isActive(l.href) ? activeLinkClass : "border-b-2 border-transparent"} inline-block`}
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
