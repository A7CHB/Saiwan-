import { cn } from "@/lib/utils";
import { MARK_ART, TAGLINE_ART, WORDMARK_ART, type LogoArt } from "./logo-art";

/**
 * The Saiwan identity, as delivered.
 *
 * These are the designer's outlines — traced from `brand/saiwan-logo.pdf` by
 * `npm run brand` — not an approximation set in a web font. That matters for
 * this particular mark, because the umbrella standing in for the "I" is drawn
 * artwork that no typeface can supply, and because the letterforms have a
 * modulation the site's display serif does not share.
 *
 * The artwork is rendered inline and filled with `currentColor`. That is the
 * whole reason there is no light and dark pair of files here: the master has a
 * dark page and a cream page, but they are the same outlines with the colours
 * swapped, so a single set that inherits the text colour is correct in both
 * themes for free, and can never fall out of step with one of them.
 */
function Art({
  art,
  title,
  className,
  ...props
}: { art: LogoArt; title?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={art.viewBox}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={className}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <g transform={art.transform}>
        {art.paths.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The umbrella alone. Used where the full wordmark would be illegible or
 * simply too wide — the favicon, the admin rail, a loading state.
 */
export function SaiwanMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return <Art art={MARK_ART} className={cn("h-8 w-auto", className)} {...props} />;
}

/**
 * SAIWAN, umbrella included. The site's primary signature.
 *
 * Sized by height so it sets like type: the caller asks for a cap height and
 * the width follows the artwork, which is what keeps it in proportion with the
 * navigation next to it at every breakpoint.
 */
export function SaiwanWordmark({
  className,
  title,
  ...props
}: { title?: string } & React.SVGProps<SVGSVGElement>) {
  return <Art art={WORDMARK_ART} title={title} className={cn("h-7 w-auto", className)} {...props} />;
}

/**
 * The full lockup: wordmark over the OUTDOOR UMBRELLA line.
 *
 * The tagline is a separate piece of artwork rather than live text, so it keeps
 * its drawn letter-spacing. It is decorative here — the wordmark already
 * carries the accessible name — which is why it is never given its own label.
 */
export function SaiwanLockup({
  className,
  title,
  showTagline = true,
}: {
  className?: string;
  title?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col items-center gap-[0.45em]", className)}>
      <SaiwanWordmark title={title} className="h-[1em] w-auto" />
      {showTagline ? <Art art={TAGLINE_ART} className="h-[0.145em] w-auto opacity-80" /> : null}
    </span>
  );
}
