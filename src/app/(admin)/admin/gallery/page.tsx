import type { Metadata } from "next";
import Image from "next/image";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, EmptyState, PageHeader, Panel } from "@/components/admin/ui";
import { GalleryForm } from "@/components/admin/entity-forms";
import { DangerSubmit } from "@/components/admin/form";
import { deleteGalleryItemAction } from "@/lib/admin/actions";
import { locales } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "Gallery" };
export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("STAFF");
  const query = await searchParams;
  const editId = Array.isArray(query.edit) ? query.edit[0] : query.edit;

  const items = await prisma.galleryItem.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  const editing = editId ? items.find((item) => item.id === editId) : undefined;

  const asFormData = (item: (typeof items)[number]) => ({
    id: item.id,
    url: item.url,
    alt: item.alt ?? "",
    tag: item.tag,
    span: item.span,
    order: item.order,
    isActive: item.isActive,
    translations: Object.fromEntries(
      locales.map((locale) => {
        const translation = item.translations.find((t) => t.locale === locale);
        return [locale, { caption: translation?.caption ?? "", location: translation?.location ?? "" }];
      }),
    ),
  });

  return (
    <AdminFrame>
      <PageHeader
        title="Gallery"
        description="Installed work, shown on the home page and the Inspiration page. Tile size controls the mosaic rhythm."
      />

      <Panel className="mb-4">
        {items.length === 0 ? (
          <EmptyState title="No images yet" description="Add the first installation photograph below." />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-md border border-line">
                <span className="relative block aspect-square bg-sunken">
                  <Image
                    src={item.url}
                    alt={item.alt ?? ""}
                    fill
                    sizes="200px"
                    unoptimized={item.url.endsWith(".svg")}
                    className="object-cover"
                  />
                  {!item.isActive ? (
                    <span className="absolute inset-x-0 top-0 bg-[rgb(var(--c-overlay)/0.6)] px-2 py-1 text-center text-[0.625rem] uppercase tracking-wide text-white">
                      hidden
                    </span>
                  ) : null}
                </span>
                <div className="flex flex-col gap-2 p-2.5">
                  <span className="flex items-center gap-1.5">
                    <Badge>{item.tag}</Badge>
                    <Badge tone="neutral">{item.span.toLowerCase()}</Badge>
                  </span>
                  <p className="truncate text-xs text-muted">
                    {item.translations.find((t) => t.locale === "en")?.caption ?? "—"}
                  </p>
                  <span className="flex items-center gap-2">
                    <a
                      href={`/admin/gallery?edit=${item.id}`}
                      className="rounded border border-line px-2 py-1 text-xs transition-colors hover:border-line-strong"
                    >
                      Edit
                    </a>
                    <form action={deleteGalleryItemAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <DangerSubmit message="Remove this image from the gallery?">Delete</DangerSubmit>
                    </form>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel
        title={editing ? "Edit image" : "Add an image"}
        actions={
          editing ? (
            <a href="/admin/gallery" className="text-sm text-accent hover:underline">
              Cancel edit
            </a>
          ) : null
        }
      >
        <GalleryForm key={editing?.id ?? "new"} item={editing ? asFormData(editing) : undefined} />
      </Panel>
    </AdminFrame>
  );
}
