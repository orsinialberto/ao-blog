import type { Metadata } from "next";

import "./../globals.css";
import { ConsentModeInitializer } from "@/components/ConsentModeInitializer";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { MainWrapper } from "@/components/MainWrapper";
import { getSiteMetadata, getAlternateLanguageLinks } from "@/config/metadata";
import { getLocaleFromParams } from "@/lib/i18n/routing";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const metadata = getSiteMetadata(locale);
  
  // Generate alternate language links for homepage
  // Individual pages can override metadata with page-specific paths
  const alternates = getAlternateLanguageLinks("/");
  
  // Add x-default hreflang (points to default locale - Italian)
  const defaultAlternate = alternates.find((alt) => alt.hreflang === "it-IT") || alternates[0];
  
  // Build languages object for hreflang
  const languages: Record<string, string> = {
    "x-default": defaultAlternate.href,
  };
  
  alternates.forEach((alt) => {
    languages[alt.hreflang] = alt.href;
  });
  
  return {
    metadataBase: new URL(metadata.url),
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `${metadata.url}/${locale}/`,
      languages,
    },
    openGraph: {
      title: metadata.title.default,
      description: metadata.description,
      url: `${metadata.url}/${locale}/`,
      siteName: metadata.title.default,
      locale: metadata.locale,
      alternateLocale: alternates
        .filter((alt) => alt.hreflang !== metadata.locale)
        .map((alt) => alt.hreflang),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title.default,
      description: metadata.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  return (
    <>
      <ConsentModeInitializer />
      <div className="flex min-h-screen flex-col">
        <Header />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
      </div>
      <CookieBanner />
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics />}
    </>
  );
}
