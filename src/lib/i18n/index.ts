import "server-only";
import { cache } from "react";
import type { Dictionary } from "./dictionaries/en";
import en from "./dictionaries/en";
import { prisma } from "@/lib/db";
import type { Locale } from "./config";

const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: async () => ({ default: en }),
  ar: () => import("./dictionaries/ar"),
  ckb: () => import("./dictionaries/ckb"),
};

/** Deep clone that keeps plain objects/strings only — dictionaries hold nothing else. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function setPath(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".");
  let node: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = node[key];
    if (typeof next !== "object" || next === null) return; // never invent new branches
    node = next as Record<string, unknown>;
  }
  const leaf = parts[parts.length - 1];
  if (typeof node[leaf] === "string") node[leaf] = value;
}

/**
 * The dictionary for a locale: the compiled file, with any admin-authored
 * overrides from the `Translation` table layered on top. Memoised per request
 * by `cache()`, so a page that reads it in ten components hits the DB once.
 */
export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const base = (await loaders[locale]()).default;

  let overrides: { key: string; value: string }[] = [];
  try {
    overrides = await prisma.translation.findMany({
      where: { locale },
      select: { key: true, value: true },
    });
  } catch {
    // Content overrides are an enhancement — never let them break a page.
    return base;
  }

  if (overrides.length === 0) return base;

  const merged = clone(base) as unknown as Record<string, unknown>;
  for (const { key, value } of overrides) setPath(merged, key, value);
  return merged as unknown as Dictionary;
});

export type { Dictionary };
