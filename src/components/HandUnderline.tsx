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
        d="M3 7 C 30 5, 55 9, 90 6.5 S 150 5, 185 7 S 250 8, 297 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
