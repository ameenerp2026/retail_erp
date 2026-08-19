// utils/dateFormat.ts
//
// Centralised date formatting helpers. All date rendering should go through
// these so the display format stays consistent and is changed in one place.
//
// The helpers are intentionally defensive: the API returns ISO strings
// (e.g. "2026-04-01T00:00:00.000Z") while some legacy/mock data is already
// pre-formatted (e.g. "01 Apr 2026"). Anything that cannot be parsed is
// returned untouched rather than rendering "Invalid Date".

export type DateInput = string | number | Date | null | undefined;

/** Shown when a date is missing or empty. */
export const DATE_PLACEHOLDER = "—";

const LOCALE = "en-GB";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

const DATE_LONG_OPTS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
};

const TIME_OPTS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

/** Parse any supported input into a valid Date, or null when not parseable. */
function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Fallback for values that aren't parseable as a date. Pre-formatted strings
 * pass straight through so existing display values keep working.
 */
function fallback(value: DateInput, placeholder: string): string {
  if (typeof value === "string" && value.trim() !== "") return value;
  return placeholder;
}

/** "01 Apr 2026" — the default format used in tables and detail panels. */
export const formatDate = (
  value: DateInput,
  placeholder = DATE_PLACEHOLDER,
): string => {
  const date = toDate(value);
  if (!date) return fallback(value, placeholder);
  return date.toLocaleDateString(LOCALE, DATE_OPTS);
};

/** "01 April 2026" — long month variant (used by GSTIN "Last Verified"). */
export const formatDateLong = (
  value: DateInput,
  placeholder = DATE_PLACEHOLDER,
): string => {
  const date = toDate(value);
  if (!date) return fallback(value, placeholder);
  return date.toLocaleDateString(LOCALE, DATE_LONG_OPTS);
};

/** "01 Apr 2026, 9:14 am" — date plus time, for "last modified" columns. */
export const formatDateTime = (
  value: DateInput,
  placeholder = DATE_PLACEHOLDER,
): string => {
  const date = toDate(value);
  if (!date) return fallback(value, placeholder);
  return date.toLocaleString(LOCALE, { ...DATE_OPTS, ...TIME_OPTS });
};

/** "9:14 am" — time only. */
export const formatTime = (
  value: DateInput,
  placeholder = DATE_PLACEHOLDER,
): string => {
  const date = toDate(value);
  if (!date) return fallback(value, placeholder);
  return date.toLocaleTimeString(LOCALE, TIME_OPTS);
};

/** "01 Apr 2026 — 31 Mar 2027" — inclusive range, used for accounting years. */
export const formatDateRange = (
  from: DateInput,
  to: DateInput,
  placeholder = DATE_PLACEHOLDER,
): string => `${formatDate(from, placeholder)} — ${formatDate(to, placeholder)}`;

/** "2026-04-01" — the value shape required by `<input type="date">`. */
export const formatDateForInput = (value: DateInput): string => {
  const date = toDate(value);
  if (!date) return "";

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** "FY 2026-27" — financial year label derived from a start/end date pair. */
export const formatFinancialYearName = (
  from: DateInput,
  to: DateInput,
): string => {
  const fromDate = toDate(from);
  const toDate_ = toDate(to);
  if (!fromDate || !toDate_) return "";

  const startYear = fromDate.getFullYear();
  const endYear = `${toDate_.getFullYear()}`.slice(-2);
  return `FY ${startYear}-${endYear}`;
};

/** Extract just the year, e.g. for deriving period labels. */
export const getYear = (value: DateInput): number | null => {
  const date = toDate(value);
  return date ? date.getFullYear() : null;
};
