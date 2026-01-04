import type { Metadata } from "next";
import Image from "next/image";

import { withBasePath } from "@/lib/paths";
import { strings } from "@/config/strings";

export const metadata: Metadata = {
  title: strings.pages.about.title,
  description: strings.pages.about.description,
};

export default function AboutPage() {
  return (
    <div className="container grid gap-10 lg:grid-cols-[1fr_320px]">
      <section className="space-y-6 bg-white p-8 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          {strings.pages.about.sectionLabel}
        </p>
        <h1 className="text-4xl font-semibold text-brand-primary">{strings.pages.about.heading}</h1>
        <div className="space-y-4 text-brand-muted">
          <p className="font-klee text-lg">
            Da quando ho messo piede sul mio primo Cammino – quello di Santiago portoghese della costa, nel 2019 – non mi sono più fermato. 
            È stato amore a prima… vescica. Da allora cerco ogni anno di regalarmi almeno un viaggio, 
            che sia dietro casa o dall’altra parte del mondo. 
            Basta avere uno zaino in spalla e un sentiero davanti: è lì che sono davvero felice.
          </p>
          <p className="font-klee text-lg">
            Quando non cammino, mi trovi probabilmente in moto, 
            a inseguire curve di montagna e panorami che si aprono all’improvviso come scene di un film.
          </p>
          <p className="font-klee text-lg">
            E poi c’è la parte più “selvaggia” di me: quella che ama partire senza un piano preciso, solo con lo zaino, 
            qualche idea vaga e tanta voglia di scoprire posti, culture e persone completamente diverse da quelle a cui sono abituato. 
            Viaggiare è per me un modo di sentirmi vivo, curioso e libero.
          </p>
        </div>
      </section>
      <aside className="space-y-6 bg-white p-8 text-sm text-brand-muted shadow-card">
        <div>
          <h2 className="text-xl font-semibold text-brand-primary">{strings.pages.about.travelCompanions}</h2>
          <ul className="mt-3 space-y-2">
            <li className="font-klee">✦  Iphone 14 Pro</li>
            <li className="font-klee">✦  Sony Alpha 6400</li>
            <li className="font-klee">✦  Honda CB 650R</li>
          </ul>
        </div>
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={withBasePath("/images/profile.jpg")} 
            alt="Aurora boreale" 
            fill 
            className="object-cover"
            sizes="320px"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-brand-primary">{strings.pages.about.contacts}</h2>
          <p className="mt-3 font-klee">orsini.alberto@hotmail.it</p>
        </div>
      </aside>
    </div>
  );
}
