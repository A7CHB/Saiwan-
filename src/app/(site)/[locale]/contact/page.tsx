import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MessageCircle } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/data/catalog";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CanopyRadial } from "@/components/icons/canopy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = await getDictionary(locale);
  return buildMetadata({ locale, path: "/contact", title: d.contact.title, description: d.contact.intro });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [d, settings] = await Promise.all([getDictionary(locale), getSettings()]);

  return (
    <div className="relative overflow-hidden">
      <CanopyRadial className="pointer-events-none absolute -end-40 top-24 size-[36rem] text-accent opacity-[0.05]" />

      <header className="shell relative pb-14 pt-32 sm:pt-40">
        <Reveal>
          <p className="eyebrow mb-6">{d.contact.eyebrow}</p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display max-w-3xl text-display text-balance">{d.contact.title}</h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-7 max-w-xl text-lead leading-relaxed text-muted">{d.contact.intro}</p>
        </Reveal>
      </header>

      <div className="shell relative grid gap-14 pb-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* WhatsApp is presented first and largest — it is the route the
            business actually wants, and the one that answers fastest. */}
        <div className="flex flex-col gap-10">
          <Reveal className="border border-line bg-elevated p-8">
            <span
              aria-hidden="true"
              className="mb-6 flex size-11 items-center justify-center rounded-full bg-[#25D366]/12 text-[#1aa34a]"
            >
              <MessageCircle className="size-5" strokeWidth={1.5} />
            </span>
            <h2 className="display text-heading">{d.contact.whatsappTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted">{d.contact.whatsappBody}</p>
            <WhatsAppButton variant="brand" size="md" className="mt-7" label={d.contact.whatsappCta} />
          </Reveal>

          <Reveal delay={80}>
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              <div className="flex items-start gap-4 py-5">
                <Clock className="mt-0.5 size-4 shrink-0 text-subtle" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <dt className="eyebrow mb-1.5 text-[0.5625rem]">{d.contact.hours}</dt>
                  <dd className="text-sm text-muted">{d.contact.hoursValue}</dd>
                </div>
              </div>
              {settings["contact.email"] ? (
                <div className="py-5">
                  <dt className="eyebrow mb-1.5 text-[0.5625rem]">{d.form.email}</dt>
                  <dd className="text-sm">
                    <a
                      href={`mailto:${settings["contact.email"]}`}
                      dir="ltr"
                      className="link-underline text-muted transition-colors hover:text-fg"
                    >
                      {settings["contact.email"]}
                    </a>
                  </dd>
                </div>
              ) : null}
              {settings["contact.address"] ? (
                <div className="py-5">
                  <dt className="eyebrow mb-1.5 text-[0.5625rem]">{d.contact.location}</dt>
                  <dd className="text-sm leading-relaxed text-muted">{settings["contact.address"]}</dd>
                </div>
              ) : null}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <h2 className="display text-heading">{d.contact.formTitle}</h2>
          <p className="mt-3 mb-9 leading-relaxed text-muted">{d.contact.formBody}</p>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
