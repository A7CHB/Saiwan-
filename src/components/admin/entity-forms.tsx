"use client";

import { useActionState } from "react";
import { locales, localeMeta } from "@/lib/i18n/config";
import { GALLERY_TAGS, IMAGE_SPANS, ROLES } from "@/lib/constants";
import {
  saveCategoryAction,
  saveGalleryItemAction,
  saveSettingsAction,
  saveTranslationAction,
  saveContentAction,
  saveUserAction,
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
        <AdminSelect label="Role" name="role" defaultValue={user?.role ?? "CUSTOMER"}>
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
