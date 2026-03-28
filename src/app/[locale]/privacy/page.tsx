import type { Metadata } from "next";

import { getLocaleFromParams } from "@/lib/i18n/routing";
import { getAllLocalizedPaths } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface PrivacyPageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateStaticParams() {
  return getAllLocalizedPaths("/privacy");
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);

  return {
    title: t.pages.privacy.title,
    description: t.pages.privacy.description,
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);

  return (
    <div className="container">
      <section className="space-y-8 bg-white p-8 shadow-card">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
            {t.pages.privacy.sectionLabel}
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-brand-primary">
            {t.pages.privacy.heading}
          </h1>
        </div>

        <div className="prose prose-sm max-w-none space-y-6 text-brand-muted">
          <div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              {t.pages.privacy.introduction.title}
            </h2>
            <p className="font-body text-lg">{t.pages.privacy.introduction.text}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              {t.pages.privacy.technicalCookies.title}
            </h2>
            <p className="font-body text-lg">{t.pages.privacy.technicalCookies.text}</p>
            <ul className="mt-4 space-y-2 pl-6 font-body text-lg">
              <li className="list-disc">{t.pages.privacy.technicalCookies.list1}</li>
              <li className="list-disc">{t.pages.privacy.technicalCookies.list2}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              {t.pages.privacy.analyticsCookies.title}
            </h2>
            <p className="font-body text-lg">{t.pages.privacy.analyticsCookies.text}</p>
            <p className="mt-4 font-body text-lg">{t.pages.privacy.analyticsCookies.details}</p>
            <ul className="mt-4 space-y-2 pl-6 font-body text-lg">
              <li className="list-disc">{t.pages.privacy.analyticsCookies.list1}</li>
              <li className="list-disc">{t.pages.privacy.analyticsCookies.list2}</li>
              <li className="list-disc">{t.pages.privacy.analyticsCookies.list3}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              {t.pages.privacy.management.title}
            </h2>
            <p className="font-body text-lg">{t.pages.privacy.management.text}</p>
            <p className="mt-4 font-body text-lg">{t.pages.privacy.management.details}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              {t.pages.privacy.rights.title}
            </h2>
            <p className="font-body text-lg">{t.pages.privacy.rights.text}</p>
            <ul className="mt-4 space-y-2 pl-6 font-body text-lg">
              <li className="list-disc">{t.pages.privacy.rights.list1}</li>
              <li className="list-disc">{t.pages.privacy.rights.list2}</li>
              <li className="list-disc">{t.pages.privacy.rights.list3}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              {t.pages.privacy.contacts.title}
            </h2>
            <p className="font-body text-lg">{t.pages.privacy.contacts.text}</p>
            <p className="mt-2 font-body text-lg">Email: orsini.alberto@hotmail.it</p>
          </div>

          <div>
            <p className="text-sm text-brand-muted">
              {t.pages.privacy.lastUpdate}: {new Date().toLocaleDateString(locale === "it" ? "it-IT" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

