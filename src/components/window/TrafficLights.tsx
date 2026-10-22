'use client';

import { LocalizedLink } from '@/components/LocalizedLink';
import { useTranslations } from '@/i18n/hooks';

type Props = {
  /** Appended to the cluster: the Maps window puts it inside a floating
      panel (or a floating pill on small screens). */
  className?: string;
};

/** The red dot is the only way back to the home page. The other two are decoration and are hidden from assistive tech. */
export default function TrafficLights({ className = '' }: Props) {
  const t = useTranslations();

  return (
    <div className={`flex gap-2 ${className}`}>
      <LocalizedLink
        href="/"
        aria-label={t.navigation.close}
        className="focus-visible:outline-ink relative block h-3 w-3 rounded-full border border-black/15 bg-[#ff5f57] before:absolute before:-inset-y-4 before:-right-1 before:-left-3 pointer-coarse:before:-right-4 pointer-coarse:before:-left-4 before:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {null}
      </LocalizedLink>
      <span
        aria-hidden
        className="bg-tape/70 block h-3 w-3 rounded-full border border-black/10"
      />
      <span
        aria-hidden
        className="bg-tape/70 block h-3 w-3 rounded-full border border-black/10"
      />
    </div>
  );
}
