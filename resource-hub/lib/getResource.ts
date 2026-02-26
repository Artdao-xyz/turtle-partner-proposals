import { readFile, readdir } from "fs/promises";
import { join } from "path";
import type { ResourceFrontmatter } from "./parse";
import { parseFrontmatter } from "./parse";

const CONTENT_DIR = join(process.cwd(), "resource-hub", "content");

export async function getResourceSlugs(): Promise<string[]> {
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getResourceContent(slug: string): Promise<string> {
  const filePath = join(CONTENT_DIR, `${slug}.md`);
  return readFile(filePath, "utf-8");
}

export async function getResourceBySlug(slug: string) {
  const content = await getResourceContent(slug);
  return content;
}

export const FILTER_OPTIONS = [
  "All",
  "Guides",
  "Playbooks",
  "Research",
  "Comparisons",
  "Updates",
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];

const ARTICLE_CATEGORIES = ["Guides", "Playbooks", "Research", "Comparisons", "Updates"];

export interface ResourceCardData {
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  category: string;
}

export async function getAllResources(): Promise<ResourceCardData[]> {
  const slugs = await getResourceSlugs();
  const resources: ResourceCardData[] = [];

  for (const slug of slugs) {
    const rawContent = await getResourceContent(slug);
    const { frontmatter } = parseFrontmatter(rawContent);
    const title = frontmatter.title || slug;
    const subtitle = frontmatter.subtitle || "";
    const category =
      frontmatter.category && ARTICLE_CATEGORIES.includes(frontmatter.category)
        ? frontmatter.category
        : "Research";
    resources.push({
      slug,
      title,
      subtitle,
      badge: frontmatter.badge,
      category,
    });
  }

  return resources;
}
