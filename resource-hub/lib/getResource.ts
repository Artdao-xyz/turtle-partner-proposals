import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { cache } from "react";
import { FILTER_OPTIONS } from "./constants";
import type { ResourceCardData } from "./types";
import { parseFrontmatter } from "./parse";
import {
  listBlobArticleSlugs,
  getBlobArticleContent,
} from "./storage";

const CONTENT_DIR = join(process.cwd(), "resource-hub", "content");

export type { ResourceCardData, FilterOption } from "./types";
export { FILTER_OPTIONS } from "./constants";

function useBlob(): boolean {
  return process.env.CONTENT_SOURCE === "blob";
}

export const getResourceSlugs = cache(async (): Promise<string[]> => {
  if (useBlob()) {
    return listBlobArticleSlugs();
  }
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
});

export const getResourceContent = cache(async (slug: string): Promise<string> => {
  if (useBlob()) {
    return getBlobArticleContent(slug);
  }
  const filePath = join(CONTENT_DIR, `${slug}.md`);
  return readFile(filePath, "utf-8");
});

const ARTICLE_CATEGORIES = FILTER_OPTIONS.filter((c) => c !== "All");

/** True if article should be visible (no date or publishedDate <= today, UTC). */
export function isPublished(publishedDate: string | undefined): boolean {
  if (!publishedDate?.trim()) return true;
  const date = publishedDate.trim().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  return date <= today;
}

export const getAllResources = cache(async (): Promise<ResourceCardData[]> => {
  const slugs = await getResourceSlugs();
  const resources: ResourceCardData[] = [];

  for (const slug of slugs) {
    const rawContent = await getResourceContent(slug);
    const { frontmatter } = parseFrontmatter(rawContent);
    if (!isPublished(frontmatter.publishedDate)) continue;

    const title = frontmatter.title || slug;
    const subtitle = frontmatter.subtitle || "";
    const category =
      frontmatter.category &&
      (ARTICLE_CATEGORIES as readonly string[]).includes(frontmatter.category)
        ? frontmatter.category
        : "Research";
    resources.push({
      slug,
      title,
      subtitle,
      badge: frontmatter.badge,
      category,
      heroImage: frontmatter.heroImage,
      publishedDate: frontmatter.publishedDate,
    });
  }

  return resources.sort((a, b) => {
    const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    return dateB - dateA;
  });
});
