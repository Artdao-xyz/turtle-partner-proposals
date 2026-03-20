import { NextResponse } from "next/server";
import {
  ArticlePublishSchema,
  type ArticlePublishPayload,
} from "@/resource-hub/lib/article-schema";
import {
  writeBlobDraft,
  saveBlobDraftHeroImage,
  deleteBlobDraft,
} from "@/resource-hub/lib/storage";

function escapeYamlString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function buildSourcesYaml(sources: { title: string; url?: string; author: string; year?: string }[]): string {
  if (!sources.length) return "";
  const lines = sources.map((s) => {
    const title = `  - title: "${escapeYamlString(s.title)}"`;
    const url = s.url ? `\n    url: "${escapeYamlString(s.url)}"` : "";
    const author = `\n    author: "${escapeYamlString(s.author)}"`;
    const year = s.year ? `\n    year: "${s.year}"` : "";
    return title + url + author + year;
  });
  return `sources:\n${lines.join("\n")}\n`;
}

function buildDraftFrontmatter(
  data: ArticlePublishPayload,
  heroImageValue?: string
): string {
  const date = data.publishedDate || new Date().toISOString().slice(0, 10);
  const heroLine = heroImageValue ? `heroImage: "${heroImageValue}"\n` : "";
  const sourcesBlock = data.sources?.length ? buildSourcesYaml(data.sources) : "";
  return `---
slug: "${data.slug}"
title: "${escapeYamlString(data.title)}"
subtitle: "${escapeYamlString(data.subtitle)}"
category: "${data.category}"
publishedDate: "${date}"
${heroLine}${sourcesBlock}---
`;
}

function generatePreviewId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

async function saveHeroImageIfBase64(
  heroImage: string,
  previewId: string
): Promise<string | undefined> {
  if (!heroImage.startsWith("data:image/")) return undefined;
  const match = heroImage.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return undefined;
  const [, ext, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  return saveBlobDraftHeroImage(previewId, buffer, ext);
}

export async function POST(req: Request) {
  if (process.env.CONTENT_SOURCE !== "blob") {
    return NextResponse.json(
      { error: "Drafts require CONTENT_SOURCE=blob" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ArticlePublishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const previewId = generatePreviewId();

    let heroImageValue: string | undefined;
    if (data.heroImage?.startsWith("data:image/")) {
      heroImageValue = await saveHeroImageIfBase64(data.heroImage, previewId);
    } else if (data.heroImage?.startsWith("blob:")) {
      heroImageValue = data.heroImage;
    }

    const frontmatter = buildDraftFrontmatter(data, heroImageValue);
    const fullContent = frontmatter + data.body;

    await writeBlobDraft(previewId, fullContent);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const previewUrl = `${baseUrl}/blog/preview/${previewId}`;

    return NextResponse.json({
      success: true,
      previewId,
      previewUrl,
    });
  } catch (err) {
    console.error("[article-upload/draft]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to save draft. Please try again.",
      },
      { status: 500 }
    );
  }
}

/** DELETE draft (for Cancel button). Body: { previewId } or ?previewId=xxx */
export async function DELETE(req: Request) {
  if (process.env.CONTENT_SOURCE !== "blob") {
    return NextResponse.json(
      { error: "Drafts require CONTENT_SOURCE=blob" },
      { status: 503 }
    );
  }

  try {
    let previewId: string | undefined;
    const url = new URL(req.url);
    if (url.searchParams.has("previewId")) {
      previewId = url.searchParams.get("previewId") ?? undefined;
    } else {
      try {
        const body = await req.json();
        previewId = body?.previewId;
      } catch {
        previewId = undefined;
      }
    }
    if (!previewId || typeof previewId !== "string") {
      return NextResponse.json(
        { error: "previewId is required" },
        { status: 400 }
      );
    }

    await deleteBlobDraft(previewId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[article-upload/draft DELETE]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to delete draft.",
      },
      { status: 500 }
    );
  }
}
