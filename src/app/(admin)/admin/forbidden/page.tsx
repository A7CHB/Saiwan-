import Link from "next/link";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { adminSignOutAction } from "@/lib/admin/auth-actions";

export const metadata: Metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-sunken px-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-elevated p-8 text-center">
        <span
          aria-hidden="true"
          className="mx-auto mb-5 flex size-11 items-center justify-center rounded-full bg-terracotta/12 text-terracotta"
        >
          <ShieldAlert className="size-5" strokeWidth={1.6} />
        </span>
        <h1 className="text-lg font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-muted">
          Your account does not have permission to view this area. If you believe this is a mistake,
          ask an administrator to review your role.
        </p>

        <div className="mt-7 flex flex-col gap-2">
          <form action={adminSignOutAction}>
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-accent text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
            >
              Sign in as another user
            </button>
          </form>
          <Link
            href="/en"
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-line text-sm transition-colors hover:border-line-strong"
          >
            Return to the site
          </Link>
        </div>
      </div>
    </div>
  );
}
