import { HeroSection } from "@/components/home/HeroSection";
import { HeroQuoteSection } from "@/components/home/HeroQuoteSection";
import { OnTheRoadHomeSection } from "@/components/home/OnTheRoadHomeSection";
import { TravelsHighlightSection } from "@/components/home/TravelsHighlightSection";
import { getTravelsForArchive } from "@/lib/travels";
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
  const travels = await getTravelsForArchive(locale);
  const highlights = travels.slice(0, 3);

  return (
    <div>
      <HeroSection locale={locale} />
      <HeroQuoteSection locale={locale} />
      <TravelsHighlightSection travels={highlights} locale={locale} />
      <OnTheRoadHomeSection locale={locale} />
    </div>
  );
}
