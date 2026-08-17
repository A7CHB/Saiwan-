import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";

/**
 * The product ids a customer has saved.
 *
 * Read once per request in the site layout and handed to `FavoritesProvider`,
 * so the client never has to ask the API which pieces are saved.
 */
export const getFavoriteProductIds = cache(async (userId: string): Promise<string[]> => {
  try {
    const rows = await prisma.favorite.findMany({
      where: { userId },
      select: { productId: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => row.productId);
  } catch {
    // A saved-pieces hiccup must never take the whole layout down.
    return [];
  }
});
