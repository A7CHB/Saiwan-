"use client";

import { useActionState } from "react";
import { locales, localeMeta } from "@/lib/i18n/config";
import { GALLERY_TAGS, IMAGE_SPANS, ROLES, SHAPES } from "@/lib/constants";
import {
  saveCategoryAction,
  saveGalleryItemAction,
  saveSettingsAction,
  saveTranslationAction,
  saveContentAction,
  saveUserAction,
  saveColorAction,
  saveSizeAction,
  saveMaterialAction,
  deleteAllInquiriesAction,
  type ActionState,
} from "@/lib/admin/actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  FormMessage,
  SubmitButton,
} from "@/components/admin/form";

const initial: ActionState = {};

/** One editor for a category, used for both create and edit. */
export function CategoryForm({
  category,
}: {
  category?: {
    id: string;
    slug: string;
    order: number;
    isActive: boolean;
    imageUrl: string;
    translations: Record<string, { name: string; tagline: string; description: string }>;
  };
}) {
  const [state, action] = useActionState(saveCategoryAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <FormMessage state={state} />

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminInput
          label="Slug"
          name="slug"
          defaultValue={category?.slug ?? ""}
          hint="Blank generates it from the English name."
          className="font-mono text-xs"
        />
        <AdminInput label="Sort order" name="order" type="number" min={0} defaultValue={category?.order ?? 0} />
        <AdminInput
          label="Image URL"
          name="imageUrl"
          defaultValue={category?.imageUrl ?? ""}
          className="font-mono text-xs"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {locales.map((locale) => (
          <div key={locale} dir={localeMeta[locale].dir} className="flex flex-col gap-3 rounded-md border border-line p-4">
            <p className="text-xs font-medium text-muted" dir="ltr">
              {localeMeta[locale].label}
            </p>
            <AdminInput
              label="Name"
              name={`name_${locale}`}
              defaultValue={category?.translations[locale]?.name ?? ""}
              required={locale === "en"}
            />
            <AdminInput
              label="Tagline"
              name={`tagline_${locale}`}
              defaultValue={category?.translations[locale]?.tagline ?? ""}
            />
            <AdminTextarea
              label="Description"
              name={`description_${locale}`}
              rows={4}
              defaultValue={category?.translations[locale]?.description ?? ""}
            />
          </div>
        ))}
      </div>

      <AdminCheckbox
        label="Active"
        name="isActive"
        defaultChecked={category?.isActive ?? true}
        hint="Inactive categories are hidden from the site but keep their products."
      />

      <SubmitButton className="self-start">{category ? "Save category" : "Create category"}</SubmitButton>
    </form>
  );
}

export function GalleryForm({
  item,
}: {
  item?: {
    id: string;
    url: string;
    alt: string;
    tag: string;
    span: string;
    order: number;
    isActive: boolean;
    translations: Record<string, { caption: string; location: string }>;
  };
}) {
  const [state, action] = useActionState(saveGalleryItemAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <FormMessage state={state} />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput
          label="Image URL"
          name="url"
          defaultValue={item?.url ?? ""}
          required
          className="font-mono text-xs"
        />
        <AdminInput
          label="Alt text"
          name="alt"
          defaultValue={item?.alt ?? ""}
          hint="Describe the scene for screen readers and search."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminSelect label="Setting" name="tag" defaultValue={item?.tag ?? "villa"}>
          {GALLERY_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect label="Tile size" name="span" defaultValue={item?.span ?? "NORMAL"}>
          {IMAGE_SPANS.map((span) => (
            <option key={span} value={span}>
              {span.toLowerCase()}
            </option>
          ))}
        </AdminSelect>
        <AdminInput label="Sort order" name="order" type="number" min={0} defaultValue={item?.order ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {locales.map((locale) => (
          <div key={locale} dir={localeMeta[locale].dir} className="flex flex-col gap-3 rounded-md border border-line p-4">
            <p className="text-xs font-medium text-muted" dir="ltr">
              {localeMeta[locale].label}
            </p>
            <AdminInput
              label="Caption"
              name={`caption_${locale}`}
              defaultValue={item?.translations[locale]?.caption ?? ""}
            />
            <AdminInput
              label="Location"
              name={`location_${locale}`}
              defaultValue={item?.translations[locale]?.location ?? ""}
            />
          </div>
        ))}
      </div>

      <AdminCheckbox label="Visible on the site" name="isActive" defaultChecked={item?.isActive ?? true} />

      <SubmitButton className="self-start">{item ? "Save image" : "Add image"}</SubmitButton>
    </form>
  );
}

export function ContentForm({
  contentKey,
  description,
  values,
}: {
  contentKey: string;
  description: string;
  values: Record<string, string>;
}) {
  const [state, action] = useActionState(saveContentAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="key" value={contentKey} />
      <p className="text-sm text-muted">{description}</p>
      <FormMessage state={state} />

      <div className="grid gap-4 lg:grid-cols-3">
        {locales.map((locale) => (
          <AdminTextarea
            key={locale}
            label={localeMeta[locale].label}
            name={`value_${locale}`}
            defaultValue={values[locale] ?? "{}"}
            rows={10}
            className="font-mono text-xs"
            hint="JSON"
          />
        ))}
      </div>

      <SubmitButton className="self-start">Save content</SubmitButton>
    </form>
  );
}

export function TranslationForm({
  translationKey,
  locale,
  value,
  fallback,
}: {
  translationKey: string;
  locale: string;
  value: string;
  fallback: string;
}) {
  const [state, action] = useActionState(saveTranslationAction, initial);

  return (
    <form action={action} className="flex items-start gap-2">
      <input type="hidden" name="key" value={translationKey} />
      <input type="hidden" name="locale" value={locale} />
      <div className="flex-1">
        <input
          name="value"
          defaultValue={value}
          placeholder={fallback}
          dir={localeMeta[locale as keyof typeof localeMeta]?.dir ?? "ltr"}
          className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        {state.error ? <p className="mt-1 text-xs text-terracotta">{state.error}</p> : null}
      </div>
      <SubmitButton variant="secondary">Save</SubmitButton>
    </form>
  );
}

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, action] = useActionState(saveSettingsAction, initial);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <FormMessage state={state} />

      <AdminInput
        label="WhatsApp number"
        name="contact.whatsapp"
        defaultValue={settings["contact.whatsapp"] ?? ""}
        dir="ltr"
        placeholder="9647500000000"
        hint="International format, digits only. The buttons on the site read this from the environment variable of the same name — set both."
      />
      <AdminInput
        label="Contact email"
        name="contact.email"
        type="email"
        dir="ltr"
        defaultValue={settings["contact.email"] ?? ""}
      />
      <AdminTextarea
        label="Studio address"
        name="contact.address"
        rows={3}
        defaultValue={settings["contact.address"] ?? ""}
        hint="Shown on the contact page. Leave blank to hide the block."
      />
      <AdminInput
        label="Default currency"
        name="brand.currency"
        defaultValue={settings["brand.currency"] ?? "USD"}
        maxLength={4}
        dir="ltr"
      />

      <SubmitButton className="self-start">Save settings</SubmitButton>
    </form>
  );
}

export function UserForm({
  user,
}: {
  user?: { id: string; name: string; email: string; phone: string; role: string; isActive: boolean };
}) {
  const [state, action] = useActionState(saveUserAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      {user ? <input type="hidden" name="id" value={user.id} /> : null}
      <FormMessage state={state} />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput label="Name" name="name" defaultValue={user?.name ?? ""} required />
        <AdminInput label="Email" name="email" type="email" dir="ltr" defaultValue={user?.email ?? ""} required />
        <AdminInput label="Phone" name="phone" type="tel" dir="ltr" defaultValue={user?.phone ?? ""} />
        <AdminSelect label="Role" name="role" defaultValue={user?.role ?? "STAFF"}>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role.toLowerCase()}
            </option>
          ))}
        </AdminSelect>
      </div>

      <AdminInput
        label={user ? "New password" : "Password"}
        name="password"
        type="password"
        autoComplete="new-password"
        dir="ltr"
        required={!user}
        hint={
          user
            ? "Leave blank to keep the current password. Changing it signs the account out everywhere."
            : "At least 8 characters, including a letter and a number."
        }
      />

      <AdminCheckbox label="Active" name="isActive" defaultChecked={user?.isActive ?? true} />

      <SubmitButton className="self-start">{user ? "Save account" : "Create account"}</SubmitButton>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Options: colours, sizes, materials
// ---------------------------------------------------------------------------

/**
 * A colourway. The hex is the swatch the storefront paints, so it is shown
 * next to a native colour picker rather than asked for as text alone — the
 * value is still typed, because a designer arrives with `#17382E` and not
 * with a position in a gradient.
 */
export function ColorForm({
  color,
}: {
  color?: {
    id: string;
    slug: string;
    hex: string;
    order: number;
    translations: Record<string, { name: string }>;
  };
}) {
  const [state, action] = useActionState(saveColorAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      {color ? <input type="hidden" name="id" value={color.id} /> : null}
      <FormMessage state={state} />

      <div className="grid gap-4 sm:grid-cols-4">
        <AdminInput
          label="Slug"
          name="slug"
          defaultValue={color?.slug ?? ""}
          hint="Blank generates it from the English name."
          className="font-mono text-xs"
        />
        <AdminInput
          label="Hex"
          name="hex"
          defaultValue={color?.hex ?? "#000000"}
          required
          placeholder="#17382E"
          className="font-mono text-xs uppercase"
          hint="Six digits, e.g. #17382E."
        />
        <AdminInput
          label="Picker"
          name="hexPicker"
          type="color"
          defaultValue={color?.hex ?? "#000000"}
          hint="Reference only — the Hex field is saved."
          className="h-10 cursor-pointer p-1"
        />
        <AdminInput label="Sort order" name="order" type="number" min={0} defaultValue={color?.order ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {locales.map((locale) => (
          <div key={locale} dir={localeMeta[locale].dir} className="rounded-md border border-line p-4">
            <p className="mb-3 text-xs font-medium text-muted" dir="ltr">
              {localeMeta[locale].label}
            </p>
            <AdminInput
              label="Name"
              name={`name_${locale}`}
              defaultValue={color?.translations[locale]?.name ?? ""}
              required={locale === "en"}
            />
          </div>
        ))}
      </div>

      <SubmitButton>{color ? "Save colour" : "Create colour"}</SubmitButton>
    </form>
  );
}

/**
 * A size. The label is deliberately not translated — "3.0 × 3.0 m" reads the
 * same in all three languages, and a per-language copy would only ever be a
 * typo away from disagreeing with itself. Area is derived on save from the
 * two dimensions rather than typed, for the same reason.
 */
export function SizeForm({
  size,
}: {
  size?: {
    id: string;
    slug: string;
    label: string;
    shape: string;
    widthCm: number | null;
    depthCm: number | null;
    order: number;
  };
}) {
  const [state, action] = useActionState(saveSizeAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      {size ? <input type="hidden" name="id" value={size.id} /> : null}
      <FormMessage state={state} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminInput
          label="Label"
          name="label"
          defaultValue={size?.label ?? ""}
          required
          placeholder="3.0 × 3.0 m"
          hint="What the customer picks. Shown as typed, in every language."
        />
        <AdminInput
          label="Slug"
          name="slug"
          defaultValue={size?.slug ?? ""}
          hint="Blank generates it from the label."
          className="font-mono text-xs"
        />
        <AdminSelect label="Shape" name="shape" defaultValue={size?.shape ?? "SQUARE"}>
          {SHAPES.map((shape) => (
            <option key={shape} value={shape}>
              {shape.charAt(0) + shape.slice(1).toLowerCase()}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          label="Width (cm)"
          name="widthCm"
          type="number"
          min={0}
          defaultValue={size?.widthCm ?? ""}
        />
        <AdminInput
          label="Depth (cm)"
          name="depthCm"
          type="number"
          min={0}
          defaultValue={size?.depthCm ?? ""}
          hint="Area is calculated from width × depth."
        />
        <AdminInput label="Sort order" name="order" type="number" min={0} defaultValue={size?.order ?? 0} />
      </div>

      <SubmitButton>{size ? "Save size" : "Create size"}</SubmitButton>
    </form>
  );
}

/** A material, with the short description the product page prints beside it. */
export function MaterialForm({
  material,
}: {
  material?: {
    id: string;
    slug: string;
    order: number;
    translations: Record<string, { name: string; description: string }>;
  };
}) {
  const [state, action] = useActionState(saveMaterialAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      {material ? <input type="hidden" name="id" value={material.id} /> : null}
      <FormMessage state={state} />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput
          label="Slug"
          name="slug"
          defaultValue={material?.slug ?? ""}
          hint="Blank generates it from the English name."
          className="font-mono text-xs"
        />
        <AdminInput label="Sort order" name="order" type="number" min={0} defaultValue={material?.order ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {locales.map((locale) => (
          <div key={locale} dir={localeMeta[locale].dir} className="flex flex-col gap-3 rounded-md border border-line p-4">
            <p className="text-xs font-medium text-muted" dir="ltr">
              {localeMeta[locale].label}
            </p>
            <AdminInput
              label="Name"
              name={`name_${locale}`}
              defaultValue={material?.translations[locale]?.name ?? ""}
              required={locale === "en"}
            />
            <AdminTextarea
              label="Description"
              name={`description_${locale}`}
              rows={3}
              defaultValue={material?.translations[locale]?.description ?? ""}
            />
          </div>
        ))}
      </div>

      <SubmitButton>{material ? "Save material" : "Create material"}</SubmitButton>
    </form>
  );
}

/**
 * Empty the inquiry inbox.
 *
 * Typing the word rather than clicking through a dialog is the point: this is
 * the one action in the dashboard that destroys something a customer sent and
 * that cannot be re-entered from memory.
 */
export function ClearInquiriesForm({ count }: { count: number }) {
  const [state, action] = useActionState(deleteAllInquiriesAction, initial);

  return (
    <form action={action} className="flex flex-col gap-3">
      <FormMessage state={state} />
      <p className="text-sm text-muted">
        Permanently deletes {count === 1 ? "the 1 inquiry" : `all ${count} inquiries`} and their timelines.
        Customers are not notified, and this cannot be undone.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <AdminInput
          label="Type DELETE to confirm"
          name="confirm"
          required
          autoComplete="off"
          placeholder="DELETE"
          className="font-mono"
          containerClassName="max-w-[16rem]"
        />
        <SubmitButton>Delete every inquiry</SubmitButton>
      </div>
    </form>
  );
}
