/** Two overlapping pastel marker strokes. Place inside a `relative` parent; it paints behind the text. */
export function HandHighlight() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 60"
      preserveAspectRatio="none"
      className="absolute inset-0 -z-10 h-full w-full fill-brand-accent"
    >
      <path className="opacity-60 mix-blend-multiply" d="M6 20 C 60 12, 120 19, 180 13 S 260 17, 294 11 L 297 40 C 250 47, 190 40, 130 46 S 40 44, 4 42 Z" />
      <path className="opacity-60 mix-blend-multiply" d="M16 29 C 70 23, 130 31, 190 25 S 255 29, 288 23 L 291 50 C 240 55, 180 48, 120 54 S 50 51, 12 52 Z" />
    </svg>
  );
}
