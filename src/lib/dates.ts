const locale = "it-IT";

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString(locale, options ?? { dateStyle: "medium" });
}

export function formatDateRange(start: string, end?: string) {
  if (!end) {
    return formatDate(start, { dateStyle: "long" });
  }

  const startDate = formatDate(start, { day: "2-digit", month: "short" });
  const endDate = formatDate(end, { day: "2-digit", month: "short", year: "numeric" });

  return `${startDate} - ${endDate}`;
}
