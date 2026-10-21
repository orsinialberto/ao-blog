interface WigglyTextProps {
  text: string;
}

/** Splits text into letters that jump slightly on hover. Screen readers get the full text. */
export function WigglyText({ text }: WigglyTextProps) {
  const words = text.split(" ");

  return (
    <span aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} aria-hidden>
          {wordIndex > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <span
                key={charIndex}
                className="inline-block transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-6 motion-reduce:transition-none"
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
