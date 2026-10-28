const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** $1,234.56 from integer cents. Whole dollars drop the decimals ($25). */
export function formatCents(cents: number): string {
  return cents % 100 === 0 ? usdWhole.format(cents / 100) : usd.format(cents / 100);
}

const longDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** October 28, 2026 from an ISO date, always in UTC so server and client agree. */
export function formatDate(iso: string): string {
  return longDate.format(new Date(`${iso}T00:00:00Z`));
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function pluralize(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function termLabel(months: number): string {
  if (months === 1) return "billed monthly";
  if (months === 12) return "billed yearly";
  return `${months}-month term`;
}
