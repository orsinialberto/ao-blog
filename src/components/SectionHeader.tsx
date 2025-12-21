import Link from "next/link";

interface SectionHeaderProps {
  label: string;
  title?: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeader({ 
  label, 
  title, 
  linkText, 
  linkHref 
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          {label}
        </p>
        {title && (
          <h2 className="text-4xl font-semibold text-brand-primary mt-2">
            {title}
          </h2>
        )}
      </div>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="text-sm font-semibold text-brand-secondary hover:underline"
        >
          {linkText} →
        </Link>
      )}
    </div>
  );
}

