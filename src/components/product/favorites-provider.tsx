"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToggleResult = "saved" | "removed" | "unauthorized" | "failed";

type FavoritesContextValue = {
  signedIn: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => Promise<ToggleResult>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Saved-piece state for the whole page.
 *
 * Seeded from the server with the ids the signed-in customer has already saved,
 * so a collection page costs zero requests to render its hearts. Previously
 * every card asked the API about itself on mount — ten or more round-trips per
 * page for information the server already had in hand, doubled in development
 * by StrictMode.
 *
 * Writes still go to `/api/favorites`; only the reads moved.
 */
export function FavoritesProvider({
  initialIds,
  signedIn,
  children,
}: {
  initialIds: string[];
  signedIn: boolean;
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set(initialIds));

  const flip = useCallback((productId: string, saved: boolean) => {
    setIds((current) => {
      const next = new Set(current);
      if (saved) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }, []);

  const toggle = useCallback(
    async (productId: string): Promise<ToggleResult> => {
      const wasSaved = ids.has(productId);

      // Optimistic: the heart fills before the request resolves and rolls back
      // if it fails. A save is not worth a spinner.
      flip(productId, !wasSaved);

      try {
        const response = await fetch("/api/favorites", {
          method: wasSaved ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) return wasSaved ? "removed" : "saved";

        flip(productId, wasSaved);
        return response.status === 401 ? "unauthorized" : "failed";
      } catch {
        flip(productId, wasSaved);
        return "failed";
      }
    },
    [ids, flip],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ signedIn, has: (productId: string) => ids.has(productId), toggle }),
    [ids, signedIn, toggle],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
