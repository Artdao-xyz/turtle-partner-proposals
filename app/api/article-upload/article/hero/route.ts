import { NextResponse } from "next/server";
import { getStorage } from "@/resource-hub/lib/storage";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);

function parseImageDataUrl(image: string): { ext: string; buffer: Buffer } | null {
  const match = image.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return null;
  const [, extRaw, base64] = match;
  const ext = extRaw.toLowerCase();
  try {
    const buffer = Buffer.from(base64, "base64");
    return { ext, buffer };
  } catch {
    return null;
  }
}

/**
 * Upload a new hero image for an article.
 * Body: { slug: string; image: string } where image is a data URL (data:image/...;base64,...).
 * Returns { heroImage: string } which can be stored in frontmatter.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = body?.slug;
    const image = body?.image;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "image dataUrl is required" }, { status: 400 });
    }

    const parsed = parseImageDataUrl(image);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid image dataUrl" }, { status: 400 });
    }

    if (!ALLOWED_EXTENSIONS.has(parsed.ext)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use PNG, JPG, or WEBP." },
        { status: 400 }
      );
    }

    if (parsed.buffer.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Max size is 2MB." },
        { status: 400 }
      );
    }

    const storage = getStorage();
    const heroImage = await storage.saveHeroImage(slug, parsed.buffer, parsed.ext);

    return NextResponse.json({ heroImage });
  } catch (err) {
    console.error("[article-upload/article/hero POST]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to upload hero image.",
      },
      { status: 500 }
    );
  }
}

