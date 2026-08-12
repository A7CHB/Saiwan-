"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Form controls share one skin: no rounded pills, a single hairline that
 * thickens on focus, and the label always rendered (never a placeholder
 * masquerading as one, which fails both accessibility and usability).
 */
const control =
  "w-full bg-transparent border-b border-line px-0 py-3 text-fg text-[0.9375rem] " +
  "placeholder:text-subtle/70 transition-colors duration-300 " +
  "focus:border-accent focus:outline-none focus-visible:outline-none " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="eyebrow text-[0.625rem] rtl:text-xs">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-terracotta" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, containerClassName, id, required, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  const describedBy = error || hint ? `${inputId}-desc` : undefined;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      className={containerClassName}
    >
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(control, error && "border-terracotta", className)}
        {...props}
      />
    </Field>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, containerClassName, id, required, rows = 4, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      className={containerClassName}
    >
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(control, "resize-y leading-relaxed", error && "border-terracotta", className)}
        {...props}
      />
    </Field>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, containerClassName, id, required, children, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      className={containerClassName}
    >
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn(
            control,
            "appearance-none cursor-pointer pe-8 [&>option]:bg-elevated [&>option]:text-fg",
            error && "border-terracotta",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute inset-y-0 end-0 my-auto size-3 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <path d="M1 1.5 6 6.5 11 1.5" />
        </svg>
      </div>
    </Field>
  );
});

/** Inline checkbox with a square, hand-drawn-feeling tick. */
export function Checkbox({
  label,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label
      htmlFor={inputId}
      className={cn("group flex cursor-pointer items-start gap-3 text-sm text-fg/85", className)}
    >
      {/* The real input sits transparent on top of this box, so the box shows
          both the checked state and the keyboard focus ring. */}
      <span className="relative mt-0.5 flex size-[18px] shrink-0 items-center justify-center border border-line-strong transition-colors group-hover:border-accent has-[:checked]:border-accent has-[:checked]:bg-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
        <input
          id={inputId}
          type="checkbox"
          className="peer absolute inset-0 cursor-pointer opacity-0"
          {...props}
        />
        <svg
          viewBox="0 0 14 14"
          aria-hidden="true"
          className="size-3 text-accent-fg opacity-0 transition-opacity peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 7.5 5.5 11 12 3.5" />
        </svg>
      </span>
      <span className="leading-snug">{label}</span>
    </label>
  );
}
