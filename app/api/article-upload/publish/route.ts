import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  ArticlePublishSchema,
  type ArticlePublishPayload,
} from "@/resource-hub/lib/article-schema";
import { filesystemStorage } from "@/resource-hub/lib/storage";

function escapeYamlString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

async function saveHeroImageIfBase64(
  heroImage: string,
  slug: string
): Promise<string | undefined> {
  if (!heroImage.startsWith("data:image/")) return undefined;
  const match = heroImage.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return undefined;
  const [, ext, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  return filesystemStorage.saveHeroImage(slug, buffer, ext);
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

function buildFrontmatter(
  data: ArticlePublishPayload,
  heroImageFilename?: string
): string {
  const date = data.publishedDate || new Date().toISOString().slice(0, 10);
  const heroLine = heroImageFilename
    ? `heroImage: "${heroImageFilename}"\n`
    : "";
  const sourcesBlock = data.sources?.length
    ? buildSourcesYaml(data.sources)
    : "";
  return `---
title: "${escapeYamlString(data.title)}"
subtitle: "${escapeYamlString(data.subtitle)}"
category: "${data.category}"
publishedDate: "${date}"
${heroLine}${sourcesBlock}---
`;
}

export async function POST(req: Request) {
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
    let heroImageFilename: string | undefined;
    if (data.heroImage?.startsWith("data:image/")) {
      heroImageFilename = await saveHeroImageIfBase64(data.heroImage, data.slug);
    } else if (data.heroImage && !data.heroImage.startsWith("http")) {
      heroImageFilename = data.heroImage.replace(/^\/hub\/images\//, "");
    }
    const frontmatter = buildFrontmatter(data, heroImageFilename);
    const fullContent = frontmatter + data.body;

    await filesystemStorage.writeArticle(data.slug, fullContent);

    revalidatePath("/resource-hub");
    revalidatePath(`/resource-hub/${data.slug}`);

    return NextResponse.json({
      success: true,
      slug: data.slug,
      url: `/resource-hub/${data.slug}`,
    });
  } catch (err) {
    console.error("[article-upload/publish]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Publish failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
