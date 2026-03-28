'use client';

import { useSearchParams } from 'next/navigation';
import { TravelCard } from '@/components/TravelCard';
import { isContinentTag } from '@/config/continents';
import type { Travel } from '@/lib/travels';
import { useTranslations } from '@/i18n/hooks';
import { LocalizedLink } from './LocalizedLink';

interface TravelsListClientProps {
  allTravels: Travel[];
  allTags: string[];
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

export function TravelsListClient({ allTravels, allTags }: TravelsListClientProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const selectedContinent = searchParams.get('continente') ?? undefined;

  const continentTags = allTags.filter(isContinentTag);

  const filtered = selectedContinent
    ? allTravels.filter((travel) => getContinentTag(travel) === selectedContinent)
    : allTravels;

  const groups = groupByContinent(filtered);

  return (
    <div className="space-y-24">
      {/* Filtro continenti */}
      <div className="border-y border-brand-outline-variant/20 py-5 flex justify-center">
        <div className="flex flex-wrap justify-center gap-10">
          <ContinentButton
            href="/viaggi"
            active={!selectedContinent}
          >
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
      </div>

      {/* Sezioni per continente */}
      {groups.length > 0 ? (
        groups.map(({ continent, travels }) => (
          <section key={continent}>
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-2xl font-bold text-brand-primary tracking-tight shrink-0">
                {continent}
              </h2>
              <div className="h-px flex-grow bg-brand-outline-variant/20" />
              <span className="text-[10px] font-bold text-brand-muted/50 tracking-[0.2em] uppercase shrink-0">
                {formatEntryCount(travels.length)} {travels.length === 1 ? 'viaggio' : 'viaggi'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {travels.map((travel) => (
                <TravelCard key={travel.slug} travel={travel} />
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
      className={`text-[10px] font-bold tracking-[0.25em] uppercase transition-colors ${
        active
          ? 'text-brand-primary border-b border-brand-primary pb-0.5'
          : 'text-brand-muted/60 hover:text-brand-primary'
      }`}
    >
      {children}
    </LocalizedLink>
  );
}
