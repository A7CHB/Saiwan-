"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { STYLES, USE_CASES, PRICE_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

/**
 * Collection refinement.
 *
 * Filters live entirely in the URL — that makes every refined view
 * shareable, linkable and crawlable, survives a back button, and lets the page
 * stay a server component. On mobile the same controls collapse behind a single
 * "Refine" disclosure so the grid keeps the screen.
 */
export function CollectionFilters({
  categories,
  resultCount,
}: {
  categories: FilterOption[];
  resultCount: number;
}) {
  const { d, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const current = {
    category: searchParams.get("category") ?? "",
    style: searchParams.get("style") ?? "",
    useCase: searchParams.get("use") ?? "",
    tier: searchParams.get("tier") ?? "",
    sort: searchParams.get("sort") ?? "featured",
  };

  const activeCount = [current.category, current.style, current.useCase, current.tier].filter(Boolean).length;

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || params.get(key) === value) params.delete(key);
      else params.set(key, value);

      const query = params.toString();
      startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
    },
    [pathname, router, searchParams],
  );

  const clearAll = () => {
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  const groups: { key: string; label: string; options: FilterOption[] }[] = [
    { key: "category", label: d.collection.category, options: categories },
    {
      key: "style",
      label: d.collection.style,
      options: STYLES.map((style) => ({ value: style, label: d.product.styles[style] })),
    },
    {
      key: "use",
      label: d.collection.setting,
      options: USE_CASES.map((useCase) => ({ value: useCase, label: d.product.settings[useCase] })),
    },
    {
      key: "tier",
      label: d.collection.priceTier,
      options: PRICE_TIERS.map((tier) => ({
        value: String(tier),
        label: d.product.tiers[String(tier) as "1" | "2" | "3"],
      })),
    },
  ];

  const valueFor = (key: string) =>
    key === "use" ? current.useCase : (current[key as keyof typeof current] ?? "");

  return (
    <div className={cn("border-y border-line", pending && "opacity-60 transition-opacity")}>
      {/* Summary row — always visible */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="collection-filters"
            className="inline-flex items-center gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors hover:text-accent rtl:text-sm rtl:normal-case rtl:tracking-normal"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden="true" />
            {d.collection.filterBy}
            {activeCount > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[0.625rem] text-accent-fg tabular-nums">
                {activeCount}
              </span>
            ) : null}
          </button>

          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
            >
              <X className="size-3" strokeWidth={2} aria-hidden="true" />
              {d.common.clearAll}
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-5">
          <p className="hidden text-xs text-subtle tabular-nums sm:block" aria-live="polite">
            {resultCount === 1
              ? d.collection.resultsCountOne
              : t(d.collection.resultsCount, { count: resultCount })}
          </p>

          <label className="flex items-center gap-2 text-xs">
            <span className="sr-only">{d.common.sort}</span>
            <select
              value={current.sort}
              onChange={(event) => update("sort", event.target.value)}
              className="cursor-pointer border-none bg-transparent py-1 text-xs text-fg outline-none focus-visible:outline-2 focus-visible:outline-accent [&>option]:bg-elevated"
            >
              <option value="featured">{d.collection.sortOptions.featured}</option>
              <option value="newest">{d.collection.sortOptions.newest}</option>
              <option value="name-asc">{d.collection.sortOptions.nameAsc}</option>
              <option value="price-asc">{d.collection.sortOptions.priceAsc}</option>
              <option value="price-desc">{d.collection.sortOptions.priceDesc}</option>
              <option value="coverage">{d.collection.sortOptions.coverage}</option>
            </select>
          </label>
        </div>
      </div>

      {/* Filter groups — a CSS grid collapse, so no height is ever measured
          in JavaScript and the transition cannot jump. */}
      <div
        id="collection-filters"
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="grid gap-8 border-t border-line py-8 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <fieldset key={group.key}>
                <legend className="eyebrow mb-4">{group.label}</legend>
                <ul className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const selected = valueFor(group.key) === option.value;
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          onClick={() => update(group.key, option.value)}
                          aria-pressed={selected}
                          className={cn(
                            "rounded-xs border px-3 py-1.5 text-xs transition-colors duration-300",
                            selected
                              ? "border-accent bg-accent text-accent-fg"
                              : "border-line text-muted hover:border-line-strong hover:text-fg",
                          )}
                        >
                          {option.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
