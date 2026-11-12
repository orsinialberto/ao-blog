"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";
import { WigglyText } from "./WigglyText";
import { HandHighlight } from "./HandHighlight";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { removeLocaleFromPath } from "@/lib/i18n/routing";

const baseLinkClass = "font-hand text-lg uppercase tracking-widest pb-1";

// Watercolour drawings for the mobile nav, 256px wide with a transparent background.
const icons = {
  home: "/images/icons/nav-home.webp",
  travels: "/images/icons/nav-travels.webp",
  onTheRoad: "/images/icons/nav-on-the-road.webp",
  gallery: "/images/icons/nav-gallery.webp",
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
      {/* Logo, nav and language switcher share one row: 20px from the top (pt-5 / top-5), 44px tall (h-11). */}
      <div className="site-top-bar relative mx-auto flex max-w-screen-2xl items-center justify-center px-8 pt-5 pb-3 md:pb-0">
        <LocalizedLink
          href="/"
          aria-label={t.navigation.links.home}
          className="absolute left-8 top-5 text-brand-primary"
        >
          <Logo className="h-11 w-auto" />
        </LocalizedLink>

        <nav className="hidden h-11 items-center gap-10 md:flex">
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

        <div className="absolute right-8 top-5 flex h-11 items-center gap-4">
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
            className={`flex h-12 w-16 items-center justify-center rounded-full transition-[background-color,opacity] ${
              isActive(l.href) ? "bg-brand-primary/10" : "opacity-60"
            }`}
          >
            <Image
              src={l.icon}
              alt=""
              width={256}
              height={186}
              className="h-10 w-14 object-contain"
            />
          </LocalizedLink>
        ))}
      </nav>
    </header>
  );
}
