const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  'aria-hidden': true,
} as const;

export function FlagIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      {...strokeProps}
      strokeLinejoin="round"
    >
      <path d="M4 14V2.5" strokeLinecap="round" />
      <path d="M4 3.2h8l-2 2.6 2 2.6H4" />
    </svg>
  );
}

export function RouteIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      {...strokeProps}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.2 13c2.4 0 3-2 1.6-3.2C3.2 8.4 3.6 6 6.2 6h4.6" />
      <path d="M9.2 4.2L11.2 6 9.2 7.8" />
      <circle cx="3.2" cy="13" r="1.1" />
    </svg>
  );
}

export function PassIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      {...strokeProps}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 12.5l4-6 2.6 3.6" />
      <path d="M6.6 12.5l3.4-5.4 4.5 5.4z" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      {...strokeProps}
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 7.2v4" />
      <path d="M8 4.9v.6" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      {...strokeProps}
      strokeLinecap="round"
    >
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      {...strokeProps}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3l-5 5 5 5" />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      {...strokeProps}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}
