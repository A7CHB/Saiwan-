import "server-only";
import { prisma } from "@/lib/db";
import { locales, type Locale } from "@/lib/i18n/config";
import { parseJson } from "@/lib/utils";
import type { Options, ProductFormData } from "@/components/admin/product-form";

/**
 * Builds the two objects the product editor needs: the record itself, flattened
 * to plain form values, and the option lists it can choose from. Kept out of the
 * page so `new` and `[id]` share exactly one shaping of the data.
 */

const EMPTY_TRANSLATION = {
  name: "",
  tagline: "",
  description: "",
  craft: "",
  features: "",
  specs: "",
  metaTitle: "",
  metaDescription: "",
};

function emptyTranslations(): ProductFormData["translations"] {
  return Object.fromEntries(
    locales.map((locale) => [locale, { ...EMPTY_TRANSLATION }]),
  ) as ProductFormData["translations"];
}

export function blankProduct(defaultCategoryId: string): ProductFormData {
  return {
    slug: "",
    sku: "",
    categoryId: defaultCategoryId,
    status: "DRAFT",
    isFeatured: false,
    order: 0,
    price: "",
    currency: "USD",
    showPrice: false,
    availability: "IN_STOCK",
    leadTimeDays: "",
    style: "MODERN",
    segment: "BOTH",
    useCases: [],
    coverageM2: "",
    priceTier: 2,
    images: "",
    colorIds: [],
    sizeIds: [],
    materialIds: [],
    accessoryIds: [],
    translations: emptyTranslations(),
  };
}

export async function loadProductForm(id: string): Promise<ProductFormData | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      translations: true,
      images: { orderBy: { order: "asc" } },
      colors: true,
      sizes: true,
      materials: true,
      accessories: { orderBy: { order: "asc" } },
    },
  });

  if (!product) return null;

  const translations = emptyTranslations();
  for (const translation of product.translations) {
    if (!locales.includes(translation.locale as Locale)) continue;
    translations[translation.locale as Locale] = {
      name: translation.name,
      tagline: translation.tagline ?? "",
      description: translation.description ?? "",
      craft: translation.craft ?? "",
      // JSON columns are edited as plain lines; converted back on save.
      features: parseJson<string[]>(translation.features, []).join("\n"),
      specs: parseJson<{ label: string; value: string }[]>(translation.specs, [])
        .map((spec) => `${spec.label}: ${spec.value}`)
        .join("\n"),
      metaTitle: translation.metaTitle ?? "",
      metaDescription: translation.metaDescription ?? "",
    };
  }

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku ?? "",
    categoryId: product.categoryId,
    status: product.status,
    isFeatured: product.isFeatured,
    order: product.order,
    price: product.price == null ? "" : String(product.price),
    currency: product.currency,
    showPrice: product.showPrice,
    availability: product.availability,
    leadTimeDays: product.leadTimeDays == null ? "" : String(product.leadTimeDays),
    style: product.style,
    segment: product.segment,
    useCases: parseJson<string[]>(product.useCases, []),
    coverageM2: product.coverageM2 == null ? "" : String(product.coverageM2),
    priceTier: product.priceTier,
    images: product.images.map((image) => image.url).join("\n"),
    colorIds: product.colors.map((link) => link.colorId),
    sizeIds: product.sizes.map((link) => link.sizeId),
    materialIds: product.materials.map((link) => link.materialId),
    accessoryIds: product.accessories.map((link) => link.accessoryId),
    translations,
  };
}

export async function loadProductOptions(excludeProductId?: string): Promise<Options> {
  const [categories, colors, sizes, materials, accessories] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, slug: true, translations: { where: { locale: "en" }, select: { name: true } } },
    }),
    prisma.color.findMany({
      orderBy: { order: "asc" },
      select: { id: true, slug: true, hex: true, translations: { where: { locale: "en" }, select: { name: true } } },
    }),
    prisma.size.findMany({ orderBy: { order: "asc" }, select: { id: true, label: true, shape: true } }),
    prisma.material.findMany({
      orderBy: { order: "asc" },
      select: { id: true, slug: true, translations: { where: { locale: "en" }, select: { name: true } } },
    }),
    prisma.product.findMany({
      where: {
        category: { slug: "accessories" },
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, translations: { where: { locale: "en" }, select: { name: true } } },
    }),
  ]);

  return {
    categories: categories.map((category) => ({
      value: category.id,
      label: category.translations[0]?.name ?? category.slug,
    })),
    colors: colors.map((color) => ({
      value: color.id,
      label: color.translations[0]?.name ?? color.slug,
      swatch: color.hex,
    })),
    sizes: sizes.map((size) => ({ value: size.id, label: `${size.label} · ${size.shape.toLowerCase()}` })),
    materials: materials.map((material) => ({
      value: material.id,
      label: material.translations[0]?.name ?? material.slug,
    })),
    accessories: accessories.map((accessory) => ({
      value: accessory.id,
      label: accessory.translations[0]?.name ?? accessory.slug,
    })),
  };
}
