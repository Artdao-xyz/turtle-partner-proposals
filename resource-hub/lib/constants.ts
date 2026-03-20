export const FILTER_OPTIONS = [
  "All",
  "Guides",
  "Usecases",
  "Research",
  "Comparisons",
  "Updates",
  "Benchmark",
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];

/** Article categories (FILTER_OPTIONS minus "All") - used by upload, publish, Phase 1 API */
export const ARTICLE_CATEGORIES = [
  "Benchmark",
  "Usecases",
  "Guides",
  "Research",
  "Comparisons",
  "Updates",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

const LEGACY_CATEGORY_ALIASES: Record<string, ArticleCategory> = {
  Playbooks: "Usecases",
  Playbook: "Usecases",
  "Case Studies": "Usecases",
};

export function normalizeArticleCategory(category?: string): ArticleCategory {
  if (!category?.trim()) return "Research";
  const exact = ARTICLE_CATEGORIES.find((c) => c.toLowerCase() === category.toLowerCase());
  if (exact) return exact;
  const legacy = LEGACY_CATEGORY_ALIASES[category];
  if (legacy) return legacy;
  return "Research";
}
