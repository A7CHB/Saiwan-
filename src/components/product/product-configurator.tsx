"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import type { ProductDetail } from "@/lib/data/products";
import { useLocale } from "@/components/i18n/locale-provider";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { formatPrice } from "@/lib/i18n/format";
import { track } from "@/lib/analytics-client";
import { buildWhatsAppUrl, composeMessage, productInquiryPayload } from "@/lib/whatsapp";
import { inquiryReference, cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/seo";

/**
 * The specification panel — the site's conversion engine.
 *
 * Everything the customer chooses here is folded into a pre-written WhatsApp
 * message, so the conversation opens with a complete brief instead of "hello,
 * I'm interested". The same configuration is posted to `/api/inquiries` on the
 * way out, which is what gives the admin a pipeline to work rather than a
 * disconnected inbox.
 */
export function ProductConfigurator({
  product,
  selectedColorId,
  onColorChange,
}: {
  product: ProductDetail;
  selectedColorId: string | null;
  onColorChange: (colorId: string) => void;
}) {
  const { d, t, locale } = useLocale();

  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [accessoryIds, setAccessoryIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  // One reference per page view, shared by the WhatsApp message and the stored
  // inquiry so the business can match the two. Generated after mount rather
  // than during render: a random value produced on both server and client
  // would differ and break hydration.
  const [reference, setReference] = useState<string | null>(null);
  useEffect(() => setReference(inquiryReference()), []);

  const size = product.sizes.find((option) => option.id === sizeId) ?? null;
  const color = product.colors.find((option) => option.id === selectedColorId) ?? product.colors[0] ?? null;
  const accessories = product.accessories.filter((item) => accessoryIds.includes(item.id));

  const unitPrice = size?.price ?? product.price;
  const total = unitPrice == null ? null : unitPrice * quantity;

  const url = absoluteUrl(`/${locale}/collection/${product.slug}`);

  const whatsappHref = useMemo(
    () =>
      buildWhatsAppUrl(
        composeMessage(
          d,
          productInquiryPayload(d, {
            productName: product.name,
            categoryName: product.categoryName,
            sizeLabel: size?.label,
            colorName: color?.name,
            quantity,
            accessories: accessories.map((item) => item.name),
            customerName: name.trim() || undefined,
            note: note.trim() || undefined,
            url,
            reference: reference ?? undefined,
          }),
        ),
      ),
    [d, product, size, color, quantity, accessories, name, note, url, reference],
  );

  /**
   * Runs on the way to WhatsApp. `sendBeacon` is essential here: the click
   * navigates the tab, and a normal fetch would be cancelled — losing the one
   * event the business actually needs.
   */
  const recordInquiry = () => {
    track("whatsapp_click", { productId: product.id, meta: { surface: "configurator" } });

    const body = JSON.stringify({
      reference: reference ?? undefined,
      productId: product.id,
      customerName: name.trim() || null,
      locale,
      source: "PRODUCT",
      message: note.trim() || null,
      configuration: {
        productName: product.name,
        sizeLabel: size?.label ?? null,
        colorName: color?.name ?? null,
        quantity,
        accessories: accessories.map((item) => item.name),
      },
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/inquiries", new Blob([body], { type: "application/json" }));
      } else {
        void fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* never block the customer from reaching WhatsApp */
    }
  };

  const toggleAccessory = (id: string) => {
    setAccessoryIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  return (
    <div className="flex flex-col gap-9">
      {/* Sizes */}
      {product.sizes.length > 0 ? (
        <fieldset>
          <legend className="eyebrow mb-4">{d.product.selectSize}</legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((option) => {
              const selected = option.id === sizeId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSizeId(option.id)}
                  aria-pressed={selected}
                  aria-label={t(d.a11y.selectSize, { label: option.label })}
                  className={cn(
                    "rounded-xs border px-4 py-2.5 text-sm tabular-nums transition-colors duration-300",
                    selected
                      ? "border-fg bg-fg text-bg"
                      : "border-line text-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {size ? (
            <p className="mt-3 text-xs text-subtle">
              {d.product.shapes[size.shape as keyof typeof d.product.shapes]}
              {size.areaM2 ? ` · ${t(d.product.coverageValue, { value: size.areaM2 })}` : ""}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {/* Colours */}
      {product.colors.length > 0 ? (
        <fieldset>
          <legend className="eyebrow mb-4">
            {d.product.selectColor}
            {color ? <span className="ms-2 normal-case tracking-normal text-fg">— {color.name}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((option) => {
              const selected = option.id === (selectedColorId ?? product.colors[0]?.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onColorChange(option.id)}
                  aria-pressed={selected}
                  aria-label={t(d.a11y.selectColor, { name: option.name })}
                  title={option.name}
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full border transition-all duration-300",
                    selected ? "border-fg ring-1 ring-fg ring-offset-2 ring-offset-bg" : "border-line-strong hover:scale-105",
                  )}
                >
                  <span
                    className="size-8 rounded-full"
                    style={{ backgroundColor: option.hex }}
                    aria-hidden="true"
                  />
                  {selected ? (
                    <Check
                      className="absolute size-4 text-white mix-blend-difference"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Quantity */}
      <fieldset>
        <legend className="eyebrow mb-4">{d.product.selectQuantity}</legend>
        <div className="inline-flex items-center border border-line">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            aria-label={d.a11y.decreaseQuantity}
            className="flex size-11 items-center justify-center text-muted transition-colors hover:text-fg disabled:opacity-30"
          >
            <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <span
            className="w-12 text-center text-sm tabular-nums"
            aria-live="polite"
            aria-label={`${d.common.quantity}: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(99, value + 1))}
            disabled={quantity >= 99}
            aria-label={d.a11y.increaseQuantity}
            className="flex size-11 items-center justify-center text-muted transition-colors hover:text-fg disabled:opacity-30"
          >
            <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </fieldset>

      {/* Accessories */}
      {product.accessories.length > 0 ? (
        <fieldset>
          <legend className="eyebrow mb-4">{d.product.addAccessories}</legend>
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {product.accessories.map((accessory) => {
              const checked = accessoryIds.includes(accessory.id);
              return (
                <li key={accessory.id}>
                  <label className="flex cursor-pointer items-center gap-3 py-3.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAccessory(accessory.id)}
                      className="peer sr-only"
                    />
                    {/* The input is visually hidden, so this box has to show
                        the focus ring on its behalf. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-[18px] shrink-0 items-center justify-center border transition-colors",
                        "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                        checked ? "border-accent bg-accent" : "border-line-strong",
                      )}
                    >
                      {checked ? (
                        <Check className="size-3 text-accent-fg" strokeWidth={2.5} />
                      ) : null}
                    </span>
                    <span className="flex-1 text-sm">{accessory.name}</span>
                    {accessory.showPrice && accessory.price != null ? (
                      <span className="text-sm text-muted tabular-nums">
                        {formatPrice(accessory.price, locale, accessory.currency)}
                      </span>
                    ) : null}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : null}

      {/* Contact details — optional by design. Requiring a name before letting
          someone message on WhatsApp costs conversions and gains nothing: their
          number arrives with the message either way. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[0.625rem] rtl:text-xs">
            {d.form.name}{" "}
            <span className="normal-case tracking-normal text-subtle">({d.common.optional})</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            autoComplete="name"
            placeholder={d.contact.fields.namePlaceholder}
            className="w-full border-b border-line bg-transparent py-2.5 text-sm outline-none transition-colors placeholder:text-subtle/60 focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[0.625rem] rtl:text-xs">
            {d.form.notes}{" "}
            <span className="normal-case tracking-normal text-subtle">({d.common.optional})</span>
          </span>
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={300}
            className="w-full border-b border-line bg-transparent py-2.5 text-sm outline-none transition-colors placeholder:text-subtle/60 focus:border-accent"
          />
        </label>
      </div>

      {/* Summary — a receipt of the decisions, so the customer can check the
          brief before it is sent rather than after. */}
      <div className="border border-line bg-elevated p-5">
        <p className="eyebrow mb-4">{d.product.yourSelection}</p>
        <dl className="flex flex-col gap-2.5 text-sm">
          <Row label={d.whatsapp.messageFields.product} value={product.name} />
          {size ? <Row label={d.product.selectSize} value={size.label} /> : null}
          {color ? <Row label={d.product.selectColor} value={color.name} /> : null}
          <Row label={d.common.quantity} value={String(quantity)} />
          {accessories.length > 0 ? (
            <Row label={d.product.accessories} value={accessories.map((item) => item.name).join(", ")} />
          ) : null}
          <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <dt className="text-muted">{d.common.from}</dt>
            <dd className="display text-heading tabular-nums">
              {product.showPrice && total != null
                ? formatPrice(total, locale, product.currency)
                : d.common.priceOnRequest}
            </dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={recordInquiry}
          className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-xs bg-[#25D366] text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-[#04150b] transition-colors duration-500 hover:bg-[#1fbe59] rtl:normal-case rtl:tracking-normal"
        >
          <WhatsAppIcon className="size-5 transition-transform duration-500 group-hover:scale-110" />
          {d.product.orderViaWhatsApp}
        </a>

        <div className="flex gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={recordInquiry}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-xs border border-line-strong text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 hover:border-fg hover:bg-fg hover:text-bg rtl:normal-case rtl:tracking-normal"
          >
            {d.product.requestQuote}
          </a>
        </div>

        {reference ? (
          <p className="text-center text-xs text-subtle">
            {d.common.reference}: <span className="tabular-nums">{reference}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-end text-fg">{value}</dd>
    </div>
  );
}
