"use client";

import { useTranslations } from "@/i18n/hooks";
import { LocalizedLink } from "./LocalizedLink";

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/albertorsini/",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "Komoot",
      url: "https://www.komoot.com/it-it/user/4517229241749",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { href: "/", label: t.footer.quickLinks.home },
    { href: "/viaggi", label: t.footer.quickLinks.allTravels },
    { href: "/viaggi-in-moto", label: t.footer.quickLinks.motorcycleTravels },
    { href: "/galleria", label: t.footer.quickLinks.photoGallery },
  ];

  return (
    <footer className="bg-white border-t border-stone-100 py-16 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-10">

        <p className="font-hero text-4xl italic text-stone-800">
          {t.common.siteName}
        </p>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {quickLinks.map((link, i) => (
              <li key={link.href} className="flex items-center gap-4">
                {i > 0 && <span className="text-stone-300 select-none">·</span>}
                <LocalizedLink
                  href={link.href}
                  className="font-label text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-stone-700 transition-colors"
                >
                  {link.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="text-stone-400 hover:text-stone-700 transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <p className="font-label text-xs tracking-wider text-stone-300">
          © {currentYear} {t.common.siteName}
        </p>
      </div>
    </footer>
  );
}
