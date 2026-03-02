import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CONTENT_DIR = join(process.cwd(), "resource-hub", "content");
const IMAGES_DIR = join(process.cwd(), "public", "hub", "images");

const SourceSchema = z.object({
  title: z.string(),
  url: z.string().optional(),
  author: z.string(),
  year: z.string().optional(),
});

const PublishSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1),
  subtitle: z.string(),
  category: z.enum([
    "Benchmark",
    "Guides",
    "Playbooks",
    "Research",
    "Comparisons",
    "Updates",
  ]),
  body: z.string(),
  publishedDate: z.string().optional(),
  heroImage: z.string().optional(),
  sources: z.array(SourceSchema).optional(),
});

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
  const safeExt = ext === "jpeg" ? "jpg" : ext;
  const filename = `${slug}-hero.${safeExt}`;
  const buffer = Buffer.from(base64, "base64");
  const filePath = join(IMAGES_DIR, filename);
  await writeFile(filePath, buffer);
  return filename;
}

function buildSourcesYaml(sources: z.infer<typeof SourceSchema>[]): string {
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
  data: z.infer<typeof PublishSchema>,
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
    const parsed = PublishSchema.safeParse(body);
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

    const filePath = join(CONTENT_DIR, `${data.slug}.md`);
    await writeFile(filePath, fullContent, "utf-8");

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
