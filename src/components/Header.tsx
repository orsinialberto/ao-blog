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
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-brand-primary"
          onClick={() => setIsOpen(false)}
        >
          Diario di Viaggio
        </Link>
        <button
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-brand-primary lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          Menu
        </button>
        <nav
          className={`absolute left-0 right-0 top-full border-b border-slate-100 bg-white px-6 py-4 transition-all lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0 ${
            isOpen ? "block" : "hidden lg:block"
          }`}
        >
          <ul className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? "text-brand-secondary"
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
