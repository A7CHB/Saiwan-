"use client";

import { useFormStatus } from "react-dom";
import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Admin form controls.
 *
 * Separate from the storefront's `ui/field` on purpose: the shop's fields are
 * bottom-rule-only and airy, which is right for three questions and wrong for a
 * forty-field product editor. These are dense, boxed and scannable.
 */

const base =
  "w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors " +
  "placeholder:text-subtle/70 focus:border-accent focus:ring-2 focus:ring-accent/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export function AdminField({
  label,
  hint,
  htmlFor,
  children,
  className,
  required,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium break-words text-muted">
        {label}
        {required ? <span className="ms-0.5 text-terracotta">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs break-words text-subtle">{hint}</p> : null}
    </div>
  );
}

export function AdminInput({
  label,
  hint,
  className,
  containerClassName,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; containerClassName?: string }) {
  const id = useId();
  return (
    <AdminField
      label={label}
      hint={hint}
      htmlFor={id}
      required={props.required}
      className={containerClassName}
    >
      <input id={id} className={cn(base, className)} {...props} />
    </AdminField>
  );
}

export function AdminTextarea({
  label,
  hint,
  className,
  containerClassName,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  containerClassName?: string;
}) {
  const id = useId();
  return (
    <AdminField
      label={label}
      hint={hint}
      htmlFor={id}
      required={props.required}
      className={containerClassName}
    >
      <textarea id={id} rows={rows} className={cn(base, "resize-y leading-relaxed", className)} {...props} />
    </AdminField>
  );
}

export function AdminSelect({
  label,
  hint,
  className,
  containerClassName,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  containerClassName?: string;
}) {
  const id = useId();
  return (
    <AdminField
      label={label}
      hint={hint}
      htmlFor={id}
      required={props.required}
      className={containerClassName}
    >
      <select id={id} className={cn(base, "cursor-pointer", className)} {...props}>
        {children}
      </select>
    </AdminField>
  );
}

export function AdminCheckbox({
  label,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = useId();
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-line-strong accent-[rgb(var(--c-accent))]"
        {...props}
      />
      <label htmlFor={id} className="min-w-0 cursor-pointer text-sm leading-tight break-words">
        {label}
        {hint ? <span className="mt-0.5 block text-xs text-subtle">{hint}</span> : null}
      </label>
    </div>
  );
}

/** Multi-select as a checkbox group — far easier to scan than a multiple select. */
export function AdminCheckboxGroup({
  label,
  name,
  options,
  selected,
  hint,
  columns = 2,
}: {
  label: string;
  name: string;
  options: { value: string; label: string; swatch?: string }[];
  selected: string[];
  hint?: string;
  columns?: number;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium text-muted">{label}</legend>
      {hint ? <p className="mb-2 text-xs text-subtle">{hint}</p> : null}
      {options.length === 0 ? (
        <p className="text-xs text-subtle">Nothing to choose from yet.</p>
      ) : (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-md border border-line px-3 py-2 text-sm transition-colors hover:border-line-strong has-[:checked]:border-accent has-[:checked]:bg-accent/6"
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                defaultChecked={selected.includes(option.value)}
                className="size-4 shrink-0 cursor-pointer rounded border-line-strong accent-[rgb(var(--c-accent))]"
              />
              {option.swatch ? (
                <span
                  className="size-4 shrink-0 rounded-full border border-line"
                  style={{ backgroundColor: option.swatch }}
                  aria-hidden="true"
                />
              ) : null}
              <span className="truncate">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

/** Disables itself while the surrounding form action is in flight. */
export function SubmitButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const { pending } = useFormStatus();

  const variants = {
    primary: "bg-accent text-accent-fg hover:bg-accent-hover",
    secondary: "border border-line text-fg hover:border-line-strong",
    danger: "bg-terracotta text-white hover:opacity-90",
  } as const;

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: { error?: string; ok?: boolean; message?: string } }) {
  if (!state.error && !state.ok) return null;
  return (
    <p
      role={state.error ? "alert" : "status"}
      className={cn(
        "rounded-md px-3 py-2.5 text-sm",
        state.error
          ? "border border-terracotta/40 bg-terracotta/8 text-terracotta"
          : "border border-olive/40 bg-olive/8 text-olive",
      )}
    >
      {state.error ?? state.message ?? "Saved."}
    </p>
  );
}

/**
 * Destructive submit with a confirmation step. `confirm()` is deliberate here:
 * it is unbypassable, needs no state, and an admin deleting a product is
 * exactly the moment to interrupt rather than to be elegant.
 */
export function DangerSubmit({ children, message }: { children: React.ReactNode; message: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className="inline-flex h-9 items-center justify-center rounded-md border border-terracotta/50 px-4 text-sm font-medium text-terracotta transition-colors hover:bg-terracotta/8 disabled:opacity-60"
    >
      {pending ? "Working…" : children}
    </button>
  );
}
