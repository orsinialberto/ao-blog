interface HandwrittenTextProps {
  text: string;
  /** Changes the pattern, so two texts don't wobble the same way. */
  seed?: number;
}

/** Deterministic pseudo-random value in [-1, 1], so server and client render the same offsets. */
function jitter(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/** Nudges every word slightly off the baseline, like real handwriting. Screen readers get the full text. */
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
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
