import { NextResponse, type NextRequest } from "next/server";
import { getProductsByIds } from "@/lib/data/products";
import { resolveLocale } from "@/lib/i18n/config";
import { COMPARE_LIMIT, LOCALE_COOKIE, SAVED_LIMIT } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Products by id, for the two device-local lists.
 *
 * Both the comparison tray and the saved page hold ids in localStorage, which
 * the server cannot see; this is how those ids become products. `detail=card`
 * returns the full card model the saved grid renders, otherwise just enough for
 * a tray thumbnail.
 */
export async function GET(request: NextRequest) {
  const full = request.nextUrl.searchParams.get("detail") === "card";
  const ids = (request.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, full ? SAVED_LIMIT : COMPARE_LIMIT);

  if (ids.length === 0) return NextResponse.json({ products: [] });

  const locale = resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const products = await getProductsByIds(ids, locale);

  return NextResponse.json(
    {
      products: full
        ? products
        : products.map((product) => ({
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
          })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
