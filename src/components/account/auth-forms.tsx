"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/locale-provider";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { signInAction, signUpAction, updateProfileAction, type AuthState } from "@/lib/auth/actions";

const initial: AuthState = {};

/**
 * Sign in / create account, as one switchable panel.
 *
 * Progressive-enhancement friendly: both are plain `<form action={…}>` server
 * actions, so they submit and validate without JavaScript. The locale travels
 * as a hidden field because the action has no access to the route params.
 */
export function AuthPanel({ redirectTo }: { redirectTo?: string }) {
  const { d, locale, href } = useLocale();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [signInState, signIn, signInPending] = useActionState(signInAction, initial);
  const [signUpState, signUp, signUpPending] = useActionState(signUpAction, initial);

  const state = mode === "signin" ? signInState : signUpState;

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="eyebrow mb-6">{d.nav.account}</p>
      <h1 className="display text-title">
        {mode === "signin" ? d.auth.signInTitle : d.auth.signUpTitle}
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        {mode === "signin" ? d.auth.signInBody : d.auth.signUpBody}
      </p>

      {state.error ? (
        <p role="alert" className="mt-6 border border-terracotta/40 bg-terracotta/5 p-3.5 text-sm text-terracotta">
          {state.error}
        </p>
      ) : null}

      {mode === "signin" ? (
        <form action={signIn} className="mt-9 flex flex-col gap-6">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="redirect" value={redirectTo ?? ""} />
          <Input
            label={d.form.email}
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            required
            error={signInState.fieldErrors?.email}
          />
          <Input
            label={d.form.password}
            name="password"
            type="password"
            autoComplete="current-password"
            dir="ltr"
            required
            error={signInState.fieldErrors?.password}
          />
          <Button type="submit" size="lg" fullWidth loading={signInPending}>
            {d.auth.signIn}
          </Button>
        </form>
      ) : (
        <form action={signUp} className="mt-9 flex flex-col gap-6">
          <input type="hidden" name="locale" value={locale} />
          <Input label={d.form.name} name="name" autoComplete="name" required error={signUpState.fieldErrors?.name} />
          <Input
            label={d.form.email}
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            required
            error={signUpState.fieldErrors?.email}
          />
          <Input
            label={`${d.form.phone} (${d.common.optional})`}
            name="phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
          />
          <Input
            label={d.form.password}
            name="password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            required
            hint={d.form.errors.passwordWeak}
            error={signUpState.fieldErrors?.password}
          />
          <Button type="submit" size="lg" fullWidth loading={signUpPending}>
            {d.auth.signUp}
          </Button>
        </form>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 text-sm">
        <p className="text-muted">
          {mode === "signin" ? d.auth.noAccount : d.auth.hasAccount}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="link-underline text-fg transition-colors hover:text-accent"
          >
            {mode === "signin" ? d.auth.signUp : d.auth.signIn}
          </button>
        </p>
        <p className="text-xs text-subtle">{d.auth.guestNote}</p>
        <Link href={href("/collection")} className="link-underline mt-1 self-start text-xs text-muted hover:text-fg">
          {d.auth.continueAsGuest}
        </Link>
      </div>
    </div>
  );
}

export function ProfileForm({ name, phone }: { name: string; phone: string | null }) {
  const { d, locale } = useLocale();
  const [state, action, pending] = useActionState(updateProfileAction, initial);

  return (
    <form action={action} className="flex max-w-md flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />
      <Input label={d.form.name} name="name" defaultValue={name} required error={state.fieldErrors?.name} />
      <Input label={d.form.phone} name="phone" type="tel" dir="ltr" defaultValue={phone ?? ""} />

      <div className="flex items-center gap-4">
        <Button type="submit" loading={pending}>
          {d.account.updateProfile}
        </Button>
        {state.ok ? (
          <span role="status" className="text-sm text-accent">
            {d.account.profileUpdated}
          </span>
        ) : null}
      </div>
    </form>
  );
}
