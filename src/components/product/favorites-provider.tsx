"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SAVED_LIMIT } from "@/lib/constants";

const STORAGE_KEY = "saiwan_saved";

type FavoritesContextValue = {
  /** Most recently saved first — the order the saved page renders in. */
  ids: string[];
  count: number;
  /** False until localStorage has been read, so the UI can avoid a flash. */
  ready: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function read(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(0, SAVED_LIMIT);
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* private mode or a full quota — the session still works, it just forgets */
  }
}

/**
 * Saved pieces, held on the device.
 *
 * Saving is a browsing gesture, not a membership: nobody should have to create
 * an account to keep a shortlist of umbrellas. The list lives in localStorage
 * exactly like the comparison tray, which means it survives a reload, costs no
 * requests, and leaves no personal data on our servers.
 *
 * The trade-off is honest and stated on the saved page: the list belongs to
 * this browser and does not follow the visitor to another device.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Read after mount: the server has no way to know what this device saved, so
  // rendering from storage during the first paint would break hydration.
  useEffect(() => {
    setIds(read());
    setReady(true);
  }, []);

  // Keep two tabs of the same site in agreement.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setIds(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: string[]) => {
    setIds(next);
    write(next);
  }, []);

  const toggle = useCallback((productId: string) => {
    setIds((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [productId, ...current].slice(0, SAVED_LIMIT);
      write(next);
      return next;
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      count: ids.length,
      ready,
      has: (productId: string) => ids.includes(productId),
      toggle,
      remove: (productId: string) => commit(ids.filter((id) => id !== productId)),
      clear: () => commit([]),
    }),
    [ids, ready, toggle, commit],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
