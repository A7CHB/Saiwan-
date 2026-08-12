import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The admin's shared vocabulary: page headers, panels, tables, badges and
 * hand-drawn SVG charts.
 *
 * The charts are deliberately not a library. Three chart types at this size are
 * roughly a hundred lines of SVG, against ~100 kB for a charting dependency
 * that would still need restyling to match the palette.
 */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-lg border border-line bg-elevated", className)}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  /** Percentage change against the previous period. */
  delta?: number | null;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium tabular-nums",
              delta > 0 ? "text-olive" : delta < 0 ? "text-terracotta" : "text-subtle",
            )}
          >
            {delta > 0 ? "↑" : delta < 0 ? "↓" : "—"} {Math.abs(delta)}%
          </span>
        ) : null}
        {hint ? <span className="text-subtle">{hint}</span> : null}
      </div>
    </>
  );

  const className =
    "block rounded-lg border border-line bg-elevated p-5 transition-colors" +
    (href ? " hover:border-line-strong" : "");

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-sunken text-muted",
    accent: "bg-accent/12 text-accent",
    success: "bg-olive/12 text-olive",
    warning: "bg-champagne/15 text-champagne",
    danger: "bg-terracotta/12 text-terracotta",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded px-2 py-0.5 text-[0.6875rem] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-14 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/** Table primitives — plain elements with the admin's spacing baked in. */
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)}>{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
  align = "start",
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap border-b border-line px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-subtle",
        align === "end" ? "text-end" : align === "center" ? "text-center" : "text-start",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  align = "start",
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}) {
  return (
    <td
      className={cn(
        "border-b border-line px-4 py-3 align-middle",
        align === "end" ? "text-end" : align === "center" ? "text-center" : "text-start",
        className,
      )}
    >
      {children}
    </td>
  );
}

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------

export type SeriesPoint = { label: string; value: number };

/**
 * Area chart with a baseline. Renders as an accessible table for screen
 * readers rather than as an unreadable path.
 */
export function AreaChart({ data, height = 160, label }: { data: SeriesPoint[]; height?: number; label: string }) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-subtle">No data yet</p>;
  }

  const width = 800;
  const max = Math.max(...data.map((point) => point.value), 1);
  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  const points = data.map((point, index) => ({
    x: index * stepX,
    y: height - (point.value / max) * (height - 12) - 6,
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id="admin-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--c-accent))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(var(--c-accent))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#admin-area)" />
        <path
          d={line}
          fill="none"
          stroke="rgb(var(--c-accent))"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mt-2 flex justify-between text-[0.625rem] text-subtle">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>

      {/* The same numbers, available to assistive technology. */}
      <figcaption className="sr-only">
        <table>
          <caption>{label}</caption>
          <tbody>
            {data.map((point) => (
              <tr key={point.label}>
                <th scope="row">{point.label}</th>
                <td>{point.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}

/** Horizontal ranked bars — used for "most viewed" style lists. */
export function BarList({
  data,
  valueLabel,
  emptyLabel = "No data yet",
}: {
  data: (SeriesPoint & { href?: string })[];
  valueLabel?: string;
  emptyLabel?: string;
}) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-subtle">{emptyLabel}</p>;
  }

  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <ul className="flex flex-col gap-2.5">
      {data.map((point) => (
        <li key={point.label} className="relative">
          <div className="flex items-center justify-between gap-4 py-1.5">
            <span className="min-w-0 flex-1 truncate text-sm">
              {point.href ? (
                <Link href={point.href} className="transition-colors hover:text-accent">
                  {point.label}
                </Link>
              ) : (
                point.label
              )}
            </span>
            <span className="shrink-0 text-sm text-muted tabular-nums">
              {point.value}
              {valueLabel ? <span className="ms-1 text-xs text-subtle">{valueLabel}</span> : null}
            </span>
          </div>
          <div
            aria-hidden="true"
            className="h-1 rounded-full bg-accent/18"
            style={{ width: `${Math.max(2, (point.value / max) * 100)}%` }}
          />
        </li>
      ))}
    </ul>
  );
}
