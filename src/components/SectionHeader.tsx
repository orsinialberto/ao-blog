import { LocalizedLink } from "./LocalizedLink";

interface SectionHeaderProps {
  label: string;
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  dark?: boolean;
}

export function SectionHeader({ 
  label, 
  title, 
  subtitle,
  linkText, 
  linkHref,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-16">
      <div>
        <h2 className={`font-headline text-4xl mb-2 ${dark ? 'text-white' : 'text-brand-primary'}`}>
          {label}
        </h2>
        {title && (
          <p className={`font-headline text-2xl mt-1 ${dark ? 'text-white/80' : 'text-brand-secondary'}`}>
            {title}
          </p>
        )}
        {subtitle && (
          <p className={`font-body mt-1 ${dark ? 'text-slate-400' : 'text-brand-muted'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkHref && (
        <LocalizedLink
          href={linkHref}
          className={`font-label text-sm font-bold border-b-2 pb-1 transition-all ${dark ? 'text-slate-300 border-white/20 hover:border-white' : 'text-brand-primary border-brand-primary/20 hover:border-brand-primary'}`}
        >
          {linkText}
        </LocalizedLink>
      )}
    </div>
  );
}

