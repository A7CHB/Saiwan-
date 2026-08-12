import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { AdminFrame } from "@/components/admin/frame";
import { AreaChart, Badge, BarList, PageHeader, Panel, StatCard } from "@/components/admin/ui";
import {
  getInquiryFunnel,
  getLocaleSplit,
  getOverview,
  getTopCategories,
  getTopProducts,
  getTopSearches,
  getTopWhatsAppProducts,
  type Range,
} from "@/lib/data/analytics";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

const RANGES: Range[] = [7, 30, 90];

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("STAFF");

  const query = await searchParams;
  const rangeParam = Number(Array.isArray(query.range) ? query.range[0] : query.range);
  const range: Range = RANGES.includes(rangeParam as Range) ? (rangeParam as Range) : 30;

  const [overview, topProducts, topWhatsApp, categories, searches, localeSplit, funnel] = await Promise.all([
    getOverview(range),
    getTopProducts("en", range, 10),
    getTopWhatsAppProducts("en", 10),
    getTopCategories("en", range),
    getTopSearches(range, 12),
    getLocaleSplit(range),
    getInquiryFunnel(),
  ]);

  const totalInquiries = Object.values(funnel).reduce((sum, value) => sum + value, 0);
  const won = (funnel.CONFIRMED ?? 0) + (funnel.COMPLETED ?? 0);

  return (
    <AdminFrame>
      <PageHeader
        title="Analytics"
        description="First-party measurement. No third-party trackers, and no personal data beyond an anonymous visitor id."
        actions={
          <nav className="flex gap-1.5" aria-label="Date range">
            {RANGES.map((option) => (
              <Link
                key={option}
                href={`/admin/analytics?range=${option}`}
                aria-current={range === option ? "page" : undefined}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  range === option
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line text-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {option}d
              </Link>
            ))}
          </nav>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Visitors" value={overview.visitors.value} delta={overview.visitors.delta} hint="unique" />
        <StatCard label="Product views" value={overview.productViews.value} delta={overview.productViews.delta} />
        <StatCard
          label="WhatsApp clicks"
          value={overview.whatsappClicks.value}
          delta={overview.whatsappClicks.delta}
        />
        <StatCard label="Inquiries" value={overview.inquiries.value} delta={overview.inquiries.delta} />
        <StatCard
          label="Conversion"
          value={`${overview.conversionRate}%`}
          hint="clicks per product view"
        />
      </div>

      <Panel title="Traffic" description={`Product and page views per day, last ${range} days`} className="mt-4">
        <AreaChart data={overview.series} label={`Views per day over the last ${range} days`} />
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Most viewed pieces" description={`Last ${range} days`}>
          <BarList data={topProducts} valueLabel="views" />
        </Panel>

        <Panel title="Most requested pieces" description="Lifetime WhatsApp clicks">
          <BarList data={topWhatsApp} valueLabel="clicks" />
        </Panel>

        <Panel title="Popular categories" description="By product views">
          <BarList data={categories} valueLabel="views" />
        </Panel>

        <Panel title="Languages" description="Share of recorded events">
          <BarList data={localeSplit} valueLabel="events" />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Search queries"
          description="Queries returning nothing are the clearest signal of what to stock next."
        >
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

        <Panel title="Inquiry pipeline" description="Lifetime, by status">
          <div className="mb-5 flex items-baseline gap-3">
            <span className="text-2xl font-semibold tabular-nums">{totalInquiries}</span>
            <span className="text-sm text-muted">
              total · {totalInquiries === 0 ? 0 : Math.round((won / totalInquiries) * 100)}% confirmed or completed
            </span>
          </div>
          <BarList
            data={(["NEW", "CONTACTED", "QUOTED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map(
              (status) => ({
                label: status.toLowerCase(),
                value: funnel[status] ?? 0,
                href: `/admin/inquiries?status=${status}`,
              }),
            )}
          />
        </Panel>
      </div>
    </AdminFrame>
  );
}
