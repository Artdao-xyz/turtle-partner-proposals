export const FILTER_OPTIONS = [
  "All",
  "Guides",
  "Playbooks",
  "Research",
  "Comparisons",
  "Updates",
  "Benchmark",
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];

/** Article categories (FILTER_OPTIONS minus "All") - used by upload, publish, Phase 1 API */
export const ARTICLE_CATEGORIES = [
  "Benchmark",
  "Guides",
  "Playbooks",
  "Research",
  "Comparisons",
  "Updates",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];
