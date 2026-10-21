/** Fills `{name}` placeholders in a translated template. The blog has no ICU
    formatter, so this is the one place that does the substitution. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
