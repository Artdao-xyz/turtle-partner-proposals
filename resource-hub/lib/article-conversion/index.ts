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

function stripBoldMarkdown(text: string): string {
  return text.replace(/^__|__$/g, "").trim();
}

/**
 * Heuristic fixes for DOCX-derived markdown, to repair structures like
 * the "Lending Category Summary" table which Mammoth emits as stacked rows.
 */
function normalizeDocxMarkdownTables(markdown: string): string {
  const lines = markdown.split("\n");
  const resultLines: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.includes("__Lending Category Summary:__")) {
      // Capture block until next heading or EOF
      const start = i;
      let end = i + 1;
      while (end < lines.length && !lines[end].startsWith("### ")) {
        end++;
      }

      const block = lines.slice(start, end);
      const nonEmpty = block.map((l) => l.trim()).filter((l) => l !== "");
      if (nonEmpty.length >= 4) {
        const title = nonEmpty[0];
        const headers = nonEmpty.slice(1, 4).map(stripBoldMarkdown);
        const cells = nonEmpty.slice(4);

        const rows: string[][] = [];
        for (let idx = 0; idx < cells.length; idx += 3) {
          const row = cells.slice(idx, idx + 3);
          if (row.length === 3) {
            rows.push(row);
          }
        }

        // Only rewrite if we got at least one full row
        if (rows.length > 0) {
          resultLines.push(title);
          resultLines.push("");
          resultLines.push(
            `| ${headers[0]} | ${headers[1]} | ${headers[2]} |`
          );
          resultLines.push("| --- | --- | --- |");
          for (const row of rows) {
            resultLines.push(`| ${row[0]} | ${row[1]} | ${row[2]} |`);
          }
          resultLines.push("");

          i = end;
          continue;
        }
      }
    }

    resultLines.push(line);
    i++;
  }

  return resultLines.join("\n");
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
  const normalized = normalizeDocxMarkdownTables(markdown);
  const parsed =
    parseMetadataBlock(normalized) ?? parseFallbackMetadata(normalized);

  const existingSlugs = await getResourceSlugs();
  const baseSlug = slugify(parsed.title);
  const slug = ensureUniqueSlug(baseSlug, existingSlugs);

  const heroImage = extractFirstImageFromMarkdown(normalized);

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
