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
          className="h-5 w-5"
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
          className="h-5 w-5"
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
    { href: "/galleria", label: t.footer.quickLinks.photoGallery },
    { href: "/about", label: t.footer.quickLinks.about },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-t border-slate-200">
      <div className="py-12 md:py-16 px-4 lg:px-24">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand & Bio Section */}
          <div className="lg:col-span-5">
            <p className="font-comforter text-3xl font-normal tracking-tight text-brand-primary md:text-4xl mb-4">
              {t.common.siteName}
            </p>
            <p className="text-sm leading-relaxed text-brand-muted max-w-md">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-muted">
              {t.footer.navigation}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-sm text-brand-secondary transition hover:text-brand-accent"
                  >
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Connect */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-muted">
              {t.footer.follow}
            </h3>
            <p className="mb-4 text-sm text-brand-muted">
              {t.footer.followDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-secondary backdrop-blur-sm transition hover:border-brand-accent hover:bg-brand-accent/10 hover:text-brand-primary"
                  aria-label={social.name}
                >
                  <span className="transition group-hover:scale-110">
                    {social.icon}
                  </span>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <p className="text-xs text-brand-muted">
            © {currentYear} {t.common.siteName} · {t.common.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
