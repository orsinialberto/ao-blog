interface HandUnderlineProps {
  className?: string;
}

/** Hand-drawn wavy underline. Wiggles when an ancestor with the `group` class is hovered. */
export function HandUnderline({ className = "" }: HandUnderlineProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className={`hand-underline absolute inset-x-0 w-full ${className}`}
    >
      <path
        d="M3 7 C 30 3, 55 10, 90 6 S 150 3, 185 7 S 250 9, 297 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
