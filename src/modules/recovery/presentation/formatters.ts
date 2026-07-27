export function formatCurrencyMinor(
  amountMinor: number,
  currencyCode: string,
  locale: string,
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function formatDateTime(value: string, locale: string, timeZone: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

export function formatRelativeTime(value: string, locale: string, now = new Date()) {
  const differenceMinutes = Math.round(
    (new Date(value).getTime() - now.getTime()) / 60_000,
  );
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(differenceMinutes) < 60) {
    return formatter.format(differenceMinutes, "minute");
  }

  const differenceHours = Math.round(differenceMinutes / 60);
  if (Math.abs(differenceHours) < 24) {
    return formatter.format(differenceHours, "hour");
  }

  return formatter.format(Math.round(differenceHours / 24), "day");
}
