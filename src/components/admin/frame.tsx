import { requireRole } from "@/lib/auth/session";
import type { Role } from "@/lib/constants";
import { AdminShell } from "@/components/admin/shell";
import { AdminSignOut } from "@/components/admin/sign-out";

/**
 * Wraps an admin page in the dashboard chrome, re-checking authorisation on the
 * server as it does so.
 *
 * Pages call `requireRole()` for their own data access as well. That is not
 * redundant: this component guards what is *rendered*, while the page's own
 * call guards what is *queried*, and only the second one protects a page whose
 * data is fetched before its markup.
 */
export async function AdminFrame({
  children,
  role = "STAFF",
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  const user = await requireRole(role);

  return (
    <AdminShell user={{ name: user.name, email: user.email, role: user.role }} signOut={<AdminSignOut />}>
      {children}
    </AdminShell>
  );
}
