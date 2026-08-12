import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, PageHeader, Panel } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";
import { loadProductForm, loadProductOptions } from "@/lib/admin/product-form-data";
import { deleteProductAction } from "@/lib/admin/actions";
import { DangerSubmit } from "@/components/admin/form";
import { getSessionUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/constants";

export const metadata: Metadata = { title: "Edit product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("STAFF");

  const [{ id }, query, user] = await Promise.all([params, searchParams, getSessionUser()]);
  const [data, options] = await Promise.all([loadProductForm(id), loadProductOptions(id)]);

  if (!data) notFound();

  return (
    <AdminFrame>
      <PageHeader
        title={data.translations.en.name || data.slug}
        description={`Slug: ${data.slug}`}
        actions={
          <Link
            href={`/en/collection/${data.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3.5 text-sm transition-colors hover:border-line-strong"
          >
            View on site
            <ExternalLink className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
          </Link>
        }
      />

      {query.saved ? (
        <p role="status" className="mb-4 rounded-md border border-olive/40 bg-olive/8 px-3 py-2.5 text-sm text-olive">
          Changes saved.
        </p>
      ) : null}

      <ProductForm data={data} options={options} />

      {/* Deleting is separated from the editor and restricted to administrators
          — a mis-click here is unrecoverable. */}
      {hasRole(user?.role, "ADMIN") ? (
        <Panel title="Danger zone" className="mt-6 border-terracotta/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm">Delete this product permanently.</p>
              <p className="mt-1 text-xs text-muted">
                Its images, translations and option links go with it. Inquiries are kept, but lose their link
                to the piece. Consider archiving instead.
              </p>
            </div>
            <form action={deleteProductAction}>
              <input type="hidden" name="id" value={data.id} />
              <DangerSubmit message="Delete this product permanently? This cannot be undone.">
                Delete product
              </DangerSubmit>
            </form>
          </div>
        </Panel>
      ) : (
        <Panel title="Archiving" className="mt-6">
          <p className="text-sm text-muted">
            Set the status to <Badge>archived</Badge> above to remove this piece from the site while keeping
            its history. Only an administrator can delete it outright.
          </p>
        </Panel>
      )}
    </AdminFrame>
  );
}
