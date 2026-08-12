import { NextResponse, type NextRequest } from "next/server";
import { searchProducts, recordSearch } from "@/lib/data/search";
import { resolveLocale } from "@/lib/i18n/config";
import { LOCALE_COOKIE, VISITOR_COOKIE } from "@/lib/constants";

export const dynamic = "force-dynamic";

/** Instant-search endpoint used by the header dialog. */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.slice(0, 120) ?? "";
  const locale = resolveLocale(
    request.nextUrl.searchParams.get("locale") ?? request.cookies.get(LOCALE_COOKIE)?.value,
  );

  if (query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchProducts(query, locale, 8);

    // Logged for the admin's "what are people looking for" view. Not awaited —
    // search latency is the whole point of this endpoint.
    void recordSearch(query, locale, results.length, request.cookies.get(VISITOR_COOKIE)?.value);

    return NextResponse.json(
      {
        results: results.map((result) => ({
          id: result.id,
          slug: result.slug,
          name: result.name,
          categoryName: result.categoryName,
          image: result.image,
          imageAlt: result.imageAlt,
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ results: [], error: "search_failed" }, { status: 500 });
  }
}
