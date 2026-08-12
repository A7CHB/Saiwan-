"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { localeMeta, type Locale } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  d: Dictionary;
  /** Prefix an app path with the active locale. */
  href: (path: string) => string;
  /** Interpolate `{placeholders}`. */
  t: (template: string, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Client components read the dictionary from context rather than importing it,
 * so no component hardcodes a translated string and the whole tree can be
 * re-rendered in another language by changing one value at the root.
 */
export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(() => {
    const dir = localeMeta[locale].dir;
    return {
      locale,
      dir,
      isRtl: dir === "rtl",
      d: dictionary,
      href: (path: string) => {
        if (/^(https?:)?\/\//.test(path) || path.startsWith("#")) return path;
        const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
        return `/${locale}${clean}`;
      },
      t: fmt,
    };
  }, [locale, dictionary]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
