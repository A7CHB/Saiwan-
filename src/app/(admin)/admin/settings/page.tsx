import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { PageHeader, Panel, Table, Td, Th } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/entity-forms";
import { formatDate } from "@/lib/i18n/format";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  // Settings are business-wide — administrator only.
  await requireRole("ADMIN");

  const [rows, audits] = await Promise.all([
    prisma.setting.findMany(),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    }),
  ]);

  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return (
    <AdminFrame role="ADMIN">
      <PageHeader title="Settings" description="Business details used across the site." />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr] xl:items-start">
        <Panel title="Contact">
          <SettingsForm settings={settings} />
        </Panel>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Environment" description="Set in .env — shown here for reference, not editable.">
            <dl className="flex flex-col divide-y divide-line text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                <dt className="text-muted">WhatsApp number (runtime)</dt>
                <dd dir="ltr" className="min-w-0 break-all font-mono text-xs">
                  {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || <span className="text-terracotta">not set</span>}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                <dt className="text-muted">Site URL</dt>
                <dd dir="ltr" className="min-w-0 break-all font-mono text-xs">
                  {process.env.NEXT_PUBLIC_SITE_URL || <span className="text-terracotta">not set</span>}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                <dt className="text-muted">Auth secret</dt>
                <dd className="min-w-0 break-all font-mono text-xs">
                  {(process.env.AUTH_SECRET ?? "").length >= 32 ? (
                    "configured"
                  ) : (
                    <span className="text-terracotta">too short — set a 32+ character value</span>
                  )}
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Recent activity" description="Who changed what." bodyClassName="p-0">
            <Table>
              <thead>
                <tr>
                  <Th>Action</Th>
                  <Th>By</Th>
                  <Th align="end">When</Th>
                </tr>
              </thead>
              <tbody>
                {audits.length === 0 ? (
                  <tr>
                    <Td className="text-subtle">No changes recorded yet.</Td>
                    <Td />
                    <Td />
                  </tr>
                ) : (
                  audits.map((entry) => (
                    <tr key={entry.id}>
                      <Td>
                        <span className="font-mono text-xs">{entry.action}</span>
                        {entry.entityId ? (
                          <span className="ms-1.5 text-xs text-subtle">{entry.entityId.slice(0, 12)}</span>
                        ) : null}
                      </Td>
                      <Td className="text-muted">{entry.user?.name ?? "—"}</Td>
                      <Td align="end" className="whitespace-nowrap text-muted">
                        {formatDate(entry.createdAt, "en", { dateStyle: "short", timeStyle: "short" })}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Panel>
        </div>
      </div>
    </AdminFrame>
  );
}
