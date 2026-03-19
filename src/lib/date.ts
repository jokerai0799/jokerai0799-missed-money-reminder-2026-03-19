const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function parseDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function addDays(base: string | Date, days: number): Date {
  const date = typeof base === "string" ? new Date(base) : new Date(base);
  date.setDate(date.getDate() + days);
  return date;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isPastDay(date: Date, now = new Date()): boolean {
  if (isSameDay(date, now)) return false;
  const normalized = new Date(now);
  normalized.setHours(0, 0, 0, 0);
  return date.getTime() < normalized.getTime();
}

export function formatShortDate(value?: string): string {
  const parsed = parseDate(value);
  if (!parsed) return "—";
  return DATE_FORMATTER.format(parsed);
}

export function formatFullDate(value?: string): string {
  const parsed = parseDate(value);
  if (!parsed) return "—";
  return FULL_DATE_FORMATTER.format(parsed);
}

export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function daysFromNow(value?: string, now = new Date()): number | null {
  const parsed = parseDate(value);
  if (!parsed) return null;
  const diffMs = parsed.getTime() - now.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function describeDueState(value?: string): string {
  const diff = daysFromNow(value);
  if (diff === null) return "No date";
  if (diff === 0) return "due today";
  if (diff > 0) return `due in ${diff}d`;
  return `${Math.abs(diff)}d overdue`;
}
