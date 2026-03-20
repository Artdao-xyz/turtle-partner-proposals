import type { ResourceFrontmatter } from "./parse";
import { toPublicSlug } from "./slug-aliases";

const CATEGORY_SEGMENT_MAP: Record<string, string> = {
  Research: "research",
  Guides: "guides",
  Usecases: "usecases",
  "Case Studies": "usecases",
  Playbooks: "usecases",
  Comparisons: "comparisons",
  Updates: "updates",
  Benchmark: "benchmarks",
};

function toSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function categoryToSegment(category?: string): string {
  if (!category?.trim()) return "research";
  return CATEGORY_SEGMENT_MAP[category] ?? toSegment(category);
}

export function buildArticlePathFromFrontmatter(
  slug: string,
  frontmatter: Pick<ResourceFrontmatter, "category">
): string {
  return buildArticlePath(slug, frontmatter.category);
}

export function buildArticlePath(slug: string, category?: string): string {
  return `/blog/${categoryToSegment(category)}/${toPublicSlug(slug)}`;
}

