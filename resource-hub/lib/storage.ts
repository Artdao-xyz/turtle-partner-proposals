import { writeFile } from "fs/promises";
import { join } from "path";
import { put, list, get } from "@vercel/blob";

/**
 * Storage abstraction for article content.
 * MVP: filesystem. Phase 1: Blob.
 */
export interface ArticleStorage {
  writeArticle(slug: string, content: string): Promise<void>;
  saveHeroImage(slug: string, data: Buffer, ext: string): Promise<string>;
}

const CONTENT_DIR = join(process.cwd(), "resource-hub", "content");
const IMAGES_DIR = join(process.cwd(), "public", "hub", "images");

const BLOB_ARTICLES_PREFIX = "hub/articles/";
const BLOB_IMAGES_PREFIX = "hub/images/";

export const filesystemStorage: ArticleStorage = {
  async writeArticle(slug: string, content: string): Promise<void> {
    const filePath = join(CONTENT_DIR, `${slug}.md`);
    await writeFile(filePath, content, "utf-8");
  },

  async saveHeroImage(slug: string, data: Buffer, ext: string): Promise<string> {
    const safeExt = ext === "jpeg" ? "jpg" : ext;
    const filename = `${slug}-hero.${safeExt}`;
    const filePath = join(IMAGES_DIR, filename);
    await writeFile(filePath, data);
    return filename;
  },
};

/** Prefix for hero image pathnames stored in frontmatter (private blob). */
export const BLOB_HERO_PREFIX = "blob:";

export const blobStorage: ArticleStorage = {
  async writeArticle(slug: string, content: string): Promise<void> {
    const pathname = `${BLOB_ARTICLES_PREFIX}${slug}.md`;
    await put(pathname, content, {
      access: "private",
      contentType: "text/markdown",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  },

  async saveHeroImage(slug: string, data: Buffer, ext: string): Promise<string> {
    const safeExt = ext === "jpeg" ? "jpg" : ext;
    const pathname = `${BLOB_IMAGES_PREFIX}${slug}-hero.${safeExt}`;
    await put(pathname, data, {
      access: "private",
      contentType: `image/${safeExt}`,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return `${BLOB_HERO_PREFIX}${pathname}`;
  },
};

/** Returns the active storage based on CONTENT_SOURCE env. Defaults to filesystem. */
export function getStorage(): ArticleStorage {
  const source = process.env.CONTENT_SOURCE;
  if (source === "blob") return blobStorage;
  return filesystemStorage;
}

/** Blob-only: list article slugs. */
export async function listBlobArticleSlugs(): Promise<string[]> {
  const { blobs } = await list({ prefix: BLOB_ARTICLES_PREFIX, limit: 1000 });
  return blobs
    .filter((b) => b.pathname.endsWith(".md"))
    .map((b) => b.pathname.replace(BLOB_ARTICLES_PREFIX, "").replace(/\.md$/, ""));
}

/** Blob-only: fetch article content by slug. */
export async function getBlobArticleContent(slug: string): Promise<string> {
  const pathname = `${BLOB_ARTICLES_PREFIX}${slug}.md`;
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode === 304 || !result.stream) {
    throw new Error(`Article not found: ${slug}`);
  }
  return await new Response(result.stream).text();
}
