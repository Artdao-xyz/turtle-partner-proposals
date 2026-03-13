import type { SourceItem } from "../article-schema";
import { ARTICLE_CATEGORIES } from "../constants";
import { parseSourcesSection } from "./sources";

function parseDate(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return trimmed;
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

/** Unescape simple markdown escapes like \- \_ \* for metadata fields. */
function unescapeSimpleMarkdown(text: string): string {
  return text.replace(/\\([\\`*_{}\[\]()#+\-.!])/g, "$1");
}

export function parseMetadataBlock(markdown: string): {
  title: string;
  subtitle: string;
  category: (typeof ARTICLE_CATEGORIES)[number];
  publishedDate?: string;
  body: string;
  sources: SourceItem[];
} | null {
  const titleMatch = markdown.match(/^Title\s*:\s*(.+?)(?=\r?\n|$)/im);
  const subtitleMatch = markdown.match(/^Subtitle\s*:\s*(.+?)(?=\r?\n|$)/im);
  const categoryMatch = markdown.match(/^Category\s*:\s*(.+?)(?=\r?\n|$)/im);
  const dateMatch = markdown.match(/^(?:Date|PublishedDate)\s*:\s*(.+?)(?=\r?\n|$)/im);

  const rawTitle = titleMatch?.[1]?.trim();
  const rawSubtitle = subtitleMatch?.[1]?.trim();
  const rawCategory = categoryMatch?.[1]?.trim();
  const publishedDate = parseDate(dateMatch?.[1]);

  if (!rawTitle || !rawSubtitle) return null;

  const title = unescapeSimpleMarkdown(rawTitle);
  const subtitle = unescapeSimpleMarkdown(rawSubtitle);
  const categoryRaw = unescapeSimpleMarkdown(rawCategory ?? "");

  const category =
    ARTICLE_CATEGORIES.find((c) => c.toLowerCase() === categoryRaw.toLowerCase()) ?? "Research";

  const metaEnds = [titleMatch, subtitleMatch, categoryMatch, dateMatch]
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => (m.index ?? 0) + m[0].length);
  const lastMetaEnd = metaEnds.length ? Math.max(...metaEnds) : 0;
  const afterMeta = markdown.slice(lastMetaEnd).replace(/^\s+/, "");

  const body = afterMeta.replace(/!\[[^\]]*\]\([^)]+\)/, "").trim();
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

export function parseFallbackMetadata(markdown: string): {
  title: string;
  subtitle: string;
  category: (typeof ARTICLE_CATEGORIES)[number];
  publishedDate?: string;
  body: string;
  sources: SourceItem[];
} {
  const titleMatch = markdown.match(/^#+\s+(.+)$/m);
  const rawTitle = titleMatch?.[1]?.trim() || "Untitled";
  const title = unescapeSimpleMarkdown(rawTitle);
  const body = markdown.replace(/!\[[^\]]*\]\([^)]+\)/, "").trim();
  const { sources, bodyWithoutSources } = parseSourcesSection(body);

  return {
    title,
    subtitle: "",
    category: "Research",
    publishedDate: undefined,
    body: bodyWithoutSources.trim(),
    sources,
  };
}
