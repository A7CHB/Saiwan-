"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Link2, Loader2, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The product's photographs.
 *
 * This replaced a textarea of URLs, which asked the business to host an image
 * somewhere else before they could use it — so in practice product photography
 * could only be changed by a developer. Here a file is picked, uploaded and
 * shown, and the order is dragged into place with two buttons rather than by
 * retyping lines.
 *
 * The value still leaves as a newline-separated list in a hidden field, because
 * that is what the server action already reads and there was no reason to make
 * this a different shape on the way out. Pasting a URL is kept: some images
 * live on a photographer's CDN and re-uploading them would only make a second
 * copy that can fall out of date.
 */
export function ImageManager({
  name,
  defaultValue,
  max = 12,
}: {
  name: string;
  defaultValue: string;
  max?: number;
}) {
  const [urls, setUrls] = useState<string[]>(() =>
    defaultValue.split("\n").map((line) => line.trim()).filter(Boolean),
  );
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const fieldId = useId();

  const room = max - urls.length;

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);

    const chosen = Array.from(files).slice(0, Math.max(0, room));
    if (chosen.length < files.length) {
      setError(`Only ${max} images per product. Some were not added.`);
    }

    for (const file of chosen) {
      setBusy((n) => n + 1);
      try {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const result = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !result.url) {
          setError(result.error ?? "The upload failed.");
        } else {
          // Appended one at a time so a part-failed batch still keeps whatever
          // did arrive, rather than discarding the lot.
          setUrls((current) => [...current, result.url as string]);
        }
      } catch {
        setError("The upload failed. Check your connection and try again.");
      } finally {
        setBusy((n) => n - 1);
      }
    }

    if (fileInput.current) fileInput.current.value = "";
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= urls.length) return;
    setUrls((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const addPasted = () => {
    const value = pasted.trim();
    if (!value || urls.includes(value) || room <= 0) return;
    setUrls((current) => [...current, value]);
    setPasted("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* What the server action reads. Everything above is how it gets filled. */}
      <input type="hidden" name={name} value={urls.join("\n")} />

      {urls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {urls.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className="group relative overflow-hidden rounded-sm border border-line bg-sunken"
            >
              <div className="relative aspect-square">
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-contain"
                  unoptimized
                />
              </div>

              {index === 0 ? (
                <span className="absolute start-1.5 top-1.5 inline-flex items-center gap-1 rounded-xs bg-fg/85 px-1.5 py-0.5 text-[0.5625rem] font-medium uppercase tracking-[0.1em] text-bg">
                  <Star className="size-2.5" aria-hidden="true" />
                  Primary
                </span>
              ) : null}

              <div className="flex items-center justify-between gap-1 border-t border-line bg-elevated px-1.5 py-1">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move image ${index + 1} earlier`}
                    className="flex size-7 items-center justify-center text-muted transition-colors hover:text-fg disabled:opacity-30"
                  >
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === urls.length - 1}
                    aria-label={`Move image ${index + 1} later`}
                    className="flex size-7 items-center justify-center text-muted transition-colors hover:text-fg disabled:opacity-30"
                  >
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setUrls((current) => current.filter((_, i) => i !== index))}
                  aria-label={`Remove image ${index + 1}`}
                  className="flex size-7 items-center justify-center text-muted transition-colors hover:text-terracotta"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-sm border border-dashed border-line-strong px-4 py-8 text-center text-sm text-subtle">
          No images yet. The first one you add becomes the card and the primary view.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInput}
          id={fieldId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          className="sr-only"
          onChange={(event) => void upload(event.target.files)}
        />
        <label
          htmlFor={fieldId}
          aria-disabled={room <= 0}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-2 rounded-xs bg-fg px-4 text-xs font-medium text-bg transition-colors hover:bg-accent hover:text-accent-fg",
            room <= 0 && "pointer-events-none opacity-40",
          )}
        >
          {busy > 0 ? (
            <Loader2 className="size-3.5 animate-[saiwan-spin_0.9s_linear_infinite]" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-3.5" aria-hidden="true" />
          )}
          {busy > 0 ? `Uploading ${busy}…` : "Upload images"}
        </label>

        <span className="text-xs text-subtle">
          {urls.length} of {max} · JPEG, PNG, WebP, AVIF or GIF up to 8 MB
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link2 className="size-3.5 shrink-0 text-subtle" aria-hidden="true" />
        <input
          type="text"
          value={pasted}
          onChange={(event) => setPasted(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              // This sits inside the product form; Enter here means "add this
              // URL", not "save the product".
              event.preventDefault();
              addPasted();
            }
          }}
          placeholder="…or paste an image URL and press Enter"
          className="h-9 min-w-0 flex-1 rounded-xs border border-line bg-elevated px-3 font-mono text-xs outline-none transition-colors focus:border-accent"
        />
        <button
          type="button"
          onClick={addPasted}
          disabled={!pasted.trim() || room <= 0}
          className="h-9 shrink-0 rounded-xs border border-line-strong px-3 text-xs transition-colors hover:border-fg disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {error ? <p className="text-xs text-terracotta">{error}</p> : null}
    </div>
  );
}
