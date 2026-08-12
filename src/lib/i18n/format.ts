import { localeMeta, type Locale } from "./config";

/**
 * Interpolate `{name}` placeholders. Kept deliberately tiny — the dictionaries
 * are typed objects accessed directly (`d.home.hero.title`), so this is the
 * only runtime string work localisation needs.
 */
export function fmt(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(localeMeta[locale].intl, options).format(value);
}

/**
 * Currency symbols we compose ourselves.
 *
 * `Intl.NumberFormat({ style: "currency" })` is NOT safe here: Node and the
 * browser ship different ICU builds, so `ckb-IQ` renders USD as "US$ 2,400" on
 * the server and "$2,400" in Chrome — a hydration mismatch on every price.
 * Formatting the number with Intl (which is consistent) and placing the symbol
 * ourselves is deterministic everywhere.
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  IQD: "IQD",
  AED: "AED",
  SAR: "SAR",
  TRY: "₺",
};

export function formatPrice(
  value: number,
  locale: Locale,
  currency = "USD",
  options?: Intl.NumberFormatOptions,
) {
  const code = currency.toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code] ?? code;
  const amount = new Intl.NumberFormat(localeMeta[locale].intl, {
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    ...options,
  }).format(value);

  // RTL scripts read the amount first, then the unit.
  return localeMeta[locale].dir === "rtl" ? `${amount} ${symbol}` : `${symbol}${amount}`;
}

export function formatDate(value: Date | string, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  const date = typeof value === "string" ? new Date(value) : value;

  // `dateStyle`/`timeStyle` are mutually exclusive with the component options
  // (day/month/year). Merging them throws "Invalid option", so the defaults are
  // only applied when the caller has not chosen a style.
  const usesStyle = Boolean(options?.dateStyle || options?.timeStyle);
  const base: Intl.DateTimeFormatOptions = usesStyle
    ? {}
    : { day: "numeric", month: "short", year: "numeric" };

  return new Intl.DateTimeFormat(localeMeta[locale].intl, { ...base, ...options }).format(date);
}

/** "3 days ago" style, used in the admin activity feeds. */
export function formatRelative(value: Date | string, locale: Locale) {
  const date = typeof value === "string" ? new Date(value) : value;
  const diff = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(localeMeta[locale].intl, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return rtf.format(Math.round(diff / 1000), "second");
}
