"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Media } from "@/components/ui/media";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { UMBRELLA_PLATE, type SceneKey } from "@/lib/home-scenes";
import { cn } from "@/lib/utils";

/** 0 below `from`, 1 above `to`, eased between. */
const smoothstep = (from: number, to: number, value: number) => {
  const x = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return x * x * (3 - 2 * x);
};

export type ShowroomScene = {
  key: SceneKey;
  image: string;
  position: string;
  name: string;
  body: string;
};

/**
 * One object. Infinite spaces.
 *
 * A single umbrella stands still while five environments pass behind it. The
 * scroll position is the camera: one viewport of scroll per scene, with the
 * environments cross-fading and the camera moving *toward the canopy* as it
 * goes, so each change happens while the fabric fills the frame rather than as
 * a dissolve between two unrelated pictures. Coming out of the transition the
 * camera pulls back and the same umbrella is standing somewhere new.
 *
 * Everything the scroll drives is opacity and transform, written straight to
 * the nodes from one rAF-throttled listener. React renders once per *scene*
 * change — for the indicator and `aria-current` — not once per frame.
 *
 * The first frame is composed in the markup, not by JavaScript: scene one is
 * opaque and the rest are transparent from their inline styles, so the opening
 * shot is correct before any script runs and stays correct if none does.
 *
 * Under reduced motion the whole mechanism is dropped for five plain sections,
 * which is the same story told by scrolling rather than by a camera.
 */
export function Showroom({
  scenes,
  eyebrow,
  titleTop,
  titleBottom,
  intro,
  primaryCta,
  secondaryCta,
  collectionHref,
  navLabel,
}: {
  scenes: ShowroomScene[];
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  collectionHref: string;
  navLabel: string;
}) {
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);

  const frameRef = useRef<HTMLDivElement>(null);
  const envRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const umbrellaRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reduced) return;

    let raf = 0;
    let last = -1;

    const render = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(1, rect.height - viewport);
      // 0 at the first scene, scenes.length - 1 at the last.
      const p = Math.min(scenes.length - 1, Math.max(0, (-rect.top / travel) * (scenes.length - 1)));

      // How far into a transition we are: 0 at a scene, 1 midway between two.
      const phase = p - Math.floor(p);
      const between = 1 - Math.abs(phase * 2 - 1);

      for (let i = 0; i < scenes.length; i += 1) {
        const distance = Math.min(1, Math.abs(p - i));
        // The swap is held back to the middle third of the transition, where
        // the canopy is large enough to cover it. A cross-fade spread evenly
        // across the whole scene would be exactly the dissolve between five
        // unrelated pictures this is meant not to be.
        const eased = smoothstep(0.34, 0.66, distance);
        const env = envRefs.current[i];
        if (env) {
          env.style.opacity = String(1 - eased);
          env.style.transform = `scale(${(1.06 - 0.06 * distance).toFixed(4)})`;
        }
        const copy = copyRefs.current[i];
        if (copy) {
          // Type leaves sooner than the picture: it should never be caught
          // half-legible over the wrong scene.
          const fade = Math.min(1, distance * 2);
          copy.style.opacity = String(1 - fade);
          copy.style.transform = `translate3d(0, ${((p - i) * -26).toFixed(1)}px, 0)`;
          copy.style.pointerEvents = distance < 0.4 ? "auto" : "none";
        }
      }

      const umbrella = umbrellaRef.current;
      if (umbrella) {
        // The camera moves toward the canopy through the transition and pulls
        // back out of it. At the peak the fabric is most of the frame, which is
        // what the environments change behind. The object never leaves the
        // frame — it is the one thing every scene has in common.
        const swell = Math.pow(between, 1.15);
        umbrella.style.transform = `scale(${(1 + 2.1 * swell).toFixed(4)})`;
      }

      const veil = veilRef.current;
      if (veil) {
        // Light through fabric, not a fade to black. The canopy is ivory, so
        // the frame lifts warm at the peak rather than dipping dark — which is
        // what passing under a canopy actually looks like, and it covers the
        // last of the seam between two environments.
        veil.style.opacity = (0.42 * Math.pow(between, 2.2)).toFixed(3);
      }

      const nearest = Math.round(p);
      if (nearest !== last) {
        last = nearest;
        setActive(nearest);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    render();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, scenes.length]);

  const goTo = useCallback(
    (index: number) => {
      const frame = frameRef.current;
      if (!frame) return;
      if (reduced) {
        document.getElementById(`scene-${scenes[index].key}`)?.scrollIntoView({ behavior: "auto" });
        return;
      }
      const travel = frame.offsetHeight - window.innerHeight;
      const top = frame.offsetTop + (travel * index) / Math.max(1, scenes.length - 1);
      window.scrollTo({ top, behavior: "smooth" });
    },
    [reduced, scenes],
  );

  const indicator = (
    <nav
      aria-label={navLabel}
      className={cn(
        "pointer-events-auto flex gap-x-5 gap-y-2",
        "max-lg:overflow-x-auto max-lg:no-scrollbar",
        "lg:flex-col lg:gap-3",
      )}
    >
      {scenes.map((scene, index) => {
        const current = index === active;
        return (
          <button
            key={scene.key}
            type="button"
            onClick={() => goTo(index)}
            aria-current={current ? "true" : undefined}
            className="group flex shrink-0 items-center gap-3 text-start"
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-px transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                current ? "w-8 bg-white" : "w-3 bg-white/40 group-hover:w-5 group-hover:bg-white/70",
              )}
            />
            <span
              className={cn(
                "text-[0.625rem] font-medium uppercase tracking-[0.18em] transition-colors duration-500 rtl:text-xs rtl:normal-case rtl:tracking-normal",
                current ? "text-white" : "text-white/45 group-hover:text-white/80",
              )}
            >
              <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span className="ms-2.5">{scene.name}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );

  // ---------------------------------------------------------------- reduced
  if (reduced) {
    return (
      <div className="relative">
        {scenes.map((scene, index) => (
          <section
            key={scene.key}
            id={`scene-${scene.key}`}
            className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-black"
          >
            <SceneArt scene={scene} priority={index === 0} />
            <div className="absolute inset-0 scrim-scene" aria-hidden="true" />
            <div className="shell relative z-10 pb-24 pt-32">
              {index === 0 ? (
                <Opening
                  eyebrow={eyebrow}
                  titleTop={titleTop}
                  titleBottom={titleBottom}
                  intro={intro}
                  primaryCta={primaryCta}
                  secondaryCta={secondaryCta}
                  collectionHref={collectionHref}
                />
              ) : (
                <SceneCopy index={index} name={scene.name} body={scene.body} />
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------------- cinematic
  return (
    <div ref={frameRef} style={{ height: `${scenes.length * 100}svh` }} className="relative">
      <div className="sticky top-0 h-svh overflow-hidden bg-black">
        {scenes.map((scene, index) => (
          <div
            key={scene.key}
            ref={(node) => {
              envRefs.current[index] = node;
            }}
            className="absolute inset-0 will-change-[opacity,transform]"
            style={{ opacity: index === 0 ? 1 : 0, transform: index === 0 ? "scale(1)" : "scale(1.05)" }}
            aria-hidden={index === 0 ? undefined : "true"}
          >
            <SceneArt scene={scene} priority={index === 0} />
          </div>
        ))}

        {/* The constant. It is never re-mounted and never swapped: the same
            element stands in all five environments, which is the whole idea. */}
        <div
          ref={umbrellaRef}
          className="pointer-events-none absolute inset-x-0 mx-auto will-change-transform bottom-[38%] h-[44%] w-[94vw] sm:bottom-[7%] sm:h-[74%] sm:w-[min(64rem,88vw)]"
          style={{ transformOrigin: "50% 34%" }}
          aria-hidden="true"
        >
          <Media
            src={UMBRELLA_PLATE}
            alt=""
            priority
            unoptimized
            transparent
            sizes="(max-width: 1024px) 88vw, 64rem"
            className="absolute inset-0 size-full"
            imgClassName="object-contain"
            objectPosition="center bottom"
          />
        </div>

        <div
          ref={veilRef}
          className="pointer-events-none absolute inset-0 bg-[#efe6d8]"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 scrim-scene" aria-hidden="true" />

        {/* Every scene's copy is in the document at once; only its opacity
            moves. Screen readers and search engines read all five. */}
        <div className="absolute inset-0">
          {scenes.map((scene, index) => (
            <div
              key={scene.key}
              ref={(node) => {
                copyRefs.current[index] = node;
              }}
              className="shell absolute inset-x-0 bottom-0 z-10 pb-28 pt-32 sm:pb-32 lg:pb-36"
              style={{ opacity: index === 0 ? 1 : 0, pointerEvents: index === 0 ? "auto" : "none" }}
            >
              {index === 0 ? (
                <Opening
                  eyebrow={eyebrow}
                  titleTop={titleTop}
                  titleBottom={titleBottom}
                  intro={intro}
                  primaryCta={primaryCta}
                  secondaryCta={secondaryCta}
                  collectionHref={collectionHref}
                />
              ) : (
                <SceneCopy index={index} name={scene.name} body={scene.body} />
              )}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center px-6 lg:inset-y-0 lg:end-10 lg:start-auto lg:items-center lg:justify-end lg:px-0">
          {indicator}
        </div>
      </div>
    </div>
  );
}

function SceneArt({ scene, priority }: { scene: ShowroomScene; priority: boolean }) {
  return (
    <Media
      src={scene.image}
      alt=""
      priority={priority}
      quality={88}
      sizes="100vw"
      className="absolute inset-0 size-full"
      objectPosition={scene.position}
    />
  );
}

function Opening({
  eyebrow,
  titleTop,
  titleBottom,
  intro,
  primaryCta,
  secondaryCta,
  collectionHref,
}: {
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  collectionHref: string;
}) {
  return (
    <div className="max-w-3xl">
      <div
        aria-hidden="true"
        className="mb-8 h-px w-14 origin-[left_center] animate-[saiwan-scale-x_1s_var(--ease-out-expo)_both] bg-white/40 [animation-delay:150ms] rtl:origin-[right_center]"
      />

      <p
        className="eyebrow mb-7 animate-fade text-white/60 [animation-delay:250ms]"
        style={{ animationFillMode: "both" }}
      >
        {eyebrow}
      </p>

      <h1 className="display text-hero text-white text-balance">
        <span className="block animate-rise [animation-delay:350ms]" style={{ animationFillMode: "both" }}>
          {titleTop}
        </span>
        <span
          className="block animate-rise italic text-champagne [animation-delay:520ms]"
          style={{ animationFillMode: "both" }}
        >
          {titleBottom}
        </span>
      </h1>

      <p
        className="mt-8 max-w-sm animate-fade text-lead leading-relaxed text-white/70 [animation-delay:900ms]"
        style={{ animationFillMode: "both" }}
      >
        {intro}
      </p>

      <div
        className="mt-10 flex animate-fade flex-col gap-3 sm:flex-row sm:items-center [animation-delay:1100ms]"
        style={{ animationFillMode: "both" }}
      >
        <Link
          href={collectionHref}
          className="group/cta inline-flex h-14 items-center justify-center gap-3 rounded-xs bg-white px-9 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-black transition-colors duration-500 hover:bg-champagne rtl:normal-case rtl:tracking-normal"
        >
          {primaryCta}
          <ArrowRight
            className="size-4 flip-rtl transition-transform duration-500 group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </Link>

        <WhatsAppButton variant="ghost-light" size="lg" label={secondaryCta} />
      </div>
    </div>
  );
}

function SceneCopy({ index, name, body }: { index: number; name: string; body: string }) {
  return (
    <div className="max-w-xl">
      <p className="mb-5 flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white/60 rtl:text-sm rtl:normal-case rtl:tracking-normal">
        <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden="true" className="h-px w-8 bg-white/30" />
        <span className="text-white">{name}</span>
      </p>
      <p className="display text-title text-white text-balance">{body}</p>
    </div>
  );
}
