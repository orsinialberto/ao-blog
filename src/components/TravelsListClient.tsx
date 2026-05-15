'use client';

import { useSearchParams } from 'next/navigation';
import { TravelCard } from '@/components/TravelCard';
import { isContinentTag } from '@/config/continents';
import type { Travel } from '@/lib/travels';
import type { SupportedLocale } from '@/config/locales';
import { useTranslations } from '@/i18n/hooks';
import { LocalizedLink } from './LocalizedLink';

interface TravelsListClientProps {
  allTravels: Travel[];
  allTags: string[];
  locale: SupportedLocale;
}

interface ContinentGroup {
  continent: string;
  travels: Travel[];
}

function getContinentTag(travel: Travel): string | undefined {
  return travel.tags.find(isContinentTag);
}

function groupByContinent(travels: Travel[]): ContinentGroup[] {
  const map = new Map<string, Travel[]>();

  for (const travel of travels) {
    const continent = getContinentTag(travel) ?? 'Altro';
    if (!map.has(continent)) {
      map.set(continent, []);
    }
    map.get(continent)!.push(travel);
  }

  return Array.from(map.entries()).map(([continent, travels]) => ({
    continent,
    travels,
  }));
}

function formatEntryCount(count: number): string {
  return String(count).padStart(2, '0');
}

export function TravelsListClient({ allTravels, allTags, locale }: TravelsListClientProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const selectedContinent = searchParams.get('continente') ?? undefined;

  const continentTags = allTags.filter(isContinentTag);

  const filtered = selectedContinent
    ? allTravels.filter((travel) => getContinentTag(travel) === selectedContinent)
    : allTravels;

  const groups = groupByContinent(filtered);

  return (
    <div className="space-y-12">
      {/* Filtro continenti */}
      <div className="flex flex-wrap gap-8">
        <ContinentButton href="/viaggi" active={!selectedContinent}>
          {t.components.tagFilter.allTravels}
        </ContinentButton>
        {continentTags.map((tag) => (
          <ContinentButton
            key={tag}
            href={`/viaggi?continente=${encodeURIComponent(tag)}`}
            active={selectedContinent === tag}
          >
            {tag}
          </ContinentButton>
        ))}
      </div>

      {/* Sezioni per continente */}
      {groups.length > 0 ? (
        groups.map(({ continent, travels }) => (
          <section key={continent}>
            <div className="flex items-center gap-6 mb-10">
              <span className="font-label text-[10px] font-bold tracking-[0.25em] uppercase text-brand-muted/50 shrink-0">
                {formatEntryCount(travels.length)} {travels.length === 1 ? 'viaggio' : 'viaggi'}
              </span>
              <div className="h-px flex-grow bg-brand-outline-variant/15" />
              <h2 className="font-hero italic text-2xl text-brand-primary shrink-0">
                {continent}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travels.map((travel) => (
                <TravelCard key={travel.slug} travel={travel} locale={locale} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="border border-dashed border-slate-200 bg-white p-6 text-center text-brand-muted">
          {t.components.travelsList.noTravelsWithTag}
        </p>
      )}
    </div>
  );
}

interface ContinentButtonProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function ContinentButton({ href, active, children }: ContinentButtonProps) {
  return (
    <LocalizedLink
      href={href}
      className={`font-label text-[10px] font-bold tracking-[0.25em] uppercase transition-colors ${
        active
          ? 'text-brand-primary border-b border-brand-primary pb-0.5'
          : 'text-brand-muted/40 hover:text-brand-primary'
      }`}
    >
      {children}
    </LocalizedLink>
  );
}
