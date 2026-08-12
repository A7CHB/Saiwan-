"use client";

import { useActionState } from "react";
import { adminSignInAction, type AdminAuthState } from "@/lib/admin/auth-actions";

const initial: AdminAuthState = {};

export function AdminLoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(adminSignInAction, initial);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />

      {state.error ? (
        <p role="alert" className="rounded border border-terracotta/40 bg-terracotta/8 px-3 py-2.5 text-sm text-terracotta">
          {state.error}
        </p>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className="w-full rounded-md border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-accent text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
