import { NextResponse } from "next/server";
import {
  extractDocId,
  convertGoogleDoc,
} from "@/resource-hub/lib/article-conversion";
import {
  generateLocalPreviewId,
  setLocalPreviewContent,
} from "@/resource-hub/lib/preview-store";
import type { SourceItem } from "@/resource-hub/lib/article-schema";

function escapeYamlString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function buildSourcesYaml(sources: SourceItem[]): string {
  if (!sources?.length) return "";
  const lines = sources.map((s) => {
    const title = `  - title: "${escapeYamlString(s.title)}"`;
    const url = s.url ? `\n    url: "${escapeYamlString(s.url)}"` : "";
    const author = `\n    author: "${escapeYamlString(s.author)}"`;
    const year = s.year ? `\n    year: "${s.year}"` : "";
    return title + url + author + year;
  });
  return `sources:\n${lines.join("\n")}\n`;
}

function buildFrontmatter(result: Awaited<ReturnType<typeof convertGoogleDoc>>): string {
  const date = result.frontmatter.publishedDate || new Date().toISOString().slice(0, 10);
  const heroLine = result.heroImage ? `heroImage: "${result.heroImage}"\n` : "";
  const sourcesBlock = buildSourcesYaml(result.frontmatter.sources ?? []);
  return `---
slug: "${result.slug}"
title: "${escapeYamlString(result.frontmatter.title)}"
subtitle: "${escapeYamlString(result.frontmatter.subtitle)}"
category: "${result.frontmatter.category}"
publishedDate: "${date}"
${heroLine}${sourcesBlock}---
`;
}

/**
 * Preview a Google Doc locally without storing to Blob.
 * Dev only - content lives in process memory.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const docUrl = payload?.docUrl;
    if (!docUrl || typeof docUrl !== "string" || !docUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid request. docUrl is required and must be a valid URL." },
        { status: 400 }
      );
    }

    const docId = extractDocId(docUrl);
    if (!docId) {
      return NextResponse.json(
        {
          error:
            "Could not extract document ID. Use a Google Docs URL like https://docs.google.com/document/d/xxx/edit",
        },
        { status: 400 }
      );
    }

    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;
    const res = await fetch(exportUrl);

    if (!res.ok) {
      if (res.status === 403) {
        return NextResponse.json(
          {
            error:
              "Document is not accessible. Set sharing to 'Anyone with the link can view'.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch document: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const html = await res.text();
    if (!html || html.length < 50) {
      return NextResponse.json(
        { error: "Document appears empty or could not be fetched." },
        { status: 400 }
      );
    }

    const result = await convertGoogleDoc(html);
    const frontmatter = buildFrontmatter(result);
    const fullContent = frontmatter + result.body;

    const previewId = generateLocalPreviewId();
    setLocalPreviewContent(previewId, fullContent);

    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const previewUrl = `${baseUrl}/blog/preview/${previewId}`;

    return NextResponse.json({
      success: true,
      previewId,
      previewUrl,
    });
  } catch (err) {
    console.error("[article-upload/preview-local]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Conversion failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
