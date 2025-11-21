"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/viaggi", label: "Viaggi" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/30 bg-white/70 backdrop-blur-lg transition-all">
      <div className="container flex items-center justify-between py-3">
        <Link
          href="/"
          className="font-comforter text-3xl font-normal tracking-tight text-brand-primary transition-all hover:opacity-75 md:text-4xl"
          onClick={() => setIsOpen(false)}
        >
          Diario di Viaggio
        </Link>
        <button
          className="rounded-lg border border-slate-200 bg-white/50 px-4 py-2 text-sm font-medium text-brand-primary backdrop-blur-sm transition-colors hover:bg-white/80 lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          {isOpen ? "Chiudi" : "Menu"}
        </button>
        <nav
          className={`absolute left-0 right-0 top-full border-b border-slate-100 bg-white/95 backdrop-blur-lg px-6 py-5 transition-all lg:static lg:block lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0 ${
            isOpen ? "block" : "hidden lg:block"
          }`}
        >
          <ul className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-brand-primary"
                      : "text-brand-muted hover:text-brand-primary"
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
