import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, EmptyState, PageHeader, Panel, Table, Td, Th } from "@/components/admin/ui";
import { UserForm } from "@/components/admin/entity-forms";
import { formatDate } from "@/lib/i18n/format";

export const metadata: Metadata = { title: "Team" };
export const dynamic = "force-dynamic";

/**
 * The accounts that can reach this dashboard.
 *
 * These are the only accounts the system has: the storefront is anonymous, so
 * a customer is a name on an inquiry rather than a login. Creating and editing
 * accounts is administrator-only, enforced inside `saveUserAction` as well as
 * here.
 */
export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const viewer = await requireRole("STAFF");
  const query = await searchParams;
  const search = ((Array.isArray(query.q) ? query.q[0] : query.q) ?? "").trim();
  const editId = Array.isArray(query.edit) ? query.edit[0] : query.edit;
  const isAdmin = viewer.role === "ADMIN";

  const users = await prisma.user.findMany({
    where: search
      ? { OR: [{ name: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }] }
      : {},
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      locale: true,
      isActive: true,
      lastLoginAt: true,
    },
  });

  const editing = isAdmin && editId ? users.find((user) => user.id === editId) : undefined;

  return (
    <AdminFrame>
      <PageHeader
        title="Team & access"
        description="Everyone who can sign in to this dashboard. Customers never have accounts — they appear under Inquiries."
      />

      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-line bg-elevated p-4">
        <label className="flex flex-1 flex-col gap-1.5 sm:max-w-xs">
          <span className="text-xs font-medium text-muted">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Name, email or phone"
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <button type="submit" className="h-9 rounded-md border border-line px-4 text-sm transition-colors hover:border-line-strong">
          Search
        </button>
      </form>

      <Panel bodyClassName="p-0" className="mb-4">
        {users.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No accounts found" description="Nobody matches that search." />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th>Role</Th>
                <Th align="end">Last signed in</Th>
                {isAdmin ? <Th align="end">Actions</Th> : null}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-sunken/60">
                  <Td>
                    <span className="font-medium">{user.name}</span>
                    {!user.isActive ? <Badge tone="danger">disabled</Badge> : null}
                    <span className="mt-0.5 block text-xs uppercase text-subtle">{user.locale}</span>
                  </Td>
                  <Td className="text-muted">
                    <span dir="ltr" className="block text-sm">
                      {user.email}
                    </span>
                    {user.phone ? (
                      <span dir="ltr" className="block text-xs text-subtle">
                        {user.phone}
                      </span>
                    ) : null}
                  </Td>
                  <Td>
                    <Badge tone={user.role === "ADMIN" ? "accent" : user.role === "STAFF" ? "warning" : "neutral"}>
                      {user.role.toLowerCase()}
                    </Badge>
                  </Td>
                  <Td align="end" className="whitespace-nowrap text-muted">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt, "en") : "—"}
                  </Td>
                  {isAdmin ? (
                    <Td align="end">
                      <Link
                        href={`/admin/team?edit=${user.id}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
                        className="rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-line-strong"
                      >
                        Edit
                      </Link>
                    </Td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>

      {isAdmin ? (
        <Panel
          title={editing ? `Edit ${editing.name}` : "Create an account"}
          description={
            editing
              ? "Changing the password or disabling the account signs it out of every device immediately."
              : "Add a colleague to the dashboard. Staff can manage the catalogue; administrators can also manage accounts and settings."
          }
          actions={
            editing ? (
              <Link href="/admin/team" className="text-sm text-accent hover:underline">
                Cancel edit
              </Link>
            ) : null
          }
        >
          <UserForm
            key={editing?.id ?? "new"}
            user={
              editing
                ? {
                    id: editing.id,
                    name: editing.name,
                    email: editing.email,
                    phone: editing.phone ?? "",
                    role: editing.role,
                    isActive: editing.isActive,
                  }
                : undefined
            }
          />
        </Panel>
      ) : (
        <Panel title="Account management">
          <p className="text-sm text-muted">Only administrators can create or edit accounts.</p>
        </Panel>
      )}
    </AdminFrame>
  );
}
