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
