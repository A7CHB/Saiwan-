import { LogOut } from "lucide-react";
import { adminSignOutAction } from "@/lib/admin/auth-actions";

/** A form post, not a link — signing out must never be a GET. */
export function AdminSignOut() {
  return (
    <form action={adminSignOutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-sunken hover:text-fg"
      >
        <LogOut className="size-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
        Sign out
      </button>
    </form>
  );
}
