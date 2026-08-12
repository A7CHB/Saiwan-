import { NextResponse, type NextRequest } from "next/server";
import { getProductsByIds } from "@/lib/data/products";
import { resolveLocale } from "@/lib/i18n/config";
import { COMPARE_LIMIT, LOCALE_COOKIE } from "@/lib/constants";

export const dynamic = "force-dynamic";

/** Thumbnails for the comparison tray, which holds ids rather than objects. */
export async function GET(request: NextRequest) {
  const ids = (request.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, COMPARE_LIMIT);

  if (ids.length === 0) return NextResponse.json({ products: [] });

  const locale = resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const products = await getProductsByIds(ids, locale);

  return NextResponse.json(
    {
      products: products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
