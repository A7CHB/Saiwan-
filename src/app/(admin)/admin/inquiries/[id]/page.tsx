import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { Badge, PageHeader, Panel } from "@/components/admin/ui";
import { InquiryForm } from "@/components/admin/inquiry-form";
import { STATUS_TONE } from "@/app/(admin)/admin/inquiries/page";
import { formatDate } from "@/lib/i18n/format";
import { normalisePhone, parseJson } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/whatsapp";

export const metadata: Metadata = { title: "Inquiry" };
export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("STAFF");
  const { id } = await params;

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: "desc" } },
      product: { select: { slug: true, translations: { where: { locale: "en" }, select: { name: true } } } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!inquiry) notFound();

  const config = parseJson<Record<string, unknown>>(inquiry.configuration, {});
  const phone = normalisePhone(inquiry.customerPhone);

  return (
    <AdminFrame>
      <Link
        href="/admin/inquiries"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" strokeWidth={1.6} aria-hidden="true" />
        All inquiries
      </Link>

      <PageHeader
        title={inquiry.reference}
        description={`${inquiry.source.toLowerCase()} · ${formatDate(inquiry.createdAt, "en", { dateStyle: "long", timeStyle: "short" })}`}
        actions={
          phone ? (
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-[#25D366] px-3.5 text-sm font-medium text-[#04150b] transition-colors hover:bg-[#1fbe59]"
            >
              <WhatsAppIcon className="size-4" />
              Reply on WhatsApp
            </a>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Customer">
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted">Name</dt>
                <dd className="mt-1 text-sm">{inquiry.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">WhatsApp / phone</dt>
                <dd className="mt-1 text-sm" dir="ltr">
                  {inquiry.customerPhone || (
                    <span className="text-subtle">
                      Not captured — this inquiry began in WhatsApp, where the number arrives with the message.
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Email</dt>
                <dd className="mt-1 text-sm" dir="ltr">
                  {inquiry.customerEmail ?? <span className="text-subtle">—</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Language</dt>
                <dd className="mt-1 text-sm uppercase">{inquiry.locale}</dd>
              </div>
              {inquiry.user ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-muted">Account</dt>
                  <dd className="mt-1 text-sm">
                    <Link href={`/admin/customers?q=${inquiry.user.email}`} className="hover:text-accent">
                      {inquiry.user.name} ({inquiry.user.email})
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          </Panel>

          <Panel title="Configuration" description="Exactly what the customer specified on the site.">
            {Object.keys(config).length === 0 ? (
              <p className="text-sm text-subtle">No configuration recorded.</p>
            ) : (
              <dl className="flex flex-col divide-y divide-line">
                {Object.entries(config).map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-6 py-2.5">
                    <dt className="text-sm capitalize text-muted">{key.replace(/([A-Z])/g, " $1").trim()}</dt>
                    <dd className="text-end text-sm">
                      {Array.isArray(value) ? (value.length ? value.join(", ") : "—") : String(value ?? "—")}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {inquiry.product ? (
              <Link
                href={`/en/collection/${inquiry.product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:underline"
              >
                {inquiry.product.translations[0]?.name ?? inquiry.product.slug}
                <ExternalLink className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
              </Link>
            ) : null}
          </Panel>

          {inquiry.message ? (
            <Panel title="Message from the customer">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{inquiry.message}</p>
            </Panel>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Status">
            <div className="mb-4">
              <Badge tone={STATUS_TONE[inquiry.status] ?? "neutral"}>{inquiry.status.toLowerCase()}</Badge>
            </div>
            <InquiryForm id={inquiry.id} status={inquiry.status} adminNotes={inquiry.adminNotes ?? ""} />
          </Panel>

          <Panel title="History">
            {inquiry.events.length === 0 ? (
              <p className="text-sm text-subtle">No events yet.</p>
            ) : (
              <ol className="flex flex-col gap-4">
                {inquiry.events.map((event) => (
                  <li key={event.id} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-accent/40"
                    />
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{event.status.toLowerCase()}</span>
                        {event.actor ? <span className="text-muted"> · {event.actor}</span> : null}
                      </p>
                      {event.note ? <p className="mt-0.5 text-sm text-muted">{event.note}</p> : null}
                      <p className="mt-0.5 text-xs text-subtle">
                        {formatDate(event.createdAt, "en", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>
    </AdminFrame>
  );
}
