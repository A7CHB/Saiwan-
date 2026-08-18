import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { AreaChart, BarList, EmptyState, PageHeader, Panel, StatCard, Table, Td, Th, Badge } from "@/components/admin/ui";
import {
  getInquiryFunnel,
  getLocaleSplit,
  getOverview,
  getTopCategories,
  getTopProducts,
  getTopSearches,
} from "@/lib/data/analytics";
import { formatRelative } from "@/lib/i18n/format";
import { parseJson } from "@/lib/utils";
import type { InquiryStatus } from "@/lib/constants";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  NEW: "accent",
  CONTACTED: "warning",
  QUOTED: "warning",
  CONFIRMED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export default async function AdminDashboard() {
  // Authorisation for the data on this page, independent of the frame.
  await requireRole("STAFF");

  const [overview, topProducts, topCategories, searches, localeSplit, funnel, recent, counts] =
    await Promise.all([
      getOverview(30),
      getTopProducts("en", 30, 6),
      getTopCategories("en", 30),
      getTopSearches(30, 6),
      getLocaleSplit(30),
      getInquiryFunnel(),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          reference: true,
          customerName: true,
          status: true,
          createdAt: true,
          configuration: true,
          product: { select: { slug: true } },
        },
      }),
      Promise.all([
        prisma.product.count({ where: { status: "PUBLISHED" } }),
        prisma.product.count({ where: { status: "DRAFT" } }),
        prisma.inquiry.count(),
        prisma.inquiry.count({ where: { status: "NEW" } }),
      ]),
    ]);

  const [published, drafts, totalInquiries, newInquiries] = counts;

  return (
    <AdminFrame>
      <PageHeader
        title="Dashboard"
        description="Last 30 days. All figures come from first-party events recorded on the site."
        actions={
          <Link
            href="/admin/analytics"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3.5 text-sm transition-colors hover:border-line-strong"
          >
            Full analytics
            <ArrowUpRight className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitors" value={overview.visitors.value} delta={overview.visitors.delta} hint="unique" />
        <StatCard label="Product views" value={overview.productViews.value} delta={overview.productViews.delta} />
        <StatCard
          label="WhatsApp clicks"
          value={overview.whatsappClicks.value}
          delta={overview.whatsappClicks.delta}
        />
        <StatCard
          label="Inquiries"
          value={overview.inquiries.value}
          delta={overview.inquiries.delta}
          href="/admin/inquiries"
        />
      </div>

      {/* `items-start` stops the chart panel from being stretched to the height
          of the stat column beside it. */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3 lg:items-start">
        <Panel title="Traffic" description="Product and page views per day" className="lg:col-span-2">
          <AreaChart data={overview.series} label="Views per day over the last 30 days" />
        </Panel>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard
            label="Conversion"
            value={`${overview.conversionRate}%`}
            hint="WhatsApp clicks per product view"
          />
          <StatCard label="New inquiries" value={newInquiries} href="/admin/inquiries?status=NEW" />
          <StatCard label="Published pieces" value={published} hint={`${drafts} draft`} href="/admin/products" />
          <StatCard label="All inquiries" value={totalInquiries} hint="since launch" href="/admin/inquiries" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Most viewed pieces" description="Last 30 days">
          <BarList data={topProducts} valueLabel="views" />
        </Panel>

        <Panel title="Popular categories" description="By product views">
          <BarList data={topCategories} valueLabel="views" />
        </Panel>

        <Panel title="What customers searched for" description="Queries with no results are worth stocking">
          {searches.length === 0 ? (
            <p className="py-8 text-center text-sm text-subtle">No searches recorded yet</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {searches.map((search) => (
                <li key={search.label} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="truncate text-sm">{search.label}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    {search.resultCount === 0 ? <Badge tone="danger">no results</Badge> : null}
                    <span className="text-sm text-muted tabular-nums">{search.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Languages" description="Share of recorded events">
          <BarList data={localeSplit} valueLabel="events" />
        </Panel>
      </div>

      <Panel
        title="Recent inquiries"
        className="mt-4"
        bodyClassName="p-0"
        actions={
          <Link href="/admin/inquiries" className="text-sm text-accent transition-colors hover:underline">
            View all
          </Link>
        }
      >
        {recent.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No inquiries yet"
              description="Inquiries appear here the moment a customer opens WhatsApp from a product page."
            />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Customer</Th>
                <Th>Piece</Th>
                <Th>Status</Th>
                <Th align="end">Received</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map((inquiry) => {
                const config = parseJson<{ productName?: string }>(inquiry.configuration, {});
                return (
                  <tr key={inquiry.id} className="transition-colors hover:bg-sunken/60">
                    <Td className="font-medium tabular-nums">
                      <Link href={`/admin/inquiries/${inquiry.id}`} className="hover:text-accent">
                        {inquiry.reference}
                      </Link>
                    </Td>
                    <Td>{inquiry.customerName}</Td>
                    <Td className="text-muted">{config.productName ?? inquiry.product?.slug ?? "—"}</Td>
                    <Td>
                      <Badge tone={STATUS_TONE[inquiry.status] ?? "neutral"}>
                        {inquiry.status as InquiryStatus}
                      </Badge>
                    </Td>
                    <Td align="end" className="whitespace-nowrap text-muted">
                      {formatRelative(inquiry.createdAt, "en")}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>

      {/* Inquiry pipeline at a glance */}
      <Panel title="Pipeline" className="mt-4">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(["NEW", "CONTACTED", "QUOTED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((status) => (
            <Link
              key={status}
              href={`/admin/inquiries?status=${status}`}
              className="rounded-md border border-line p-4 transition-colors hover:border-line-strong"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                {status.toLowerCase()}
              </p>
              <p className="mt-1.5 text-xl font-semibold tabular-nums">{funnel[status] ?? 0}</p>
            </Link>
          ))}
        </div>
      </Panel>
    </AdminFrame>
  );
}
