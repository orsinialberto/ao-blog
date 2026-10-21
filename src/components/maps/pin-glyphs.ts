/** Marker glyphs, as SVG source. They are assigned with `innerHTML`, which is
    safe here and only here: both strings are constants in this file, and no
    value from the route data ever reaches them. Names go through `setText`
    on the popup instead, which escapes.

    Same paths as `PassIcon`/`FlagIcon` in `icons.tsx` — the sidebar nav and
    the pins on the map should read as the same two icons, not two different
    ones that happen to mean the same thing. Duplicated rather than shared
    because those are React components and these are strings for `innerHTML`;
    `icons.tsx` stays the source to copy from if the artwork changes. */

const strokeAttrs =
  'fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

export const PASS_GLYPH = `<svg viewBox="0 0 16 16" width="11" height="11" ${strokeAttrs}><path d="M1.5 12.5l4-6 2.6 3.6" /><path d="M6.6 12.5l3.4-5.4 4.5 5.4z" /></svg>`;

export const POI_GLYPH = `<svg viewBox="0 0 16 16" width="11" height="11" ${strokeAttrs}><path d="M4 14V2.5" /><path d="M4 3.2h8l-2 2.6 2 2.6H4" /></svg>`;
