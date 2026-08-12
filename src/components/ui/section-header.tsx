import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Every chapter opens the same way: a hairline, a micro-caps label, a display
 * heading and an optional lead. Standardising it is what makes the page read as
 * one document rather than a stack of unrelated blocks.
 */
export function SectionHeader({
  eyebrow,
  title,
  body,
  cta,
  align = "start",
  className,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  cta?: { href: string; label: string };
  align?: "start" | "center";
  className?: string;
  tone?: "default" | "light";
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
        centered && "lg:flex-col lg:items-center lg:text-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
        <Reveal kind="scale-x" className={cn("mb-7 h-px w-16", tone === "light" ? "bg-white/30" : "bg-line-strong")} />

        <Reveal>
          <p className={cn("eyebrow mb-5", tone === "light" && "text-white/60")}>{eyebrow}</p>
        </Reveal>

        <Reveal delay={80}>
          <h2
            className={cn(
              "display text-title text-balance",
              tone === "light" ? "text-white" : "text-fg",
            )}
          >
            {title}
          </h2>
        </Reveal>

        {body ? (
          <Reveal delay={160}>
            <p
              className={cn(
                "mt-5 max-w-xl text-lead leading-relaxed",
                centered && "mx-auto",
                tone === "light" ? "text-white/70" : "text-muted",
              )}
            >
              {body}
            </p>
          </Reveal>
        ) : null}
      </div>

      {cta ? (
        <Reveal delay={200} className="shrink-0">
          <Link
            href={cta.href}
            className={cn(
              "group inline-flex items-center gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 rtl:text-sm rtl:normal-case rtl:tracking-normal",
              tone === "light" ? "text-white/80 hover:text-white" : "text-muted hover:text-accent",
            )}
          >
            <span className="link-underline">{cta.label}</span>
            <ArrowRight
              className="size-3.5 flip-rtl transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      ) : null}
    </div>
  );
}
