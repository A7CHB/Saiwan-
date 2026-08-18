"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authorize, destroyAllSessions } from "@/lib/auth/session";
import { hashPassword, passwordIssues } from "@/lib/auth/password";
import { locales } from "@/lib/i18n/config";
import {
  AVAILABILITIES,
  GALLERY_TAGS,
  IMAGE_SPANS,
  INQUIRY_STATUSES,
  PRODUCT_STATUSES,
  ROLES,
  SEGMENTS,
  STYLES,
  USE_CASES,
} from "@/lib/constants";
import { slugify } from "@/lib/utils";

/**
 * Every mutation the admin can perform.
 *
 * Two rules hold throughout, without exception:
 *   1. The first statement of every action is an `authorize()` call. A server
 *      action is a public HTTP endpoint — the sidebar not rendering a link is
 *      not access control.
 *   2. Input is parsed with Zod before it reaches Prisma, so a hand-crafted
 *      POST cannot set a column the form never exposed (`role`, `status`, …).
 */

export type ActionState = { error?: string; ok?: boolean; message?: string };

const DENIED: ActionState = { error: "You do not have permission to perform this action." };

/** Records who changed what — the minimum an admin panel owes a business. */
async function audit(userId: string, action: string, entity: string, entityId?: string, meta?: unknown) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ?? null,
        meta: meta ? JSON.stringify(meta).slice(0, 2000) : null,
      },
    });
  } catch {
    /* auditing must never block the operation it describes */
  }
}

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const num = (formData: FormData, key: string) => {
  const value = str(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const bool = (formData: FormData, key: string) => formData.get(key) === "on" || formData.get(key) === "true";

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const productSchema = z.object({
  slug: z.string().min(1).max(120),
  sku: z.string().max(40).nullable(),
  categoryId: z.string().min(1),
  status: z.enum(PRODUCT_STATUSES),
  isFeatured: z.boolean(),
  order: z.number().int().min(0).max(9999),
  price: z.number().min(0).max(10_000_000).nullable(),
  currency: z.string().min(3).max(4),
  showPrice: z.boolean(),
  availability: z.enum(AVAILABILITIES),
  leadTimeDays: z.number().int().min(0).max(3650).nullable(),
  style: z.enum(STYLES),
  segment: z.enum(SEGMENTS),
  useCases: z.array(z.enum(USE_CASES)),
  coverageM2: z.number().min(0).max(100_000).nullable(),
  priceTier: z.number().int().min(1).max(3),
});

function readProductForm(formData: FormData) {
  return productSchema.safeParse({
    slug: slugify(str(formData, "slug") || str(formData, "name_en")),
    sku: str(formData, "sku") || null,
    categoryId: str(formData, "categoryId"),
    status: str(formData, "status"),
    isFeatured: bool(formData, "isFeatured"),
    order: num(formData, "order") ?? 0,
    price: num(formData, "price"),
    currency: str(formData, "currency") || "USD",
    showPrice: bool(formData, "showPrice"),
    availability: str(formData, "availability"),
    leadTimeDays: num(formData, "leadTimeDays"),
    style: str(formData, "style"),
    segment: str(formData, "segment"),
    useCases: formData.getAll("useCases").map(String),
    coverageM2: num(formData, "coverageM2"),
    priceTier: num(formData, "priceTier") ?? 2,
  });
}

/** JSON columns are edited as one-per-line text, which is what a human wants. */
function linesToJson(value: string): string {
  return JSON.stringify(
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );
}

/** "Label: value" per line → [{label, value}]. */
function specsToJson(value: string): string {
  return JSON.stringify(
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return separator === -1
          ? { label: line, value: "" }
          : { label: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() };
      }),
  );
}

export async function saveProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("STAFF");
  if (!user) return DENIED;

  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  }

  const id = str(formData, "id") || null;
  const data = parsed.data;

  const clash = await prisma.product.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (clash && clash.id !== id) return { error: `The slug "${data.slug}" is already in use.` };

  const payload = {
    slug: data.slug,
    sku: data.sku,
    categoryId: data.categoryId,
    status: data.status,
    isFeatured: data.isFeatured,
    order: data.order,
    price: data.price,
    currency: data.currency.toUpperCase(),
    showPrice: data.showPrice,
    availability: data.availability,
    leadTimeDays: data.leadTimeDays,
    style: data.style,
    segment: data.segment,
    useCases: JSON.stringify(data.useCases),
    coverageM2: data.coverageM2,
    priceTier: data.priceTier,
  };

  const product = id
    ? await prisma.product.update({ where: { id }, data: payload, select: { id: true } })
    : await prisma.product.create({ data: payload, select: { id: true } });

  // Translations: one row per locale, upserted so a blank language is not lost.
  for (const locale of locales) {
    const name = str(formData, `name_${locale}`);
    if (!name) continue;

    const translation = {
      name: name.slice(0, 160),
      tagline: str(formData, `tagline_${locale}`).slice(0, 300) || null,
      description: str(formData, `description_${locale}`).slice(0, 4000) || null,
      craft: str(formData, `craft_${locale}`).slice(0, 4000) || null,
      features: linesToJson(str(formData, `features_${locale}`)),
      specs: specsToJson(str(formData, `specs_${locale}`)),
      metaTitle: str(formData, `metaTitle_${locale}`).slice(0, 160) || null,
      metaDescription: str(formData, `metaDescription_${locale}`).slice(0, 300) || null,
    };

    await prisma.productTranslation.upsert({
      where: { productId_locale: { productId: product.id, locale } },
      update: translation,
      create: { productId: product.id, locale, ...translation },
    });
  }

  // Images: a newline-separated list of URLs, rewritten wholesale.
  const imageLines = str(formData, "images")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 24);

  if (imageLines.length > 0 || str(formData, "images") === "") {
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    if (imageLines.length > 0) {
      await prisma.productImage.createMany({
        data: imageLines.map((url, index) => ({
          productId: product.id,
          url: url.slice(0, 600),
          alt: str(formData, `name_en`) || data.slug,
          order: index,
        })),
      });
    }
  }

  // Option links
  await syncLinks(
    product.id,
    formData.getAll("colorIds").map(String),
    (productId, colorId, order) => prisma.productColor.create({ data: { productId, colorId, order } }),
    () => prisma.productColor.deleteMany({ where: { productId: product.id } }),
  );
  await syncLinks(
    product.id,
    formData.getAll("sizeIds").map(String),
    (productId, sizeId, order) => prisma.productSize.create({ data: { productId, sizeId, order } }),
    () => prisma.productSize.deleteMany({ where: { productId: product.id } }),
  );
  await syncLinks(
    product.id,
    formData.getAll("materialIds").map(String),
    (productId, materialId) => prisma.productMaterial.create({ data: { productId, materialId } }),
    () => prisma.productMaterial.deleteMany({ where: { productId: product.id } }),
  );
  await syncLinks(
    product.id,
    formData.getAll("accessoryIds").map(String).filter((accessoryId) => accessoryId !== product.id),
    (productId, accessoryId, order) => prisma.productAccessory.create({ data: { productId, accessoryId, order } }),
    () => prisma.productAccessory.deleteMany({ where: { productId: product.id } }),
  );

  await audit(user.id, id ? "product.update" : "product.create", "Product", product.id, { slug: data.slug });

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect(`/admin/products/${product.id}?saved=1`);
}

async function syncLinks(
  productId: string,
  ids: string[],
  create: (productId: string, id: string, order: number) => Promise<unknown>,
  clear: () => Promise<unknown>,
) {
  await clear();
  const unique = Array.from(new Set(ids.filter(Boolean)));
  for (const [index, id] of unique.entries()) {
    await create(productId, id, index);
  }
}

export async function setProductStatusAction(formData: FormData) {
  const user = await authorize("STAFF");
  if (!user) return;

  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id || !PRODUCT_STATUSES.includes(status as never)) return;

  await prisma.product.update({ where: { id }, data: { status } });
  await audit(user.id, "product.status", "Product", id, { status });

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}

export async function deleteProductAction(formData: FormData) {
  // Destructive and irreversible — ADMIN only, never STAFF.
  const user = await authorize("ADMIN");
  if (!user) return;

  const id = str(formData, "id");
  if (!id) return;

  await prisma.product.delete({ where: { id } });
  await audit(user.id, "product.delete", "Product", id);

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function saveCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("STAFF");
  if (!user) return DENIED;

  const id = str(formData, "id") || null;
  const slug = slugify(str(formData, "slug") || str(formData, "name_en"));
  if (!slug) return { error: "A slug or English name is required." };

  const clash = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
  if (clash && clash.id !== id) return { error: `The slug "${slug}" is already in use.` };

  const payload = {
    slug,
    order: num(formData, "order") ?? 0,
    isActive: bool(formData, "isActive"),
    imageUrl: str(formData, "imageUrl").slice(0, 600) || null,
  };

  const category = id
    ? await prisma.category.update({ where: { id }, data: payload, select: { id: true } })
    : await prisma.category.create({ data: payload, select: { id: true } });

  for (const locale of locales) {
    const name = str(formData, `name_${locale}`);
    if (!name) continue;
    const translation = {
      name: name.slice(0, 160),
      tagline: str(formData, `tagline_${locale}`).slice(0, 300) || null,
      description: str(formData, `description_${locale}`).slice(0, 2000) || null,
    };
    await prisma.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale } },
      update: translation,
      create: { categoryId: category.id, locale, ...translation },
    });
  }

  await audit(user.id, id ? "category.update" : "category.create", "Category", category.id, { slug });

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { ok: true, message: "Category saved." };
}

export async function deleteCategoryAction(formData: FormData) {
  const user = await authorize("ADMIN");
  if (!user) return;

  const id = str(formData, "id");
  if (!id) return;

  // Deleting a category with products would orphan them — refuse instead.
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;

  await prisma.category.delete({ where: { id } });
  await audit(user.id, "category.delete", "Category", id);

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------

export async function updateInquiryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("STAFF");
  if (!user) return DENIED;

  const id = str(formData, "id");
  const status = str(formData, "status");
  const note = str(formData, "adminNotes");

  if (!id) return { error: "Missing inquiry." };
  if (status && !INQUIRY_STATUSES.includes(status as never)) return { error: "Unknown status." };

  const existing = await prisma.inquiry.findUnique({ where: { id }, select: { status: true } });
  if (!existing) return { error: "Inquiry not found." };

  await prisma.inquiry.update({
    where: { id },
    data: { ...(status ? { status } : {}), adminNotes: note.slice(0, 4000) || null },
  });

  // Status changes are appended to the timeline rather than overwriting it.
  if (status && status !== existing.status) {
    await prisma.inquiryEvent.create({
      data: { inquiryId: id, status, note: note.slice(0, 500) || null, actor: user.name },
    });
  }

  await audit(user.id, "inquiry.update", "Inquiry", id, { status });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true, message: "Inquiry updated." };
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export async function saveGalleryItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("STAFF");
  if (!user) return DENIED;

  const id = str(formData, "id") || null;
  const url = str(formData, "url");
  if (!url) return { error: "An image URL is required." };

  const tag = str(formData, "tag");
  const span = str(formData, "span");

  const payload = {
    url: url.slice(0, 600),
    alt: str(formData, "alt").slice(0, 300) || null,
    tag: GALLERY_TAGS.includes(tag as never) ? tag : "villa",
    span: IMAGE_SPANS.includes(span as never) ? span : "NORMAL",
    order: num(formData, "order") ?? 0,
    isActive: bool(formData, "isActive"),
  };

  const item = id
    ? await prisma.galleryItem.update({ where: { id }, data: payload, select: { id: true } })
    : await prisma.galleryItem.create({ data: payload, select: { id: true } });

  for (const locale of locales) {
    const caption = str(formData, `caption_${locale}`);
    const location = str(formData, `location_${locale}`);
    if (!caption && !location) continue;
    await prisma.galleryItemTranslation.upsert({
      where: { itemId_locale: { itemId: item.id, locale } },
      update: { caption: caption || null, location: location || null },
      create: { itemId: item.id, locale, caption: caption || null, location: location || null },
    });
  }

  await audit(user.id, id ? "gallery.update" : "gallery.create", "GalleryItem", item.id);

  revalidatePath("/admin/gallery");
  revalidatePath("/", "layout");
  return { ok: true, message: "Gallery item saved." };
}

export async function deleteGalleryItemAction(formData: FormData) {
  const user = await authorize("STAFF");
  if (!user) return;

  const id = str(formData, "id");
  if (!id) return;

  await prisma.galleryItem.delete({ where: { id } });
  await audit(user.id, "gallery.delete", "GalleryItem", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Content, translations and settings
// ---------------------------------------------------------------------------

export async function saveContentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("STAFF");
  if (!user) return DENIED;

  const key = str(formData, "key");
  if (!key) return { error: "Missing content key." };

  for (const locale of locales) {
    const raw = str(formData, `value_${locale}`);
    if (!raw) continue;
    try {
      JSON.parse(raw); // stored as text, but must be valid JSON to be readable
    } catch {
      return { error: `The ${locale.toUpperCase()} value is not valid JSON.` };
    }
    await prisma.contentBlock.upsert({
      where: { key_locale: { key, locale } },
      update: { value: raw },
      create: { key, locale, value: raw },
    });
  }

  await audit(user.id, "content.update", "ContentBlock", key);

  revalidatePath("/admin/content");
  revalidatePath("/", "layout");
  return { ok: true, message: "Content saved." };
}

export async function saveTranslationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("STAFF");
  if (!user) return DENIED;

  const key = str(formData, "key");
  const locale = str(formData, "locale");
  const value = str(formData, "value");

  if (!key || !locales.includes(locale as never)) return { error: "Invalid key or language." };

  if (!value) {
    // Clearing an override restores the compiled dictionary string.
    await prisma.translation.deleteMany({ where: { locale, key } });
  } else {
    await prisma.translation.upsert({
      where: { locale_namespace_key: { locale, namespace: "common", key } },
      update: { value: value.slice(0, 2000) },
      create: { locale, namespace: "common", key, value: value.slice(0, 2000) },
    });
  }

  await audit(user.id, "translation.update", "Translation", `${locale}:${key}`);

  revalidatePath("/admin/translations");
  revalidatePath("/", "layout");
  return { ok: true, message: value ? "Override saved." : "Override removed." };
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("ADMIN");
  if (!user) return DENIED;

  const keys = ["contact.whatsapp", "contact.email", "contact.address", "brand.currency"];
  for (const key of keys) {
    const value = str(formData, key).slice(0, 500);
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  await audit(user.id, "settings.update", "Setting");

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function saveUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await authorize("ADMIN");
  if (!user) return DENIED;

  const id = str(formData, "id") || null;
  const email = str(formData, "email").toLowerCase();
  const name = str(formData, "name");
  const role = str(formData, "role");
  const password = String(formData.get("password") ?? "");
  const isActive = bool(formData, "isActive");

  if (!z.string().email().safeParse(email).success) return { error: "Enter a valid email address." };
  if (name.length < 2) return { error: "A name is required." };
  if (!ROLES.includes(role as never)) return { error: "Unknown role." };

  // Guard against locking the business out of its own admin.
  if (id === user.id && (role !== "ADMIN" || !isActive)) {
    return { error: "You cannot remove your own administrator access." };
  }

  if (password) {
    const issue = passwordIssues(password);
    if (issue) return { error: "Password must be at least 8 characters and include a letter and a number." };
  }

  const clash = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (clash && clash.id !== id) return { error: "Another account already uses that email." };

  const payload = {
    email,
    name: name.slice(0, 80),
    phone: str(formData, "phone").slice(0, 30) || null,
    role,
    isActive,
    ...(password ? { passwordHash: await hashPassword(password) } : {}),
  };

  if (id) {
    await prisma.user.update({ where: { id }, data: payload });
    // A role change or a deactivation must take effect immediately, not at the
    // end of the session's 30-day lifetime.
    if (password || !isActive) await destroyAllSessions(id);
  } else {
    if (!password) return { error: "A password is required for a new account." };
    await prisma.user.create({ data: { ...payload, passwordHash: await hashPassword(password) } });
  }

  await audit(user.id, id ? "user.update" : "user.create", "User", id ?? email, { role, isActive });

  revalidatePath("/admin/team");
  return { ok: true, message: "Account saved." };
}
