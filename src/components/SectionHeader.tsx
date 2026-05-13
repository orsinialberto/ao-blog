interface SectionHeaderProps {
  label: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-16 text-center">
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
  );
}
