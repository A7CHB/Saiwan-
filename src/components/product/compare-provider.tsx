"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { COMPARE_LIMIT } from "@/lib/constants";

const STORAGE_KEY = "saiwan_compare";

type CompareContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isFull: boolean;
  limit: number;
};

const CompareContext = createContext<CompareContextValue | null>(null);

/**
 * Comparison tray state. Deliberately client-only and persisted to
 * localStorage: comparing pieces is a browsing gesture, not an account
 * feature, and requiring a sign-in for it would cost more conversions than it
 * could ever return.
 */
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setIds(parsed.filter((x): x is string => typeof x === "string").slice(0, COMPARE_LIMIT));
      }
    } catch {
      /* corrupt or unavailable storage — start empty */
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setIds((current) => {
        const next = current.includes(id)
          ? current.filter((x) => x !== id)
          : current.length >= COMPARE_LIMIT
            ? current
            : [...current, id];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const value = useMemo<CompareContextValue>(
    () => ({
      ids,
      has: (id: string) => ids.includes(id),
      toggle,
      remove: (id: string) => persist(ids.filter((x) => x !== id)),
      clear: () => persist([]),
      isFull: ids.length >= COMPARE_LIMIT,
      limit: COMPARE_LIMIT,
    }),
    [ids, toggle, persist],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside <CompareProvider>");
  return ctx;
}
