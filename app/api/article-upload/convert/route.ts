import { NextResponse } from "next/server";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { slugify } from "@/resource-hub/lib/extract-headings";
import { getResourceSlugs } from "@/resource-hub/lib/getResource";

const CATEGORIES = [
  "Benchmark",
  "Guides",
  "Playbooks",
  "Research",
  "Comparisons",
  "Updates",
] as const;

function extractDocId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let n = 2;
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${n}`;
    n++;
  }
  return slug;
}

function extractFirstImageFromHtml(html: string): string | null {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });
  turndown.use(gfm);
  turndown.keep(["aside", "blockquote"]);
  return turndown.turndown(html);
}

interface SourceItem {
  title: string;
  url?: string;
  author: string;
  year?: string;
}

function parseSourcesSection(body: string): { sources: SourceItem[]; bodyWithoutSources: string } {
  const match = body.match(/(?:^|\n)(#+\s*Sources\s*\n)([\s\S]*?)(?=\n#+\s|\n---|\s*$)/i);
  if (!match) return { sources: [], bodyWithoutSources: body };

  const sectionContent = match[2].trim();
  const bodyWithoutSources = body.replace(match[1] + sectionContent, "").replace(/\n{3,}/g, "\n\n").trim();

  const sources: SourceItem[] = [];
  const lines = sectionContent.split(/\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    let remaining = line;

    const yearMatch = remaining.match(/\s+(\d{4})\s*$/);
    const year = yearMatch ? yearMatch[1] : undefined;
    if (yearMatch) remaining = remaining.slice(0, yearMatch.index).trim();

    const items: { title: string; url?: string }[] = [];

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(line)) !== null) {
      items.push({ title: linkMatch[1], url: linkMatch[2] });
    }

    if (items.length === 0) {
      const quotedRegex = /"([^"]+)"/g;
      let qMatch;
      while ((qMatch = quotedRegex.exec(line)) !== null) {
        items.push({ title: qMatch[1] });
      }
    }

    if (items.length === 0) {
      const andMatch = remaining.match(/^"([^"]+)"\s+and\s+"([^"]+)"\s+(.+)$/);
      if (andMatch) {
        items.push({ title: andMatch[1] });
        items.push({ title: andMatch[2] });
        remaining = andMatch[3];
      } else {
        const lastPhrase = remaining.match(/\s+([A-Z][A-Za-z0-9.\s()]+)$/);
        const authorStr = lastPhrase ? lastPhrase[1].trim() : "";
        const titleStr = lastPhrase
          ? remaining.slice(0, lastPhrase.index).trim().replace(/^"|"$/g, "")
          : remaining.replace(/^"|"$/g, "").trim();
        if (titleStr) {
          sources.push({ title: titleStr, author: authorStr, year });
        }
        continue;
      }
    }

    const author = remaining
      .replace(/\[[^\]]+\]\([^)]+\)/g, "")
      .replace(/"([^"]+)"/g, "")
      .replace(/\s+and\s+/g, " ")
      .trim();

    for (const item of items) {
      if (item.title.trim()) {
        sources.push({
          title: item.title.trim(),
          url: item.url,
          author,
          year,
        });
      }
    }
  }

  return { sources, bodyWithoutSources };
}

function parseDate(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return trimmed;
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

function parseMetadataBlock(markdown: string): {
  title: string;
  subtitle: string;
  category: (typeof CATEGORIES)[number];
  publishedDate?: string;
  body: string;
  sources: SourceItem[];
} | null {
  const titleMatch = markdown.match(/^Title\s*:\s*(.+?)(?=\r?\n|$)/im);
  const subtitleMatch = markdown.match(/^Subtitle\s*:\s*(.+?)(?=\r?\n|$)/im);
  const categoryMatch = markdown.match(/^Category\s*:\s*(.+?)(?=\r?\n|$)/im);
  const dateMatch = markdown.match(/^(?:Date|PublishedDate)\s*:\s*(.+?)(?=\r?\n|$)/im);

  const title = titleMatch?.[1]?.trim();
  const subtitle = subtitleMatch?.[1]?.trim();
  const categoryRaw = categoryMatch?.[1]?.trim();
  const publishedDate = parseDate(dateMatch?.[1]);

  if (!title || !subtitle) return null;

  const category =
    CATEGORIES.find((c) => c.toLowerCase() === (categoryRaw ?? "").toLowerCase()) ?? "Research";

  const metaEnds = [titleMatch, subtitleMatch, categoryMatch, dateMatch]
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => (m.index ?? 0) + m[0].length);
  const lastMetaEnd = metaEnds.length ? Math.max(...metaEnds) : 0;
  const afterMeta = markdown.slice(lastMetaEnd).replace(/^\s+/, "");

  let body = afterMeta;
  body = body.replace(/!\[[^\]]*\]\([^)]+\)/, "");

  const { sources, bodyWithoutSources } = parseSourcesSection(body);

  return {
    title,
    subtitle,
    category,
    publishedDate,
    body: bodyWithoutSources.trim(),
    sources,
  };
}

function parseFallbackMetadata(markdown: string): {
  title: string;
  subtitle: string;
  category: (typeof CATEGORIES)[number];
  publishedDate?: string;
  body: string;
  sources: SourceItem[];
} {
  let body = markdown;
  let title = "";
  let subtitle = "";

  // First ## or # as title
  const hMatch = markdown.match(/^#+\s+(.+)$/m);
  if (hMatch) {
    title = hMatch[1].trim();
    body = markdown.slice(markdown.indexOf(hMatch[0]) + hMatch[0].length).trim();
  }

  // First paragraph as subtitle
  const paraMatch = body.match(/^([\s\S]+?)(?:\n\n|\n##|$)/);
  if (paraMatch) {
    subtitle = paraMatch[1].trim().replace(/\n/g, " ");
    body = body.slice(paraMatch[0].length).trim();
  }

  body = body.replace(/!\[[^\]]*\]\([^)]+\)/, "");

  const { sources, bodyWithoutSources } = parseSourcesSection(body);

  return {
    title: title || "Untitled",
    subtitle: subtitle || "",
    category: "Research",
    publishedDate: undefined,
    body: bodyWithoutSources.trim(),
    sources,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const docUrl = body?.docUrl;
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
            "Could not extract document ID from URL. Use a Google Docs URL like https://docs.google.com/document/d/xxx/edit",
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
              "Document is not accessible. Please set sharing to 'Anyone with the link can view'.",
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

    const fullMarkdown = htmlToMarkdown(html);
    const parsed =
      parseMetadataBlock(fullMarkdown) ?? parseFallbackMetadata(fullMarkdown);

    const existingSlugs = await getResourceSlugs();
    const baseSlug = slugify(parsed.title);
    const slug = ensureUniqueSlug(baseSlug, existingSlugs);

    const heroImage = extractFirstImageFromHtml(html);

    return NextResponse.json({
      frontmatter: {
        title: parsed.title,
        subtitle: parsed.subtitle,
        category: parsed.category,
        publishedDate: parsed.publishedDate,
        sources: parsed.sources,
      },
      body: parsed.body,
      slug,
      heroImage: heroImage || undefined,
    });
  } catch (err) {
    console.error("[article-upload/convert]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Conversion failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
