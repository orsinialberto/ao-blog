import { type TravelTimelineItem } from "@/lib/travels";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface TravelTimelineProps {
  timeline: TravelTimelineItem[];
  locale: SupportedLocale;
}

export function TravelTimeline({ timeline, locale }: TravelTimelineProps) {
  const t = getTranslations(locale);
  if (!timeline || timeline.length === 0) {
    return null;
  }

  // Array di colori diversi per i pallini
  const dotColors = [
    'bg-brand-accent',
    'bg-orange-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-amber-500',
  ];

  // Array di colori per le linee verticali (stesso colore dei pallini con opacità)
  const lineColors = [
    'bg-brand-accent/30',
    'bg-orange-500/30',
    'bg-blue-500/30',
    'bg-purple-500/30',
    'bg-pink-500/30',
    'bg-green-500/30',
    'bg-red-500/30',
    'bg-yellow-500/30',
    'bg-indigo-500/30',
    'bg-teal-500/30',
    'bg-cyan-500/30',
    'bg-amber-500/30',
  ];

  return (
    <section className="bg-white p-8 shadow-card">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          {t.components.travelTimeline.stagesLabel}
        </p>
      </div>

      {/* Desktop: Timeline orizzontale */}
      <div className="hidden md:block">
        <div className="relative pt-12 pb-16 -mx-8 px-8">
          <div className="relative flex w-full items-start justify-between">
            {/* Linea di connessione - parte dal centro del primo pallino e finisce al centro dell'ultimo */}
            <div 
              className="absolute top-10 h-0.5 bg-brand-secondary"
              style={{
                left: `calc(100% / ${timeline.length} / 2)`,
                right: `calc(100% / ${timeline.length} / 2)`
              }}
            />
            
            {timeline.map((item, index) => {
              const isLast = index === timeline.length - 1;
              const nextItem = !isLast ? timeline[index + 1] : null;
              const isEven = index % 2 === 0;
              const dotColor = dotColors[index % dotColors.length];
              const lineColor = lineColors[index % lineColors.length];

              return (
                <div key={index} className="relative z-10 flex flex-1 flex-col items-center min-h-[80px]">
                  {/* Punto della timeline */}
                  <div className={`absolute top-10 h-4 w-4 -translate-y-1/2 rounded-full ${dotColor} left-1/2 -translate-x-1/2 shadow-sm`} />

                  {/* Linea verticale tra pallino e città */}
                  {isEven ? (
                    <div className={`absolute left-1/2 -top-3 h-14 w-px -translate-x-1/2 ${lineColor}`} />
                  ) : (
                    <div className={`absolute left-1/2 top-10 h-14 w-px -translate-x-1/2 ${lineColor}`} />
                  )}

                  {/* Km tra i pallini - leggermente sotto la riga */}
                  {nextItem?.km !== undefined && (
                    <div className="absolute top-[38px] right-0 translate-x-1/2">
                      <span className="text-[10px] font-medium text-brand-muted whitespace-nowrap">
                        {nextItem.km} {t.components.travelTimeline.kilometers}
                      </span>
                    </div>
                  )}

                  {/* Nome città - alternato sopra/sotto la riga con wrapping controllato */}
                  <div className={`absolute ${isEven ? '-top-10' : 'top-24'} left-1/2 -translate-x-1/2 text-center w-[120px] px-1`}>
                    <p className="text-base font-semibold font-klee text-brand-primary leading-tight break-words hyphens-auto">
                      {item.city}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Timeline verticale */}
      <div className="md:hidden">
        <div className="relative">
          {/* Linea verticale */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-brand-secondary/20" />

          <div className="relative space-y-1">
            {timeline.map((item, index) => {
              const isLast = index === timeline.length - 1;
              const nextItem = !isLast ? timeline[index + 1] : null;
              const dotColor = dotColors[index % dotColors.length];

              return (
                <div key={index} className="relative pl-4">
                  <div className="flex items-start gap-4">
                    {/* Punto della timeline */}
                    <div className={`absolute left-[16.25px] top-4 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 shrink-0 rounded-full ${dotColor} shadow-sm`} />

                    {/* Nome città */}
                    <div className="flex-1 pt-0.5 ml-5">
                      <p className="text-sm font-semibold font-klee text-brand-primary">{item.city}</p>
                    </div>
                  </div>

                  {/* Distanza tra tappe */}
                  {nextItem?.km !== undefined && (
                    <div className="ml-5 mt-2">
                      <span className="text-[10px] font-medium text-brand-muted">
                        {nextItem.km} {t.components.travelTimeline.kilometers}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

