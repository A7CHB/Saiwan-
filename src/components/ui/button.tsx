"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "whatsapp" | "quiet" | "link";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * One button, six voices. Corners are near-square by design: rounded pills read
 * as consumer software, while a 2px radius reads as architecture and hardware.
 * Every variant shares the same wide-tracked micro-caps label so the whole site
 * speaks with one accent.
 */
const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xs " +
  "font-sans font-medium uppercase tracking-[0.14em] rtl:tracking-normal rtl:normal-case " +
  "transition-[color,background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "disabled:pointer-events-none disabled:opacity-45 select-none";

const variants: Record<ButtonVariant, string> = {
  // Solid ink; the accent sweeps in from the leading edge on hover.
  primary:
    "overflow-hidden bg-fg text-bg border border-fg hover:text-accent-fg " +
    "before:absolute before:inset-0 before:bg-accent before:origin-[left_center] rtl:before:origin-[right_center] " +
    "before:scale-x-0 before:transition-transform before:duration-[600ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] " +
    "hover:before:scale-x-100 focus-visible:before:scale-x-100",
  outline:
    "overflow-hidden border border-line-strong text-fg bg-transparent hover:text-bg hover:border-fg " +
    "before:absolute before:inset-0 before:bg-fg before:origin-[left_center] rtl:before:origin-[right_center] " +
    "before:scale-x-0 before:transition-transform before:duration-[600ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] " +
    "hover:before:scale-x-100 focus-visible:before:scale-x-100",
  ghost: "text-fg/85 hover:text-accent bg-transparent border border-transparent",
  whatsapp:
    "overflow-hidden bg-[#25D366] text-[#04150b] border border-[#25D366] hover:bg-[#1fbe59] hover:border-[#1fbe59]",
  quiet: "bg-sunken text-fg border border-line hover:border-line-strong hover:bg-elevated",
  link: "text-fg hover:text-accent px-0 tracking-[0.08em]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-12 px-7 text-[0.75rem]",
  lg: "h-14 px-9 text-[0.8125rem]",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Rendered ahead of the label — sits on the leading side in both directions. */
  icon?: ReactNode;
  iconEnd?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
};

function content({ icon, iconEnd, children, loading }: CommonProps) {
  return (
    <>
      {loading ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="size-4 animate-[saiwan-spin_0.7s_linear_infinite] rounded-full border border-current border-t-transparent" />
        </span>
      ) : null}
      <span
        className={cn(
          "relative z-10 inline-flex items-center gap-2.5",
          loading && "opacity-0",
        )}
      >
        {icon}
        {children}
        {iconEnd}
      </span>
    </>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(
  { variant = "primary", size = "md", className, children, icon, iconEnd, loading, fullWidth, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      aria-busy={loading || undefined}
      disabled={props.disabled || loading}
      {...props}
    >
      {content({ icon, iconEnd, children, loading, variant, size })}
    </button>
  );
});

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  iconEnd,
  fullWidth,
  external,
  ...rest
}: CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
  const inner = content({ icon, iconEnd, children, variant, size });

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {inner}
    </Link>
  );
}
