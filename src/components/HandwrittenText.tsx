interface HandwrittenTextProps {
  text: string;
  /** Changes the pattern, so two texts don't wobble the same way. */
  seed?: number;
}

/** Deterministic pseudo-random value in [-1, 1], so server and client render the same offsets. */
export function jitter(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/**
 * Nudges every word and every letter slightly off the baseline, like real handwriting.
 * Letters also vary in ink strength, as if the pen pressure changed. Screen readers get the full text.
 */
export function HandwrittenText({ text, seed = 0 }: HandwrittenTextProps) {
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden>
          {i > 0 && " "}
          <span
            className="inline-block"
            style={{
              transform: `translateY(${jitter(seed + i * 2) * 0.2}cqw) rotate(${jitter(seed + i * 2 + 1) * 1.2}deg)`,
            }}
          >
            {[...word].map((letter, j) => {
              const n = seed + i * 50 + j * 3;
              return (
                <span
                  key={j}
                  className="inline-block"
                  style={{
                    transform: `translateY(${jitter(n + 1) * 0.12}cqw) rotate(${jitter(n + 2) * 2.5}deg)`,
                    opacity: 0.9 + jitter(n + 3) * 0.07,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </span>
  );
}
