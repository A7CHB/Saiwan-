import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, EmptyState, PageHeader, Panel, Table, Td, Th } from "@/components/admin/ui";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/lib/constants";
import { formatDate, formatRelative } from "@/lib/i18n/format";
import { parseJson, normalisePhone } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Inquiries" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  NEW: "accent",
  CONTACTED: "warning",
  QUOTED: "warning",
  CONFIRMED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export default async function AdminInquiriesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole("STAFF");

  const query = await searchParams;
  const statusParam = Array.isArray(query.status) ? query.status[0] : query.status;
  const status = statusParam && INQUIRY_STATUSES.includes(statusParam as never) ? statusParam : undefined;

  const [inquiries, counts] = await Promise.all([
    prisma.inquiry.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        reference: true,
        customerName: true,
        customerPhone: true,
        locale: true,
        source: true,
        status: true,
        createdAt: true,
        configuration: true,
        product: { select: { slug: true, translations: { where: { locale: "en" }, select: { name: true } } } },
      },
    }),
    prisma.inquiry.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const countFor = (value?: string) =>
    value
      ? (counts.find((row) => row.status === value)?._count.status ?? 0)
      : counts.reduce((sum, row) => sum + row._count.status, 0);

  return (
    <AdminFrame>
      <PageHeader
        title="Inquiries"
        description="Every WhatsApp configuration and contact-form message, in one pipeline."
      />

      <nav className="mb-4 flex flex-wrap gap-1.5" aria-label="Filter by status">
        {[undefined, ...INQUIRY_STATUSES].map((option) => (
          <Link
            key={option ?? "all"}
            href={option ? `/admin/inquiries?status=${option}` : "/admin/inquiries"}
            aria-current={status === option ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              status === option
                ? "border-accent bg-accent/10 text-accent"
                : "border-line text-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {option ? option.toLowerCase() : "all"}
            <span className="tabular-nums opacity-60">{countFor(option)}</span>
          </Link>
        ))}
      </nav>

      <Panel bodyClassName="p-0">
        {inquiries.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No inquiries here"
              description="Inquiries are recorded the moment a customer opens WhatsApp from a product page, or sends the contact form."
            />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Customer</Th>
                <Th>Piece</Th>
                <Th>Configuration</Th>
                <Th>Source</Th>
                <Th>Status</Th>
                <Th align="end">Received</Th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => {
                const config = parseJson<{
                  productName?: string;
                  sizeLabel?: string;
                  colorName?: string;
                  quantity?: number;
                }>(inquiry.configuration, {});
                const phone = normalisePhone(inquiry.customerPhone);
                const summary = [
                  config.sizeLabel,
                  config.colorName,
                  config.quantity && config.quantity > 1 ? `×${config.quantity}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <tr key={inquiry.id} className="transition-colors hover:bg-sunken/60">
                    <Td className="font-medium tabular-nums">
                      <Link href={`/admin/inquiries/${inquiry.id}`} className="hover:text-accent">
                        {inquiry.reference}
                      </Link>
                    </Td>
                    <Td>
                      <span className="block">{inquiry.customerName}</span>
                      {phone ? (
                        <a
                          href={`https://wa.me/${phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                          className="text-xs text-subtle transition-colors hover:text-accent"
                        >
                          {inquiry.customerPhone}
                        </a>
                      ) : (
                        <span className="text-xs text-subtle">no number — replied on WhatsApp</span>
                      )}
                    </Td>
                    <Td className="text-muted">
                      {inquiry.product?.translations[0]?.name ?? config.productName ?? "—"}
                    </Td>
                    <Td className="text-muted">{summary || "—"}</Td>
                    <Td>
                      <Badge>{inquiry.source.toLowerCase()}</Badge>
                      <span className="ms-1.5 text-xs uppercase text-subtle">{inquiry.locale}</span>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_TONE[inquiry.status] ?? "neutral"}>
                        {(inquiry.status as InquiryStatus).toLowerCase()}
                      </Badge>
                    </Td>
                    <Td align="end" className="whitespace-nowrap text-muted">
                      <span title={formatDate(inquiry.createdAt, "en", { dateStyle: "medium" })}>
                        {formatRelative(inquiry.createdAt, "en")}
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>
    </AdminFrame>
  );
}
