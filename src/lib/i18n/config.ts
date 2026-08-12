export const locales = ["en", "ar", "ckb"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

type LocaleMeta = {
  /** Endonym — always shown in the language's own script. */
  label: string;
  /** Short badge used in the compact switcher. */
  short: string;
  dir: "ltr" | "rtl";
  /** BCP‑47 tag for <html lang>, Intl formatters and hreflang. */
  htmlLang: string;
  /** Locale used for number/date formatting (Latin digits everywhere for
   *  price legibility — a deliberate luxury-retail convention). */
  intl: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { label: "English", short: "EN", dir: "ltr", htmlLang: "en", intl: "en-US" },
  ar: { label: "العربية", short: "ع", dir: "rtl", htmlLang: "ar", intl: "ar-IQ-u-nu-latn" },
  ckb: { label: "کوردی", short: "ک", dir: "rtl", htmlLang: "ckb", intl: "ckb-IQ-u-nu-latn" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}

export function isRtl(locale: Locale): boolean {
  return localeMeta[locale].dir === "rtl";
}

/** Prefix an app-relative path with the active locale. */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Best-effort locale negotiation from an Accept-Language header. */
export function negotiateLocale(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split("=")[1]) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith("ckb") || tag.startsWith("ku")) return "ckb";
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}
