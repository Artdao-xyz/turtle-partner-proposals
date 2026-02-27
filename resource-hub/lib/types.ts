import type { FilterOption } from "./constants";

export interface ResourceCardData {
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  category: string;
  heroImage?: string;
  publishedDate?: string;
}

export type { FilterOption };
