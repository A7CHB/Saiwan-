"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { isValidPhone } from "@/lib/utils";
import { buildWhatsAppUrl, composeMessage, generalInquiryPayload } from "@/lib/whatsapp";
import { track } from "@/lib/analytics-client";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

/**
 * The non-WhatsApp route in.
 *
 * Kept for people who will not start a chat with a business they have not met —
 * and it lands in exactly the same inquiry pipeline, so the admin has one list
 * rather than two. On success it offers the WhatsApp handoff with the reference
 * already in the message.
 */
export function ContactForm() {
  const { d, t, locale } = useLocale();
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = d.form.errors.required;
    if (!values.phone.trim()) next.phone = d.form.errors.required;
    else if (!isValidPhone(values.phone)) next.phone = d.form.errors.phone;
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = d.form.errors.email;
    }
    if (!values.message.trim()) next.message = d.form.errors.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: values.name.trim(),
          customerPhone: values.phone.trim(),
          customerEmail: values.email.trim() || null,
          message: values.message.trim(),
          locale,
          source: "CONTACT",
          configuration: {},
        }),
      });

      if (!response.ok) throw new Error("failed");
      const data = (await response.json()) as { reference: string };
      setReference(data.reference);
      setStatus("sent");
      track("inquiry", { meta: { source: "contact_form" } });
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    const href = buildWhatsAppUrl(
      composeMessage(
        d,
        generalInquiryPayload(d, {
          customerName: values.name.trim(),
          note: values.message.trim(),
          reference: reference ?? undefined,
        }),
      ),
    );

    return (
      <div className="border border-line bg-elevated p-8 text-center animate-rise">
        <span
          aria-hidden="true"
          className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-accent text-accent-fg"
        >
          <Check className="size-5" strokeWidth={2} />
        </span>
        <h3 className="display text-heading">{d.contact.success.title}</h3>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-muted">
          {t(d.contact.success.body, { reference: reference ?? "—" })}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { meta: { surface: "contact_success" } })}
          className="mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-xs bg-[#25D366] px-7 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[#04150b] transition-colors hover:bg-[#1fbe59] rtl:normal-case rtl:tracking-normal"
        >
          <WhatsAppIcon className="size-4" />
          {d.contact.success.cta}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <Input
          label={d.contact.fields.name}
          placeholder={d.contact.fields.namePlaceholder}
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
          maxLength={80}
          required
        />
        <Input
          label={d.contact.fields.phone}
          placeholder={d.contact.fields.phonePlaceholder}
          value={values.phone}
          onChange={set("phone")}
          error={errors.phone}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          dir="ltr"
          maxLength={30}
          required
        />
      </div>

      <Input
        label={d.contact.fields.email}
        placeholder={d.contact.fields.emailPlaceholder}
        value={values.email}
        onChange={set("email")}
        error={errors.email}
        type="email"
        autoComplete="email"
        dir="ltr"
        maxLength={160}
        hint={d.common.optional}
      />

      <Textarea
        label={d.contact.fields.message}
        placeholder={d.contact.fields.messagePlaceholder}
        value={values.message}
        onChange={set("message")}
        error={errors.message}
        rows={5}
        maxLength={2000}
        required
      />

      {status === "error" ? (
        <p role="alert" className="text-sm text-terracotta">
          {d.form.errors.generic}
        </p>
      ) : null}

      <Button type="submit" size="lg" loading={status === "sending"} className="self-start">
        {status === "sending" ? d.contact.sending : d.contact.submit}
      </Button>
    </form>
  );
}
