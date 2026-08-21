import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, EmptyState, PageHeader, Panel, Table, Td, Th } from "@/components/admin/ui";
import { setProductStatusAction } from "@/lib/admin/actions";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole("STAFF");

  const query = await searchParams;
  const status = one(query.status);
  const search = (one(query.q) ?? "").trim();
  const categoryId = one(query.category);

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(status && PRODUCT_STATUSES.includes(status as never) ? { status } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? {
              // `insensitive` because Postgres LIKE is case-sensitive: without
              // it searching "aria" never finds "Aria".
              OR: [
                { slug: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { translations: { some: { name: { contains: search, mode: "insensitive" } } } },
              ],
            }
          : {}),
      },
      orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        sku: true,
        status: true,
        isFeatured: true,
        price: true,
        currency: true,
        showPrice: true,
        viewCount: true,
        whatsappCount: true,
        images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
        translations: { where: { locale: "en" }, select: { name: true } },
        category: { select: { translations: { where: { locale: "en" }, select: { name: true } }, slug: true } },
        _count: { select: { translations: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, slug: true, translations: { where: { locale: "en" }, select: { name: true } } },
    }),
  ]);

  const filterLink = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, q: search || undefined, category: categoryId, ...patch };
    for (const [key, value] of Object.entries(merged)) if (value) params.set(key, value);
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <AdminFrame>
      <PageHeader
        title="Products"
        description="The catalogue. A piece is only visible to customers once it is published."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3.5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            New product
          </Link>
        }
      />

      {/* Filters — GET form, so every view is a shareable URL. */}
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-line bg-elevated p-4">
        <label className="flex flex-1 flex-col gap-1.5 sm:max-w-xs">
          <span className="text-xs font-medium text-muted">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Name, slug or SKU"
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Category</span>
          <select
            name="category"
            defaultValue={categoryId ?? ""}
            className="rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.translations[0]?.name ?? category.slug}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="h-9 rounded-md border border-line px-4 text-sm transition-colors hover:border-line-strong"
        >
          Apply
        </button>
      </form>

      <nav className="mb-4 flex flex-wrap gap-1.5" aria-label="Filter by status">
        {[undefined, ...PRODUCT_STATUSES].map((option) => (
          <Link
            key={option ?? "all"}
            href={filterLink({ status: option })}
            aria-current={status === option || (!status && !option) ? "page" : undefined}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              (status ?? undefined) === option
                ? "border-accent bg-accent/10 text-accent"
                : "border-line text-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {option ? option.toLowerCase() : "all"}
          </Link>
        ))}
      </nav>

      <Panel bodyClassName="p-0">
        {products.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No products match"
              description="Adjust the filters, or create the first piece in the catalogue."
              action={
                <Link
                  href="/admin/products/new"
                  className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
                >
                  New product
                </Link>
              }
            />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th className="w-14" />
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th align="end">Price</Th>
                <Th align="end">Views</Th>
                <Th align="end">WhatsApp</Th>
                <Th align="end">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const name = product.translations[0]?.name ?? product.slug;
                const image = product.images[0]?.url;
                return (
                  <tr key={product.id} className="transition-colors hover:bg-sunken/60">
                    <Td>
                      <span className="block size-10 overflow-hidden rounded bg-sunken">
                        {image ? (
                          <Image
                            src={image}
                            alt=""
                            width={40}
                            height={40}
                            unoptimized={image.endsWith(".svg")}
                            className="size-10 object-cover"
                          />
                        ) : null}
                      </span>
                    </Td>
                    <Td>
                      <Link href={`/admin/products/${product.id}`} className="font-medium hover:text-accent">
                        {name}
                      </Link>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-subtle">
                        {product.slug}
                        {product.isFeatured ? <Badge tone="accent">featured</Badge> : null}
                        {product._count.translations < 3 ? (
                          <Badge tone="warning">{product._count.translations}/3 languages</Badge>
                        ) : null}
                      </span>
                    </Td>
                    <Td className="text-muted">
                      {product.category.translations[0]?.name ?? product.category.slug}
                    </Td>
                    <Td>
                      <Badge
                        tone={
                          product.status === "PUBLISHED"
                            ? "success"
                            : product.status === "DRAFT"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {product.status.toLowerCase()}
                      </Badge>
                    </Td>
                    <Td align="end" className="tabular-nums text-muted">
                      {product.price != null
                        ? `${product.showPrice ? "" : "("}${product.currency} ${product.price}${product.showPrice ? "" : ")"}`
                        : "—"}
                    </Td>
                    <Td align="end" className="tabular-nums text-muted">
                      {product.viewCount}
                    </Td>
                    <Td align="end" className="tabular-nums text-muted">
                      {product.whatsappCount}
                    </Td>
                    <Td align="end">
                      <form action={setProductStatusAction} className="inline-flex items-center gap-2">
                        <input type="hidden" name="id" value={product.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"}
                        />
                        <button
                          type="submit"
                          className="rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-line-strong"
                        >
                          {product.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>
    </AdminFrame>
  );
}
