/**
 * Storage slug -> public slug aliases for legacy long slugs.
 *
 * Fill this map when you want to shorten old URLs without renaming blob/file keys.
 * Example:
 *  "very-long-old-storage-slug": "short-clean-public-slug"
 */
export const STORAGE_TO_PUBLIC_SLUG: Record<string, string> = {
  "avalanche-awakening-deploying-84-5m-in-concentrated-liquidity-across-three-core-markets":
    "avalanche-84m-concentrated-liquidity",
  "the-complete-guide-to-defi-incentive-infrastructure-2":
    "defi-incentive-infrastructure-guide",
  "the-mercenary-capital-problem-why-70-of-incentivized-tvl-leaves-within-30-days":
    "mercenary-capital-problem",
  "cost-per-tvl-benchmarks-what-defi-protocols-actually-pay-for-liquidity-3":
    "cost-per-tvl-benchmarks",
};

const PUBLIC_TO_STORAGE_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(STORAGE_TO_PUBLIC_SLUG).map(([storageSlug, publicSlug]) => [
    publicSlug,
    storageSlug,
  ])
);

export function toPublicSlug(storageSlug: string): string {
  return STORAGE_TO_PUBLIC_SLUG[storageSlug] ?? storageSlug;
}

export function toStorageSlug(pathSlug: string): string | null {
  return PUBLIC_TO_STORAGE_SLUG[pathSlug] ?? null;
}

