import { cn } from "@/lib/utils";

/**
 * The Saiwan mark: a canopy in elevation — eight ribs, a scalloped valance and
 * a mast. Drawn on a 32px grid with a 1.25 stroke so it stays legible at favicon
 * size and stays elegant blown up to 200px as a section watermark.
 */
export function CanopyMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-8", className)}
      {...props}
    >
      {/* canopy + valance */}
      <path d="M2 18.6C2 10.5 8.3 3.9 16 3.9s14 6.6 14 14.7c-4.7 3-8.7 3-14-.3-5.3 3.3-9.3 3.3-14 .3Z" />
      {/* ribs */}
      <path d="M16 3.9v14.4M16 3.9 6.1 16.4M16 3.9l9.9 12.5" opacity="0.55" />
      {/* mast + base */}
      <path d="M16 18.3v9.8M12.3 28.1h7.4" />
    </svg>
  );
}

/** Solid fill variant — used where a stroke would disappear (small favicons). */
export function CanopyGlyph({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={cn("size-8", className)} {...props}>
      <path d="M2 18.6C2 10.5 8.3 3.9 16 3.9s14 6.6 14 14.7c-4.7 3-8.7 3-14-.3-5.3 3.3-9.3 3.3-14 .3Z" />
      <rect x="15.1" y="18" width="1.8" height="10.2" rx="0.9" />
      <rect x="12" y="27" width="8" height="1.6" rx="0.8" />
    </svg>
  );
}

/**
 * Large decorative canopy used as a section watermark — radial ribs seen from
 * directly below. Purely ornamental, so it is always aria-hidden.
 */
export function CanopyRadial({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  const ribs = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={cn("size-64", className)} {...props}>
      <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      {ribs.map((angle) => (
        <line
          key={angle}
          x1="100"
          y1="100"
          x2="100"
          y2="6"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="3.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
