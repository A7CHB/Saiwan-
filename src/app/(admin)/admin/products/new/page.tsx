import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { AdminFrame } from "@/components/admin/frame";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";
import { blankProduct, loadProductOptions } from "@/lib/admin/product-form-data";

export const metadata: Metadata = { title: "New product" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireRole("STAFF");
  const options = await loadProductOptions();

  // A product must belong to a category, so there is nothing sensible to render
  // until at least one exists.
  if (options.categories.length === 0) redirect("/admin/categories?needed=1");

  return (
    <AdminFrame>
      <PageHeader
        title="New product"
        description="Create the piece as a draft, then publish it once the content and images are in place."
      />
      <ProductForm data={blankProduct(options.categories[0].value)} options={options} />
    </AdminFrame>
  );
}
