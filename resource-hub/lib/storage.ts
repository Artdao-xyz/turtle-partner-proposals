import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * Storage abstraction for article content.
 * MVP: filesystem. Phase 1: swap to Blob.
 */
export interface ArticleStorage {
  writeArticle(slug: string, content: string): Promise<void>;
  saveHeroImage(slug: string, data: Buffer, ext: string): Promise<string>;
}

const CONTENT_DIR = join(process.cwd(), "resource-hub", "content");
const IMAGES_DIR = join(process.cwd(), "public", "hub", "images");

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
