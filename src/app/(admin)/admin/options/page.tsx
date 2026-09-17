import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, PageHeader, Panel, Table, Td, Th } from "@/components/admin/ui";
import { ColorForm, SizeForm, MaterialForm } from "@/components/admin/entity-forms";
import { DangerSubmit } from "@/components/admin/form";
import { deleteColorAction, deleteSizeAction, deleteMaterialAction } from "@/lib/admin/actions";
import { locales } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "Options" };
export const dynamic = "force-dynamic";

/**
 * The three libraries a product is assembled from.
 *
 * The product editor has always been able to pick colours, sizes and materials;
 * nothing could add to them, so a new canopy colour meant a developer editing
 * the seed and redeploying. They share one page because they are the same kind
 * of thing — small, ordered lists that exist only to be chosen from — and three
 * sidebar entries for three short tables would be worse than one.
 *
 * Anything in use refuses to delete. Removing a colour a product is sold in
 * would not only unbind the product, it would unbind the photographs its
 * swatches switch between.
 */
export default async function AdminOptionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("STAFF");
  const query = await searchParams;
  const one = (key: string) => (Array.isArray(query[key]) ? query[key][0] : query[key]);

  const [colors, sizes, materials] = await Promise.all([
    prisma.color.findMany({
      orderBy: { order: "asc" },
      include: { translations: true, _count: { select: { products: true } } },
    }),
    prisma.size.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.material.findMany({
      orderBy: { order: "asc" },
      include: { translations: true, _count: { select: { products: true } } },
    }),
  ]);

  const editColor = colors.find((c) => c.id === one("color"));
  const editSize = sizes.find((s) => s.id === one("size"));
  const editMaterial = materials.find((m) => m.id === one("material"));

  const named = <T extends { locale: string; name: string }>(translations: T[]) =>
    Object.fromEntries(
      locales.map((locale) => [locale, { name: translations.find((t) => t.locale === locale)?.name ?? "" }]),
    );

  return (
    <AdminFrame>
      <PageHeader
        title="Options"
        description="The colours, sizes and materials products are built from. Everything here is picked on a product's own page; this is where the lists themselves are kept."
      />

      {/* Colours ----------------------------------------------------------- */}
      <Panel bodyClassName="p-0" className="mb-4">
        <Table>
          <thead>
            <tr>
              <Th>Colour</Th>
              <Th>Slug</Th>
              <Th>Hex</Th>
              <Th align="end">Products</Th>
              <Th>Languages</Th>
              <Th align="end">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {colors.length === 0 ? (
              <tr>
                <Td className="text-muted">No colours yet.</Td>
                <Td /><Td /><Td /><Td /><Td />
              </tr>
            ) : null}
            {colors.map((color) => (
              <tr key={color.id} className="transition-colors hover:bg-sunken/60">
                <Td className="font-medium">
                  <span className="inline-flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="size-4 shrink-0 rounded-full border border-line"
                      style={{ background: color.hex }}
                    />
                    {color.translations.find((t) => t.locale === "en")?.name ?? color.slug}
                  </span>
                </Td>
                <Td className="font-mono text-xs text-muted">{color.slug}</Td>
                <Td className="font-mono text-xs uppercase text-muted">{color.hex}</Td>
                <Td align="end" className="tabular-nums text-muted">
                  {color._count.products}
                </Td>
                <Td>
                  <Badge tone={color.translations.length === 3 ? "success" : "warning"}>
                    {color.translations.length}/3
                  </Badge>
                </Td>
                <Td align="end">
                  <span className="inline-flex items-center gap-2">
                    <a
                      href={`/admin/options?color=${color.id}`}
                      className="rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-line-strong"
                    >
                      Edit
                    </a>
                    {color._count.products === 0 ? (
                      <form action={deleteColorAction}>
                        <input type="hidden" name="id" value={color.id} />
                        <DangerSubmit message={`Delete the colour "${color.slug}"?`}>Delete</DangerSubmit>
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
        title={editColor ? `Edit “${editColor.slug}”` : "New colour"}
        description={editColor ? undefined : "The hex is the swatch the storefront paints."}
        className="mb-10"
        actions={
          editColor ? (
            <a href="/admin/options" className="text-sm text-accent hover:underline">
              Cancel edit
            </a>
          ) : null
        }
      >
        <ColorForm
          key={editColor?.id ?? "new-color"}
          color={
            editColor
              ? {
                  id: editColor.id,
                  slug: editColor.slug,
                  hex: editColor.hex,
                  order: editColor.order,
                  translations: named(editColor.translations),
                }
              : undefined
          }
        />
      </Panel>

      {/* Sizes ------------------------------------------------------------- */}
      <Panel bodyClassName="p-0" className="mb-4">
        <Table>
          <thead>
            <tr>
              <Th>Size</Th>
              <Th>Slug</Th>
              <Th>Shape</Th>
              <Th align="end">Area</Th>
              <Th align="end">Products</Th>
              <Th align="end">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {sizes.length === 0 ? (
              <tr>
                <Td className="text-muted">No sizes yet.</Td>
                <Td /><Td /><Td /><Td /><Td />
              </tr>
            ) : null}
            {sizes.map((size) => (
              <tr key={size.id} className="transition-colors hover:bg-sunken/60">
                <Td className="font-medium">{size.label}</Td>
                <Td className="font-mono text-xs text-muted">{size.slug}</Td>
                <Td className="text-muted">{size.shape.charAt(0) + size.shape.slice(1).toLowerCase()}</Td>
                <Td align="end" className="tabular-nums text-muted">
                  {size.areaM2 ? `${size.areaM2} m²` : "—"}
                </Td>
                <Td align="end" className="tabular-nums text-muted">
                  {size._count.products}
                </Td>
                <Td align="end">
                  <span className="inline-flex items-center gap-2">
                    <a
                      href={`/admin/options?size=${size.id}`}
                      className="rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-line-strong"
                    >
                      Edit
                    </a>
                    {size._count.products === 0 ? (
                      <form action={deleteSizeAction}>
                        <input type="hidden" name="id" value={size.id} />
                        <DangerSubmit message={`Delete the size "${size.label}"?`}>Delete</DangerSubmit>
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
        title={editSize ? `Edit “${editSize.label}”` : "New size"}
        description={editSize ? undefined : "The label is shown as typed, in every language."}
        className="mb-10"
        actions={
          editSize ? (
            <a href="/admin/options" className="text-sm text-accent hover:underline">
              Cancel edit
            </a>
          ) : null
        }
      >
        <SizeForm
          key={editSize?.id ?? "new-size"}
          size={
            editSize
              ? {
                  id: editSize.id,
                  slug: editSize.slug,
                  label: editSize.label,
                  shape: editSize.shape,
                  widthCm: editSize.widthCm,
                  depthCm: editSize.depthCm,
                  order: editSize.order,
                }
              : undefined
          }
        />
      </Panel>

      {/* Materials --------------------------------------------------------- */}
      <Panel bodyClassName="p-0" className="mb-4">
        <Table>
          <thead>
            <tr>
              <Th>Material</Th>
              <Th>Slug</Th>
              <Th align="end">Products</Th>
              <Th>Languages</Th>
              <Th align="end">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr>
                <Td className="text-muted">No materials yet.</Td>
                <Td /><Td /><Td /><Td />
              </tr>
            ) : null}
            {materials.map((material) => (
              <tr key={material.id} className="transition-colors hover:bg-sunken/60">
                <Td className="font-medium">
                  {material.translations.find((t) => t.locale === "en")?.name ?? material.slug}
                </Td>
                <Td className="font-mono text-xs text-muted">{material.slug}</Td>
                <Td align="end" className="tabular-nums text-muted">
                  {material._count.products}
                </Td>
                <Td>
                  <Badge tone={material.translations.length === 3 ? "success" : "warning"}>
                    {material.translations.length}/3
                  </Badge>
                </Td>
                <Td align="end">
                  <span className="inline-flex items-center gap-2">
                    <a
                      href={`/admin/options?material=${material.id}`}
                      className="rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-line-strong"
                    >
                      Edit
                    </a>
                    {material._count.products === 0 ? (
                      <form action={deleteMaterialAction}>
                        <input type="hidden" name="id" value={material.id} />
                        <DangerSubmit message={`Delete the material "${material.slug}"?`}>Delete</DangerSubmit>
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
        title={editMaterial ? `Edit “${editMaterial.slug}”` : "New material"}
        actions={
          editMaterial ? (
            <a href="/admin/options" className="text-sm text-accent hover:underline">
              Cancel edit
            </a>
          ) : null
        }
      >
        <MaterialForm
          key={editMaterial?.id ?? "new-material"}
          material={
            editMaterial
              ? {
                  id: editMaterial.id,
                  slug: editMaterial.slug,
                  order: editMaterial.order,
                  translations: Object.fromEntries(
                    locales.map((locale) => {
                      const t = editMaterial.translations.find((x) => x.locale === locale);
                      return [locale, { name: t?.name ?? "", description: t?.description ?? "" }];
                    }),
                  ),
                }
              : undefined
          }
        />
      </Panel>
    </AdminFrame>
  );
}
