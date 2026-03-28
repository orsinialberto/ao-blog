import { HeroSection } from "@/components/home/HeroSection";
import { TravelsHighlightSection } from "@/components/home/TravelsHighlightSection";
import { TravelMap } from "@/components/TravelMap";
import { TravelStats } from "@/components/TravelStats";
import { getAllTravels, getTravelStats } from "@/lib/travels";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import { getAllLocalizedPaths } from "@/lib/i18n/routing";

interface HomePageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateStaticParams() {
  return getAllLocalizedPaths("/");
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await getLocaleFromParams(params);
  const travels = await getAllTravels(locale);
  const highlights = travels.slice(0, 5);
  const stats = getTravelStats(locale);

  return (
    <div>
      <HeroSection locale={locale} />
      <TravelStats stats={stats} locale={locale} />
      <TravelsHighlightSection travels={highlights} locale={locale} />
      <TravelMap locale={locale} />
    </div>
  );
}
