import { slugify } from "../extract-headings";
import { getResourceSlugs } from "../getResource";
import { htmlToMarkdown } from "./turndown";
import { parseMetadataBlock, parseFallbackMetadata } from "./metadata";

export { htmlToMarkdown } from "./turndown";
export { parseSourcesSection } from "./sources";
export { parseMetadataBlock, parseFallbackMetadata } from "./metadata";

export function extractDocId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function extractFirstImageFromHtml(html: string): string | null {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

function extractFirstImageFromMarkdown(markdown: string): string | null {
  const imageMatch = markdown.match(/!\[[^\]]*]\(([^)]+)\)/);
  return imageMatch ? imageMatch[1] : null;
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

export interface ConvertResult {
  frontmatter: {
    title: string;
    subtitle: string;
    category: string;
    publishedDate?: string;
    sources: { title: string; url?: string; author: string; year?: string }[];
  };
  body: string;
  slug: string;
  heroImage?: string;
}

/**
 * Convert Google Doc HTML to article markdown + frontmatter.
 * Used by web form (convert route) and Phase 3 Agent.
 */
export async function convertGoogleDoc(html: string): Promise<ConvertResult> {
  const fullMarkdown = htmlToMarkdown(html);
  const parsed =
    parseMetadataBlock(fullMarkdown) ?? parseFallbackMetadata(fullMarkdown);

  const existingSlugs = await getResourceSlugs();
  const baseSlug = slugify(parsed.title);
  const slug = ensureUniqueSlug(baseSlug, existingSlugs);

  const heroImage = extractFirstImageFromHtml(html);

  return {
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
  };
}

/**
 * Convert Markdown (e.g. from DOCX via mammoth) to article structure.
 * Reuses the same metadata parsing and slug logic as Google Docs.
 */
export async function convertDocxMarkdown(markdown: string): Promise<ConvertResult> {
  const parsed =
    parseMetadataBlock(markdown) ?? parseFallbackMetadata(markdown);

  const existingSlugs = await getResourceSlugs();
  const baseSlug = slugify(parsed.title);
  const slug = ensureUniqueSlug(baseSlug, existingSlugs);

  const heroImage = extractFirstImageFromMarkdown(markdown);

  return {
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
  };
}
