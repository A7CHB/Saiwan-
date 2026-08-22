import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";
import { authorize } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Where a product photograph goes when somebody picks it off their laptop.
 *
 * Two destinations:
 *
 *   Vercel Blob whenever a token is configured, which is how anything deployed
 *   must work. The filesystem there is read-only and lives for one invocation,
 *   so a file written to `public/` would be gone before anyone could ask for
 *   it — and would not exist at all on the next request, which is served by a
 *   different machine.
 *
 *   `public/uploads` in development only. Asking someone to create cloud
 *   storage before they can try the dashboard on their own machine is a bad
 *   trade, and the directory is already in .gitignore for exactly this.
 *
 * The fallback is deliberately not allowed to stand in for storage in a
 * production build. `next build` snapshots `public/`, so a file written there
 * afterwards is on disk and still answers 404 — an upload that appears to
 * succeed and produces a dead image is worse than one that refuses and says
 * what is missing.
 *
 * Both return a URL, and the product simply stores the URL it is given.
 */

const MAX_BYTES = 8 * 1024 * 1024;

/** Formats `next/image` can actually optimise, so nothing arrives unrenderable. */
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  // Uploading is writing to the site, so it needs a signed-in member of staff.
  // `authorize` re-reads the session row and the user's live role rather than
  // trusting the cookie's claims.
  const user = await authorize("STAFF");
  if (!user) return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const extension = TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "That is not an image we can display. Use JPEG, PNG, WebP, AVIF or GIF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 8 MB.` },
      { status: 413 },
    );
  }

  // The stored name is ours, never theirs: an uploaded filename is attacker
  // input, and it is also how two people both uploading "IMG_1234.jpg" would
  // overwrite each other.
  const name = `${randomUUID()}.${extension}`;

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${name}`, file, {
        access: "public",
        contentType: file.type,
        // Names are already unique, and a second suffix would only make the
        // URL longer and harder to recognise in the admin.
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "No image storage is configured. Add a Blob store to the project and set BLOB_READ_WRITE_TOKEN, then redeploy. Until then you can paste an image URL.",
        },
        { status: 501 },
      );
    }

    const directory = join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (error) {
    console.error("upload failed", error);
    return NextResponse.json(
      { error: "The upload did not complete. Try again, or paste a URL instead." },
      { status: 500 },
    );
  }
}
