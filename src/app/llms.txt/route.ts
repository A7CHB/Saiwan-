import { absoluteUrl, siteUrl } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { getWhatsAppNumber } from "@/lib/whatsapp";
import { SHOW_INSPIRATION } from "@/lib/constants";

/**
 * `/llms.txt` — the site, in plain prose, for an assistant reading it.
 *
 * A convention rather than a standard: a short Markdown brief at the site root
 * saying what the business is and which pages matter, for models that fetch a
 * site instead of crawling it. Nothing is obliged to read it, which is the
 * honest caveat; the cost of publishing it is one route.
 *
 * It is generated from the catalogue rather than written out, for the same
 * reason the sitemap is: a hand-maintained copy of a product list is a copy
 * that is wrong within a month. The English locale is used throughout — the
 * other two are linked rather than duplicated, since an assistant that wants
 * Arabic will follow the hreflang.
 */
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  let products: { slug: string; translations: { name: string; tagline: string | null }[] }[] = [];
  let categories: { slug: string; translations: { name: string }[] }[] = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
        select: {
          slug: true,
          translations: { where: { locale: "en" }, select: { name: true, tagline: true } },
        },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { slug: true, translations: { where: { locale: "en" }, select: { name: true } } },
      }),
    ]);
  } catch {
    // A database hiccup should still produce a usable brief of the static
    // pages, exactly as the sitemap does.
  }

  const phone = getWhatsAppNumber();
  const name = (t: { name: string }[], fallback: string) => t[0]?.name ?? fallback;

  const lines = [
    "# Saiwan",
    "",
    "> Saiwan designs and engineers premium patio umbrellas and large-scale shade",
    "> systems for villas, hotels, restaurants and terraces. Based in Erbil,",
    "> serving the Kurdistan Region and Iraq.",
    "",
    "Saiwan (Kurdish: سەیوان, Arabic: سايوان) means shade-giver. Canopies are",
    "solution-dyed acrylic on marine-grade anodised aluminium frames with",
    "stainless steel fixings. Canopies are replaceable and fixings serviceable.",
    "",
    "Orders and quotations are handled over WhatsApp rather than an online",
    "checkout: a piece is configured on its page and the specification is sent",
    "as a message. There is no customer account and no cart.",
    ...(phone ? [`WhatsApp: +${phone}`, ""] : []),
    "The site is published in English, Arabic and Kurdish (Sorani). Paths are",
    "prefixed with the locale — `/en`, `/ar`, `/ckb` — and every page declares",
    "the other two with hreflang.",
    "",
    "## Pages",
    "",
    `- [Collection](${absoluteUrl("/en/collection")}): every piece, filterable by category, style, setting and size.`,
    `- [Find your shade](${absoluteUrl("/en/find-your-shade")}): a six-question consultation that returns a shortlist.`,
    `- [About](${absoluteUrl("/en/about")}): materials, engineering standard and how specification works.`,
    `- [Contact](${absoluteUrl("/en/contact")}): WhatsApp, an enquiry form, and answers to common questions.`,
    ...(SHOW_INSPIRATION
      ? [`- [Inspiration](${absoluteUrl("/en/inspiration")}): installed work, by setting.`]
      : []),
    `- [Sitemap](${siteUrl()}/sitemap.xml): every URL in all three languages.`,
    "",
  ];

  if (categories.length > 0) {
    lines.push("## Categories", "");
    for (const category of categories) {
      lines.push(
        `- [${name(category.translations, category.slug)}](${absoluteUrl(`/en/collection?category=${category.slug}`)})`,
      );
    }
    lines.push("");
  }

  if (products.length > 0) {
    lines.push("## Pieces", "");
    for (const product of products) {
      const tagline = product.translations[0]?.tagline;
      lines.push(
        `- [${name(product.translations, product.slug)}](${absoluteUrl(`/en/collection/${product.slug}`)})` +
          (tagline ? `: ${tagline}` : ""),
      );
    }
    lines.push("");
  }

  // Blank lines are load-bearing in Markdown — a heading that follows a
  // paragraph without one is not a heading — so the list is joined as written.
  return new Response(lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
