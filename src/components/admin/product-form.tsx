"use client";

import { useActionState, useState } from "react";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import {
  AVAILABILITIES,
  PRODUCT_STATUSES,
  SEGMENTS,
  STYLES,
  USE_CASES,
  PRICE_TIERS,
} from "@/lib/constants";
import { saveProductAction, type ActionState } from "@/lib/admin/actions";
import {
  AdminCheckbox,
  AdminCheckboxGroup,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  FormMessage,
  SubmitButton,
} from "@/components/admin/form";
import { Panel } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export type ProductFormData = {
  id?: string;
  slug: string;
  sku: string;
  categoryId: string;
  status: string;
  isFeatured: boolean;
  order: number;
  price: string;
  currency: string;
  showPrice: boolean;
  availability: string;
  leadTimeDays: string;
  style: string;
  segment: string;
  useCases: string[];
  coverageM2: string;
  priceTier: number;
  images: string;
  colorIds: string[];
  sizeIds: string[];
  materialIds: string[];
  accessoryIds: string[];
  translations: Record<
    Locale,
    {
      name: string;
      tagline: string;
      description: string;
      craft: string;
      features: string;
      specs: string;
      metaTitle: string;
      metaDescription: string;
    }
  >;
};

export type Options = {
  categories: { value: string; label: string }[];
  colors: { value: string; label: string; swatch?: string }[];
  sizes: { value: string; label: string }[];
  materials: { value: string; label: string }[];
  accessories: { value: string; label: string }[];
};

const initial: ActionState = {};

/**
 * The product editor.
 *
 * Content is split by language behind tabs rather than stacked, because a
 * three-language product with eight text fields each is 24 boxes on one page.
 * All three panels stay in the DOM (hidden, not unmounted) so a single submit
 * carries every language — switching tabs must never lose typing.
 */
export function ProductForm({ data, options }: { data: ProductFormData; options: Options }) {
  const [state, action] = useActionState(saveProductAction, initial);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");

  return (
    <form action={action} className="flex flex-col gap-4">
      {data.id ? <input type="hidden" name="id" value={data.id} /> : null}

      <FormMessage state={state} />

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          {/* Content, per language */}
          <Panel
            title="Content"
            description="English is used as the fallback wherever a translation is missing."
            bodyClassName="p-0"
          >
            <div className="flex border-b border-line" role="tablist" aria-label="Language">
              {locales.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  role="tab"
                  aria-selected={activeLocale === locale}
                  onClick={() => setActiveLocale(locale)}
                  className={cn(
                    "border-b-2 px-4 py-2.5 text-sm transition-colors",
                    activeLocale === locale
                      ? "border-accent font-medium text-accent"
                      : "border-transparent text-muted hover:text-fg",
                  )}
                >
                  {localeMeta[locale].label}
                  {locale === "en" ? <span className="ms-1.5 text-xs text-subtle">(required)</span> : null}
                </button>
              ))}
            </div>

            {locales.map((locale) => {
              const t = data.translations[locale];
              const rtl = localeMeta[locale].dir === "rtl";
              return (
                <div
                  key={locale}
                  hidden={activeLocale !== locale}
                  dir={localeMeta[locale].dir}
                  className="flex flex-col gap-4 p-5"
                >
                  <AdminInput
                    label="Name"
                    name={`name_${locale}`}
                    defaultValue={t.name}
                    required={locale === "en"}
                    maxLength={160}
                    className={rtl ? "text-end" : undefined}
                  />
                  <AdminInput
                    label="Tagline"
                    name={`tagline_${locale}`}
                    defaultValue={t.tagline}
                    maxLength={300}
                    hint="One line, shown under the name on cards and the product page."
                    className={rtl ? "text-end" : undefined}
                  />
                  <AdminTextarea
                    label="Description"
                    name={`description_${locale}`}
                    defaultValue={t.description}
                    rows={5}
                    maxLength={4000}
                    className={rtl ? "text-end" : undefined}
                  />
                  <AdminTextarea
                    label="Craftsmanship"
                    name={`craft_${locale}`}
                    defaultValue={t.craft}
                    rows={4}
                    maxLength={4000}
                    hint="The materials-and-engineering paragraph shown in its own band."
                    className={rtl ? "text-end" : undefined}
                  />
                  <AdminTextarea
                    label="Features"
                    name={`features_${locale}`}
                    defaultValue={t.features}
                    rows={5}
                    hint="One per line."
                    className={rtl ? "text-end" : undefined}
                  />
                  <AdminTextarea
                    label="Specifications"
                    name={`specs_${locale}`}
                    defaultValue={t.specs}
                    rows={6}
                    hint="One per line, as “Label: value”."
                    className={rtl ? "text-end" : undefined}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminInput
                      label="Meta title"
                      name={`metaTitle_${locale}`}
                      defaultValue={t.metaTitle}
                      maxLength={160}
                      hint="Falls back to the product name."
                    />
                    <AdminInput
                      label="Meta description"
                      name={`metaDescription_${locale}`}
                      defaultValue={t.metaDescription}
                      maxLength={300}
                      hint="Falls back to the tagline."
                    />
                  </div>
                </div>
              );
            })}
          </Panel>

          <Panel title="Images" description="One URL per line. The first is the primary view.">
            <AdminTextarea
              label="Image URLs"
              name="images"
              defaultValue={data.images}
              rows={5}
              hint="Local paths (/media/…, /uploads/…) or absolute URLs on an allowed host."
              className="font-mono text-xs"
            />
          </Panel>

          <Panel title="Options" description="What a customer can choose in the configurator.">
            <div className="flex flex-col gap-6">
              <AdminCheckboxGroup
                label="Canopy colours"
                name="colorIds"
                options={options.colors}
                selected={data.colorIds}
                columns={3}
              />
              <AdminCheckboxGroup
                label="Sizes"
                name="sizeIds"
                options={options.sizes}
                selected={data.sizeIds}
                columns={3}
              />
              <AdminCheckboxGroup
                label="Materials"
                name="materialIds"
                options={options.materials}
                selected={data.materialIds}
                columns={2}
              />
              <AdminCheckboxGroup
                label="Suggested accessories"
                name="accessoryIds"
                options={options.accessories}
                selected={data.accessoryIds}
                columns={2}
              />
            </div>
          </Panel>
        </div>

        {/* Settings rail */}
        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Publishing">
            <div className="flex flex-col gap-4">
              <AdminSelect label="Status" name="status" defaultValue={data.status}>
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.toLowerCase()}
                  </option>
                ))}
              </AdminSelect>

              <AdminInput
                label="URL slug"
                name="slug"
                defaultValue={data.slug}
                placeholder="aria"
                hint="Leave blank to generate it from the English name."
                className="font-mono text-xs"
              />

              <AdminInput label="SKU" name="sku" defaultValue={data.sku} maxLength={40} />

              <AdminSelect label="Category" name="categoryId" defaultValue={data.categoryId} required>
                {options.categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </AdminSelect>

              <AdminInput
                label="Sort order"
                name="order"
                type="number"
                min={0}
                max={9999}
                defaultValue={data.order}
                hint="Lower appears first."
              />

              <AdminCheckbox
                label="Featured"
                name="isFeatured"
                defaultChecked={data.isFeatured}
                hint="Shown on the home page."
              />
            </div>
          </Panel>

          <Panel title="Pricing & availability">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-[1fr_5rem] gap-3">
                <AdminInput
                  label="Price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={data.price}
                  hint="Leave blank for “price on request”."
                />
                <AdminInput label="Currency" name="currency" defaultValue={data.currency} maxLength={4} />
              </div>

              <AdminCheckbox
                label="Show the price publicly"
                name="showPrice"
                defaultChecked={data.showPrice}
                hint="When off, the price is stored but the site shows “price on request”."
              />

              <AdminSelect label="Availability" name="availability" defaultValue={data.availability}>
                {AVAILABILITIES.map((availability) => (
                  <option key={availability} value={availability}>
                    {availability.replace(/_/g, " ").toLowerCase()}
                  </option>
                ))}
              </AdminSelect>

              <AdminInput
                label="Lead time (days)"
                name="leadTimeDays"
                type="number"
                min={0}
                max={3650}
                defaultValue={data.leadTimeDays}
              />
            </div>
          </Panel>

          <Panel title="Discovery" description="Drives the collection filters and “Find your shade”.">
            <div className="flex flex-col gap-4">
              <AdminSelect label="Style" name="style" defaultValue={data.style}>
                {STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style.toLowerCase()}
                  </option>
                ))}
              </AdminSelect>

              <AdminSelect label="Suited to" name="segment" defaultValue={data.segment}>
                {SEGMENTS.map((segment) => (
                  <option key={segment} value={segment}>
                    {segment.toLowerCase()}
                  </option>
                ))}
              </AdminSelect>

              <AdminCheckboxGroup
                label="Settings"
                name="useCases"
                options={USE_CASES.map((useCase) => ({ value: useCase, label: useCase }))}
                selected={data.useCases}
                columns={2}
              />

              <AdminInput
                label="Coverage (m²)"
                name="coverageM2"
                type="number"
                min={0}
                step="0.1"
                defaultValue={data.coverageM2}
                hint="Used to match the area question in the consultation."
              />

              <AdminSelect label="Tier" name="priceTier" defaultValue={String(data.priceTier)}>
                {PRICE_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier} — {tier === 1 ? "essential" : tier === 2 ? "signature" : "bespoke"}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-line bg-[rgb(var(--c-bg-elevated)/0.9)] px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <SubmitButton>{data.id ? "Save changes" : "Create product"}</SubmitButton>
        <a
          href="/admin/products"
          className="inline-flex h-9 items-center rounded-md border border-line px-4 text-sm transition-colors hover:border-line-strong"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
