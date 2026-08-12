import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, PageHeader, Panel, Table, Td, Th } from "@/components/admin/ui";
import { CategoryForm } from "@/components/admin/entity-forms";
import { DangerSubmit } from "@/components/admin/form";
import { deleteCategoryAction } from "@/lib/admin/actions";
import { locales } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("STAFF");
  const query = await searchParams;
  const editId = Array.isArray(query.edit) ? query.edit[0] : query.edit;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: true,
      _count: { select: { products: true } },
    },
  });

  const editing = editId ? categories.find((category) => category.id === editId) : undefined;

  const asFormData = (category: (typeof categories)[number]) => ({
    id: category.id,
    slug: category.slug,
    order: category.order,
    isActive: category.isActive,
    imageUrl: category.imageUrl ?? "",
    translations: Object.fromEntries(
      locales.map((locale) => {
        const translation = category.translations.find((t) => t.locale === locale);
        return [
          locale,
          {
            name: translation?.name ?? "",
            tagline: translation?.tagline ?? "",
            description: translation?.description ?? "",
          },
        ];
      }),
    ),
  });

  return (
    <AdminFrame>
      <PageHeader
        title="Categories"
        description="The catalogue's top-level structure. Categories drive the collection filters and the footer navigation."
      />

      {query.needed ? (
        <p role="status" className="mb-4 rounded-md border border-champagne/40 bg-champagne/8 px-3 py-2.5 text-sm">
          Create a category first — every product must belong to one.
        </p>
      ) : null}

      <Panel bodyClassName="p-0" className="mb-4">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th align="end">Products</Th>
              <Th>Languages</Th>
              <Th>Status</Th>
              <Th align="end">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="transition-colors hover:bg-sunken/60">
                <Td className="font-medium">
                  {category.translations.find((t) => t.locale === "en")?.name ?? category.slug}
                </Td>
                <Td className="font-mono text-xs text-muted">{category.slug}</Td>
                <Td align="end" className="tabular-nums text-muted">
                  {category._count.products}
                </Td>
                <Td>
                  <Badge tone={category.translations.length === 3 ? "success" : "warning"}>
                    {category.translations.length}/3
                  </Badge>
                </Td>
                <Td>
                  <Badge tone={category.isActive ? "success" : "neutral"}>
                    {category.isActive ? "active" : "hidden"}
                  </Badge>
                </Td>
                <Td align="end">
                  <span className="inline-flex items-center gap-2">
                    <a
                      href={`/admin/categories?edit=${category.id}`}
                      className="rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-line-strong"
                    >
                      Edit
                    </a>
                    {category._count.products === 0 ? (
                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="id" value={category.id} />
                        <DangerSubmit message={`Delete "${category.slug}"?`}>Delete</DangerSubmit>
                      </form>
                    ) : (
                      <span className="text-xs text-subtle">in use</span>
                    )}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <Panel
        title={editing ? `Edit “${editing.slug}”` : "New category"}
        description={editing ? undefined : "Names are required in English; other languages fall back to it."}
        actions={
          editing ? (
            <a href="/admin/categories" className="text-sm text-accent hover:underline">
              Cancel edit
            </a>
          ) : null
        }
      >
        <CategoryForm key={editing?.id ?? "new"} category={editing ? asFormData(editing) : undefined} />
      </Panel>
    </AdminFrame>
  );
}
