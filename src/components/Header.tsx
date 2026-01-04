"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navigationLinks } from "@/config/navigation";
import { strings } from "@/config/strings";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const headerIsTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        headerIsTransparent
          ? "border-b-0 bg-transparent"
          : "border-b border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between pt-5 pb-3 px-4 lg:px-24">
        <Link
          href="/"
          className={`font-comforter text-3xl font-normal tracking-tight transition-all hover:opacity-75 md:text-4xl ${
            headerIsTransparent ? "text-white" : "text-brand-primary"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {strings.common.siteName}
        </Link>
        <button
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors lg:hidden ${
            headerIsTransparent
              ? "border-white/30 bg-white/20 text-white hover:bg-white/30"
              : "border-slate-300 bg-white text-brand-primary hover:bg-slate-100"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          {isOpen ? strings.navigation.close : strings.navigation.menu}
        </button>
        <nav
          className={`absolute left-0 right-0 top-full border-b px-6 py-5 transition-all lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0 ${
            isOpen ? "block" : "hidden lg:block"
          } ${
            headerIsTransparent
              ? "border-white/20 bg-black/40 lg:bg-transparent"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <ul className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-klee text-sm font-medium transition-colors hover:opacity-75 ${
                    headerIsTransparent ? "text-white" : "text-brand-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
