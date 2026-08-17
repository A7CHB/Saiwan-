import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const schema = z.object({ productId: z.string().min(1).max(40) });

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { id: true, status: true },
  });
  if (!product || product.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Idempotent: saving twice is a no-op rather than a unique-constraint error.
  await prisma.favorite.upsert({
    where: { userId_productId: { userId: user.id, productId: product.id } },
    update: {},
    create: { userId: user.id, productId: product.id },
  });

  return NextResponse.json({ saved: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  await prisma.favorite.deleteMany({ where: { userId: user.id, productId: parsed.data.productId } });
  return NextResponse.json({ saved: false });
}
