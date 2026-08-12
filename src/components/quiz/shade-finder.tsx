"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import type { ProductCard as ProductCardModel } from "@/lib/data/products";
import type { ColorView } from "@/lib/data/catalog";
import { useLocale } from "@/components/i18n/locale-provider";
import { ProductCard } from "@/components/product/product-card";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { CanopyRadial } from "@/components/icons/canopy";
import { STYLES, USE_CASES, PRICE_TIERS } from "@/lib/constants";
import { scoreProducts, isRecommendable, type QuizAnswers, type AreaBand } from "@/lib/quiz";
import { track } from "@/lib/analytics-client";
import { buildWhatsAppUrl, composeMessage, quizInquiryPayload } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

type StepKey = "placement" | "area" | "segment" | "style" | "color" | "tier";

/**
 * The consultation.
 *
 * Scoring runs entirely on the client against the catalogue passed in from the
 * server, so answering a question is instant and the whole flow works with one
 * page load. The answers travel to WhatsApp with the recommendation, which is
 * the point: the customer never has to describe their space twice.
 */
export function ShadeFinder({ products, colors }: { products: ProductCardModel[]; colors: ColorView[] }) {
  const { d, t, locale, href } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");

  const steps: {
    key: StepKey;
    title: string;
    body: string;
    options: { value: string; label: string; hint?: string; swatch?: string }[];
  }[] = [
    {
      key: "placement",
      title: d.quiz.questions.placement.title,
      body: d.quiz.questions.placement.body,
      options: USE_CASES.map((useCase) => ({ value: useCase, label: d.product.settings[useCase] })),
    },
    {
      key: "area",
      title: d.quiz.questions.area.title,
      body: d.quiz.questions.area.body,
      options: (["small", "medium", "large", "xlarge"] as AreaBand[]).map((band) => ({
        value: band,
        label: d.quiz.areaOptions[band],
      })),
    },
    {
      key: "segment",
      title: d.quiz.questions.segment.title,
      body: d.quiz.questions.segment.body,
      options: [
        { value: "RESIDENTIAL", label: d.product.segments.RESIDENTIAL },
        { value: "COMMERCIAL", label: d.product.segments.COMMERCIAL },
      ],
    },
    {
      key: "style",
      title: d.quiz.questions.style.title,
      body: d.quiz.questions.style.body,
      options: STYLES.map((style) => ({ value: style, label: d.product.styles[style] })),
    },
    {
      key: "color",
      title: d.quiz.questions.color.title,
      body: d.quiz.questions.color.body,
      options: [
        { value: "", label: d.quiz.colorNoPreference },
        ...colors.map((color) => ({ value: color.slug, label: color.name, swatch: color.hex })),
      ],
    },
    {
      key: "tier",
      title: d.quiz.questions.tier.title,
      body: d.quiz.questions.tier.body,
      options: PRICE_TIERS.map((tier) => ({
        value: String(tier),
        label: d.quiz.tierOptions[String(tier) as "1" | "2" | "3"],
      })),
    },
  ];

  const recommendations = useMemo(() => {
    if (!done) return [];
    return scoreProducts(products.filter(isRecommendable), answers).slice(0, 3);
  }, [done, products, answers]);

  const choose = (key: StepKey, value: string) => {
    setAnswers((current) => ({
      ...current,
      [key]: key === "tier" ? (value ? Number(value) : undefined) : value || undefined,
    }));
    advance();
  };

  const advance = () => {
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
    } else {
      setDone(true);
      track("quiz_complete", { meta: { answered: Object.keys(answers).length } });
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const labelFor = (key: StepKey) => {
    const value = answers[key as keyof QuizAnswers];
    if (value === undefined) return "";
    const found = steps.find((s) => s.key === key)?.options.find((o) => o.value === String(value));
    return found?.label ?? String(value);
  };

  const whatsappHref = useMemo(() => {
    const colorName = colors.find((color) => color.slug === answers.color)?.name;
    return buildWhatsAppUrl(
      composeMessage(
        d,
        quizInquiryPayload(d, {
          placement: labelFor("placement"),
          area: labelFor("area"),
          segment: labelFor("segment"),
          style: labelFor("style"),
          color: colorName,
          tier: labelFor("tier"),
          recommended: recommendations.map((item) => item.product.name),
          customerName: name.trim() || undefined,
          url: absoluteUrl(`/${locale}/find-your-shade`),
        }),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, answers, recommendations, name, locale, colors]);

  // ---------------------------------------------------------------- results
  if (done) {
    const [best, ...others] = recommendations;

    return (
      <div className="shell pb-28 pt-32 sm:pt-40">
        {best && best.score > 0 ? (
          <>
            <Reveal>
              <p className="eyebrow mb-6">{d.quiz.results.eyebrow}</p>
              <h1 className="display max-w-3xl text-display text-balance">{d.quiz.results.title}</h1>
              <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted">{d.quiz.results.body}</p>
            </Reveal>

            {/* Best match */}
            <Reveal delay={120} className="mt-16">
              {/* The piece's own name is an h3, so the section needs an h2. */}
              <h2 className="sr-only">{d.quiz.results.bestMatch}</h2>
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
                <ProductCard product={best.product} size="large" index={0} showTagline={false} priority />
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-xs bg-accent px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-accent-fg rtl:text-xs rtl:normal-case rtl:tracking-normal">
                      <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                      {d.quiz.results.bestMatch}
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {t(d.quiz.results.matchScore, { score: best.score })}
                    </span>
                  </div>
                  <p className="display text-title leading-[1.15] text-balance">
                    {best.product.tagline ?? best.product.name}
                  </p>
                  <Link
                    href={href(`/collection/${best.product.slug}`)}
                    className="group mt-8 inline-flex items-center gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors hover:text-accent rtl:text-sm rtl:normal-case rtl:tracking-normal"
                  >
                    <span className="link-underline">{d.common.viewProduct}</span>
                    <ArrowRight className="size-3.5 flip-rtl transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {others.length > 0 ? (
              <div className="mt-20">
                <h2 className="eyebrow mb-8">{d.quiz.results.alsoConsider}</h2>
                <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
                  {others.map((item, index) => (
                    <Reveal as="li" key={item.product.id} delay={index * 90}>
                      <ProductCard product={item.product} index={index + 1} />
                      <p className="mt-3 text-xs text-subtle tabular-nums">
                        {t(d.quiz.results.matchScore, { score: item.score })}
                      </p>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : (
          <Reveal>
            <p className="eyebrow mb-6">{d.quiz.results.eyebrow}</p>
            <h1 className="display max-w-3xl text-title text-balance">{d.quiz.results.none.title}</h1>
            <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted">{d.quiz.results.none.body}</p>
          </Reveal>
        )}

        {/* Send to WhatsApp — the answers travel with the message. */}
        <Reveal delay={160} className="mt-20 border border-line bg-elevated p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="display text-heading">{d.quiz.results.cta}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{d.quiz.results.ctaBody}</p>

              <label className="mt-6 flex max-w-sm flex-col gap-1.5">
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { meta: { surface: "quiz" } })}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-xs bg-[#25D366] px-8 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-[#04150b] transition-colors hover:bg-[#1fbe59] rtl:normal-case rtl:tracking-normal"
              >
                <WhatsAppIcon className="size-5" />
                {d.quiz.results.cta}
              </a>
              <button
                type="button"
                onClick={restart}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xs border border-line-strong px-8 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-fg rtl:normal-case rtl:tracking-normal"
              >
                <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden="true" />
                {d.quiz.results.retake}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  // ------------------------------------------------------------- questions
  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24">
      <CanopyRadial className="pointer-events-none absolute -end-40 top-10 size-[40rem] text-accent opacity-[0.06]" />

      {/* Progress rail */}
      <div className="shell relative">
        <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="eyebrow" aria-live="polite">
            {t(d.quiz.stepOf, { current: step + 1, total: steps.length })}
          </p>
          <div className="h-px flex-1 bg-line" role="presentation">
            <div
              className="h-px bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-subtle tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="shell relative flex flex-1 flex-col justify-center py-14">
        {/* `key` restarts the entry animation for each question. */}
        <div key={currentStep.key} className="animate-rise">
          <p className="eyebrow mb-6">{d.quiz.eyebrow}</p>
          <h1 className="display max-w-3xl text-title text-balance">{currentStep.title}</h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{currentStep.body}</p>

          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currentStep.options.map((option, index) => {
              const selected = String(answers[currentStep.key as keyof QuizAnswers] ?? "") === option.value;
              return (
                <li key={option.value || "none"}>
                  <button
                    type="button"
                    onClick={() => choose(currentStep.key, option.value)}
                    aria-pressed={selected}
                    style={{ animationDelay: `${index * 45}ms` }}
                    className={cn(
                      "group flex w-full animate-rise items-center gap-4 border p-5 text-start transition-colors duration-300",
                      selected
                        ? "border-accent bg-accent/5"
                        : "border-line hover:border-line-strong hover:bg-elevated",
                    )}
                  >
                    {option.swatch ? (
                      <span
                        className="size-8 shrink-0 rounded-full border border-line"
                        style={{ backgroundColor: option.swatch }}
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="text-[0.625rem] tabular-nums text-subtle transition-colors group-hover:text-accent"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    <span className="flex-1 text-sm leading-snug">{option.label}</span>
                    <ArrowRight
                      className="size-4 flip-rtl shrink-0 text-subtle opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 rtl:group-hover:-translate-x-1"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 flex items-center gap-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((value) => value - 1)}
                className="inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg rtl:text-sm rtl:normal-case rtl:tracking-normal"
              >
                <ArrowLeft className="size-4 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
                {d.common.back}
              </button>
            ) : null}
            <button
              type="button"
              onClick={advance}
              className="text-[0.6875rem] uppercase tracking-[0.16em] text-subtle transition-colors hover:text-fg rtl:text-sm rtl:normal-case rtl:tracking-normal"
            >
              {d.quiz.skip}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
