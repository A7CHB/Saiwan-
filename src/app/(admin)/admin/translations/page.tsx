import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, PageHeader, Panel } from "@/components/admin/ui";
import { TranslationForm } from "@/components/admin/entity-forms";
import { locales, localeMeta } from "@/lib/i18n/config";
import en from "@/lib/i18n/dictionaries/en";

export const metadata: Metadata = { title: "Translations" };
export const dynamic = "force-dynamic";

/** Flattens the dictionary into dot-paths so every string is addressable. */
function flatten(value: unknown, prefix = ""): { key: string; value: string }[] {
  if (typeof value === "string") return [{ key: prefix, value }];
  if (typeof value !== "object" || value === null) return [];
  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  );
}

const ALL = flatten(en);

/**
 * Wording overrides.
 *
 * Every UI string ships in the compiled dictionaries; this page lets the
 * business correct any of them, in any language, without a deploy. An empty
 * field means "no override" and restores the shipped text — which is why
 * clearing a value deletes the row rather than storing an empty string.
 */
export default async function AdminTranslationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("STAFF");

  const query = await searchParams;
  const search = ((Array.isArray(query.q) ? query.q[0] : query.q) ?? "").trim().toLowerCase();
  const localeParam = Array.isArray(query.locale) ? query.locale[0] : query.locale;
  const locale = locales.includes(localeParam as never) ? (localeParam as string) : "ar";

  const overrides = await prisma.translation.findMany({ where: { locale } });
  const overrideMap = new Map(overrides.map((row) => [row.key, row.value]));

  const entries = (search
    ? ALL.filter((entry) => entry.key.toLowerCase().includes(search) || entry.value.toLowerCase().includes(search))
    : ALL
  ).slice(0, 120);

  return (
    <AdminFrame>
      <PageHeader
        title="Translations"
        description="Override any interface string. Leave a field empty to fall back to the text that ships with the site."
      />

      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-line bg-elevated p-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Language</span>
          <select
            name="locale"
            defaultValue={locale}
            className="rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {locales.map((option) => (
              <option key={option} value={option}>
                {localeMeta[option].label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1.5 sm:max-w-sm">
          <span className="text-xs font-medium text-muted">Filter</span>
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Key or English text"
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <button type="submit" className="h-9 rounded-md border border-line px-4 text-sm transition-colors hover:border-line-strong">
          Apply
        </button>

        <span className="ms-auto self-center text-xs text-subtle">
          {overrides.length} override{overrides.length === 1 ? "" : "s"} in {localeMeta[locale as "ar"].label}
        </span>
      </form>

      <Panel bodyClassName="p-0">
        <ul className="flex flex-col divide-y divide-line">
          {entries.map((entry) => (
            <li key={entry.key} className="grid gap-3 p-4 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div className="min-w-0">
                <p className="font-mono text-xs text-accent">{entry.key}</p>
                <p className="mt-1.5 text-sm text-muted">{entry.value}</p>
                {overrideMap.has(entry.key) ? (
                  <span className="mt-2 inline-block">
                    <Badge tone="accent">overridden</Badge>
                  </span>
                ) : null}
              </div>
              <TranslationForm
                translationKey={entry.key}
                locale={locale}
                value={overrideMap.get(entry.key) ?? ""}
                fallback={entry.value}
              />
            </li>
          ))}
        </ul>

        {ALL.length > entries.length ? (
          <p className="border-t border-line p-4 text-xs text-subtle">
            Showing {entries.length} of {ALL.length} strings. Use the filter to narrow the list.
          </p>
        ) : null}
      </Panel>
    </AdminFrame>
  );
}
