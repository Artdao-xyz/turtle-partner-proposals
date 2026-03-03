import { writeFile } from "fs/promises";
import { join } from "path";
import { put, list, get, del, copy } from "@vercel/blob";

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
const BLOB_DRAFTS_PREFIX = "hub/drafts/";
const BLOB_DRAFT_IMAGES_PREFIX = "hub/drafts/images/";

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

/** Blob-only: write draft. */
export async function writeBlobDraft(previewId: string, content: string): Promise<void> {
  const pathname = `${BLOB_DRAFTS_PREFIX}${previewId}.md`;
  await put(pathname, content, {
    access: "private",
    contentType: "text/markdown",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

/** Blob-only: save draft hero image. Returns blob:path for frontmatter. */
export async function saveBlobDraftHeroImage(
  previewId: string,
  data: Buffer,
  ext: string
): Promise<string> {
  const safeExt = ext === "jpeg" ? "jpg" : ext;
  const pathname = `${BLOB_DRAFT_IMAGES_PREFIX}${previewId}-hero.${safeExt}`;
  await put(pathname, data, {
    access: "private",
    contentType: `image/${safeExt}`,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return `${BLOB_HERO_PREFIX}${pathname}`;
}

/** Blob-only: fetch draft content. */
export async function getBlobDraftContent(previewId: string): Promise<string> {
  const pathname = `${BLOB_DRAFTS_PREFIX}${previewId}.md`;
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode === 304 || !result.stream) {
    throw new Error(`Draft not found: ${previewId}`);
  }
  return await new Response(result.stream).text();
}

/** Blob-only: publish draft to articles, then delete draft. */
export async function publishBlobDraft(previewId: string): Promise<{ slug: string }> {
  const rawContent = await getBlobDraftContent(previewId);
  const slugMatch = rawContent.match(/slug:\s*["']?([a-z0-9-]+)["']?/);
  const slug = slugMatch?.[1];
  if (!slug) throw new Error("Draft missing slug in frontmatter");

  let content = rawContent;
  const heroMatch = rawContent.match(/heroImage:\s*"blob:(hub\/drafts\/images\/[^"]+)"/);
  if (heroMatch) {
    const draftHeroPath = heroMatch[1];
    const safeExt = draftHeroPath.split(".").pop() ?? "png";
    const destPath = `${BLOB_IMAGES_PREFIX}${slug}-hero.${safeExt}`;
    await copy(draftHeroPath, destPath, { access: "private" });
    content = content.replace(
      new RegExp(`heroImage:\\s*"blob:${draftHeroPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`),
      `heroImage: "${BLOB_HERO_PREFIX}${destPath}"`
    );
  }

  await put(`${BLOB_ARTICLES_PREFIX}${slug}.md`, content, {
    access: "private",
    contentType: "text/markdown",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  const { blobs } = await list({ prefix: `${BLOB_DRAFTS_PREFIX}${previewId}`, limit: 10 });
  if (blobs.length) await del(blobs.map((b) => b.pathname));

  return { slug };
}

/** Blob-only: delete draft and its images. */
export async function deleteBlobDraft(previewId: string): Promise<void> {
  const { blobs } = await list({ prefix: BLOB_DRAFTS_PREFIX, limit: 100 });
  const toDelete = blobs.filter(
    (b) => b.pathname === `${BLOB_DRAFTS_PREFIX}${previewId}.md` || b.pathname.startsWith(`${BLOB_DRAFT_IMAGES_PREFIX}${previewId}-`)
  );
  if (toDelete.length) await del(toDelete.map((b) => b.pathname));
}
