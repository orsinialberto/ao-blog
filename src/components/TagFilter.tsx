import Link from "next/link";
import type { ReactNode } from "react";

interface TagFilterProps {
  tags: string[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      <FilterChip href="/viaggi" active={!activeTag}>
        Tutti i viaggi
      </FilterChip>
      {tags.map((tag) => {
        const normalized = tag.toLowerCase();
        return (
          <FilterChip
            key={tag}
            href={`/viaggi?tag=${encodeURIComponent(tag)}`}
            active={activeTag === normalized}
          >
            #{tag}
          </FilterChip>
        );
      })}
    </div>
  );
}

interface FilterChipProps {
  href: string;
  children: ReactNode;
  active: boolean;
}

function FilterChip({ href, children, active }: FilterChipProps) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-brand-secondary bg-brand-secondary text-white"
          : "border-slate-200 bg-white text-brand-muted hover:border-brand-secondary hover:text-brand-secondary"
      }`}
    >
      {children}
    </Link>
  );
}
