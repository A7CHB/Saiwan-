"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Media } from "@/components/ui/media";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

type Result = {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  image: string | null;
  imageAlt: string;
};

/**
 * Instant search.
 *
 * Debounced at 220ms and guarded by an AbortController, so fast typing never
 * leaves a slower earlier response to overwrite a newer one. Results are fully
 * keyboard navigable (↑ ↓ ⏎) because this is the fastest route into the
 * catalogue for anyone who does not use a mouse.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { d, href, t } = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setStatus("idle");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("search failed");
        const data = (await response.json()) as { results: Result[] };
        setResults(data.results ?? []);
        setActive(0);
        setStatus("done");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
          setStatus("done");
        }
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      const target = listRef.current?.querySelectorAll("a")[active] as HTMLAnchorElement | undefined;
      target?.click();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label={d.search.title}
      variant="top"
      panelClassName="w-full max-w-2xl"
    >
      <div className="border border-line bg-elevated shadow-[0_40px_100px_-30px_rgb(var(--shadow-color)/0.5)]">
        <div className="flex items-center gap-4 border-b border-line px-5 sm:px-6">
          <SearchIcon className="size-[18px] shrink-0 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <input
            data-autofocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={d.search.placeholder}
            aria-label={d.search.title}
            aria-controls="search-results"
            className="h-16 w-full bg-transparent text-base text-fg outline-none placeholder:text-subtle/70 sm:text-lg"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={d.search.close}
            className="flex size-9 shrink-0 items-center justify-center text-muted transition-colors hover:text-fg"
          >
            <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[min(60vh,32rem)] overflow-y-auto" aria-live="polite" aria-busy={status === "loading"}>
          {status === "idle" ? (
            <p className="px-6 py-10 text-center text-sm text-subtle">{d.search.hint}</p>
          ) : status === "loading" && results.length === 0 ? (
            <ul className="p-3">
              {[0, 1, 2].map((index) => (
                <li key={index} className="flex items-center gap-4 p-3">
                  <div className="size-16 shrink-0 skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/5 skeleton" />
                    <div className="h-2.5 w-1/4 skeleton" />
                  </div>
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="mb-1.5 text-sm text-fg">{t(d.search.noResults, { query: query.trim() })}</p>
              <p className="text-sm text-subtle">{d.search.noResultsBody}</p>
            </div>
          ) : (
            <>
              <ul id="search-results" ref={listRef} className="p-2" role="listbox">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      href={href(`/collection/${result.slug}`)}
                      onClick={onClose}
                      onMouseEnter={() => setActive(index)}
                      aria-selected={index === active}
                      role="option"
                      className={cn(
                        "flex items-center gap-4 p-3 transition-colors duration-200",
                        index === active ? "bg-sunken" : "hover:bg-sunken/60",
                      )}
                    >
                      <Media
                        src={result.image}
                        alt={result.imageAlt}
                        className="size-16 shrink-0"
                        sizes="64px"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] text-fg">{result.name}</span>
                        <span className="eyebrow mt-1 block text-[0.5625rem]">{result.categoryName}</span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted flip-rtl"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line p-2">
                <Link
                  href={href(`/search?q=${encodeURIComponent(query.trim())}`)}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 p-3 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent rtl:text-xs rtl:normal-case rtl:tracking-normal"
                >
                  {d.search.viewAll}
                  <ArrowRight className="size-3.5 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
