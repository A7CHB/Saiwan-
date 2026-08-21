import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/constants";
import { SaiwanMark } from "@/components/icons/logo";
import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [user, query] = await Promise.all([getSessionUser(), searchParams]);

  // Already signed in with sufficient rights — skip the form.
  if (user && hasRole(user.role, "STAFF")) redirect("/admin");

  const next = Array.isArray(query.next) ? query.next[0] : query.next;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-sunken px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <SaiwanMark className="h-6 w-auto text-accent" />
          <span className="text-base font-semibold tracking-tight">Saiwan</span>
          <span className="ms-auto rounded bg-elevated px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-subtle">
            Admin
          </span>
        </div>

        <div className="rounded-lg border border-line bg-elevated p-7">
          <h1 className="text-lg font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-sm text-muted">Staff and administrator access only.</p>
          <AdminLoginForm next={typeof next === "string" ? next : undefined} />
        </div>

        <p className="mt-6 text-center text-xs text-subtle">
          Looking for the storefront? It is at <span className="text-muted">saiwan.com</span> and needs no
          account.
        </p>
      </div>
    </div>
  );
}
