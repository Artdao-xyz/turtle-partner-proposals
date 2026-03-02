import { z } from "zod";
import { ARTICLE_CATEGORIES } from "./constants";

export interface SourceItem {
  title: string;
  url?: string;
  author: string;
  year?: string;
}

export const SourceSchema = z.object({
  title: z.string(),
  url: z.string().optional(),
  author: z.string(),
  year: z.string().optional(),
});

export const ArticlePublishSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1),
  subtitle: z.string(),
  category: z.enum(ARTICLE_CATEGORIES),
  body: z.string(),
  publishedDate: z.string().optional(),
  heroImage: z.string().optional(),
  sources: z.array(SourceSchema).optional(),
});

export type ArticlePublishPayload = z.infer<typeof ArticlePublishSchema>;
