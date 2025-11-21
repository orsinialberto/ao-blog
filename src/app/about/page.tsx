import type { Metadata } from "next";
import Image from "next/image";

import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "About",
  description: "Chi sono, perché ho aperto questo diario e come contattarmi.",
};

export default function AboutPage() {
  return (
    <div className="container grid gap-10 lg:grid-cols-[1fr_320px]">
      <section className="space-y-6 rounded-[32px] bg-white p-8 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          About
        </p>
        <h1 className="text-4xl font-semibold text-brand-primary">Ciao, sono Alberto</h1>
        <div className="space-y-4 text-brand-muted">
          <p className="font-klee text-lg">
            una delle mie più grandi passioni è viaggiare. Nel 2019 ho percorso il mio primo cammino, il Cammino di Santiago portoghese della costa, e ho scoperto una passione che non mi ha più lasciato. Da allora ogni anno cerco di concedermi almeno un viaggio, in Italia o all'estero. Mettere lo zaino in spalla e camminare per chilometri è diventata una delle cose che più mi rendono felice.
          </p>
          <p className="font-klee text-lg">
            Oltre ai cammini, adoro viaggiare in moto, sentire il vento, affrontare curve di montagna e lasciarmi sorprendere dai panorami che si aprono davanti a me.
          </p>
          <p className="font-klee text-lg">
            E poi c'è la voglia di avventura pura: partire senza meta precisa, solo con il mio zaino, e scoprire culture, luoghi e persone diverse da quelle a cui sono abituato. Viaggiare è per me un modo di sentirmi vivo, curioso e libero.
          </p>
        </div>
      </section>
      <aside className="space-y-6 rounded-[32px] bg-white p-8 text-sm text-brand-muted shadow-card">
        <div>
          <h2 className="text-xl font-semibold text-brand-primary">Compagni di viaggio</h2>
          <ul className="mt-3 space-y-2">
            <li>✦ Iphone 14 Pro</li>
            <li>✦ Sony Alpha 6400</li>
            <li>✦ Honda CB 650R</li>
          </ul>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-2xl">
          <Image src={withBasePath("/images/profile.jpg")} alt="Aurora boreale" fill className="object-cover" />
        </div>
      </aside>
    </div>
  );
}
