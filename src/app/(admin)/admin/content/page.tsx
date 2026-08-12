import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminFrame } from "@/components/admin/frame";
import { PageHeader, Panel } from "@/components/admin/ui";
import { ContentForm } from "@/components/admin/entity-forms";

export const metadata: Metadata = { title: "Content" };
export const dynamic = "force-dynamic";

/**
 * Editable content blocks.
 *
 * These are the fields that are neither product data nor UI strings — mainly
 * which photographs the home and about pages use. Each block is JSON so a
 * single key can hold a structured group of fields, and every page that reads
 * one supplies its own defaults, so a missing or malformed block degrades to
 * the shipped design rather than to a blank section.
 */
const BLOCKS = [
  {
    key: "home.media",
    title: "Home page imagery",
    description:
      "Which images the home page uses. heroImage and manifestoImage are single paths; craftImages and showcaseImages are ordered lists.",
    template: JSON.stringify(
      {
        heroImage: "/media/hero-terrace.svg",
        heroImageMobile: "/media/portrait-terrace.svg",
        manifestoImage: "/media/portrait-canopy.svg",
        quizImage: "/media/hero-dusk.svg",
        craftImages: ["/media/detail-frame.svg", "/media/detail-fabric.svg", "/media/detail-hardware.svg"],
        showcaseImages: [
          "/media/detail-frame.svg",
          "/media/detail-fabric.svg",
          "/media/detail-hardware.svg",
          "/media/portrait-mast.svg",
        ],
      },
      null,
      2,
    ),
  },
  {
    key: "about.media",
    title: "About page imagery",
    description: "The three plates used on the About page.",
    template: JSON.stringify(
      {
        heroImage: "/media/hero-dusk.svg",
        portraitImage: "/media/portrait-terrace.svg",
        detailImage: "/media/detail-hardware.svg",
      },
      null,
      2,
    ),
  },
];

export default async function AdminContentPage() {
  await requireRole("STAFF");

  const rows = await prisma.contentBlock.findMany({
    where: { key: { in: BLOCKS.map((block) => block.key) } },
  });

  return (
    <AdminFrame>
      <PageHeader
        title="Content"
        description="Page-level content that is not part of the catalogue. Values are JSON so one block can hold a group of related fields."
      />

      <div className="flex flex-col gap-4">
        {BLOCKS.map((block) => {
          const values = Object.fromEntries(
            rows.filter((row) => row.key === block.key).map((row) => [row.locale, row.value]),
          );
          // Pre-fill empty languages with the template so an editor sees the
          // shape rather than an empty box.
          const withDefaults = Object.fromEntries(
            ["en", "ar", "ckb"].map((locale) => [
              locale,
              values[locale] ? JSON.stringify(JSON.parse(values[locale]), null, 2) : block.template,
            ]),
          );

          return (
            <Panel key={block.key} title={block.title}>
              <ContentForm contentKey={block.key} description={block.description} values={withDefaults} />
            </Panel>
          );
        })}
      </div>
    </AdminFrame>
  );
}
