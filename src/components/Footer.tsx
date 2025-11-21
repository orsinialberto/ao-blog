import Link from "next/link";

export function Footer() {
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

  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-brand-primary">Diario di Viaggio</p>
          <p className="text-sm text-brand-muted">
            © {new Date().getFullYear()} · Tutti i diritti riservati
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex gap-5 text-sm font-medium text-brand-muted">
            <Link href="/viaggi" className="transition hover:text-brand-secondary">
              Tutti i viaggi
            </Link>
            <Link href="/about" className="transition hover:text-brand-secondary">
              Contatti
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted transition hover:text-brand-secondary"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
