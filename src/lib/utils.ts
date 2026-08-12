import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales, so the custom font sizes
 * declared in `@theme` (`text-title`, `text-lead`, …) look to it like colour
 * utilities. Merging `cn("text-title", "text-fg")` would then drop the size and
 * silently render a display heading at body scale. Teaching it the scale keeps
 * size and colour in separate conflict groups.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "hero", "title", "heading", "lead"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** URL- and filename-safe slug. Falls back to a stable token for non-Latin input. */
export function slugify(input: string): string {
  const base = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${Math.random().toString(36).slice(2, 8)}`;
}

/** Parse a JSON column, returning `fallback` on any malformed value. */
export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Human-facing inquiry reference, e.g. SW-7QK2M4. */
export function inquiryReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
  let out = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return `SW-${out}`;
}

export function truncate(value: string, max: number) {
  return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}

/** Strip everything but digits — WhatsApp deep links reject formatting. */
export function normalisePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export function isValidPhone(value: string): boolean {
  const digits = normalisePhone(value);
  return digits.length >= 8 && digits.length <= 15;
}
