import { readFile } from "fs/promises";
import { join } from "path";
import type { ResourceFrontmatter } from "./parse";

const CONTENT_DIR = join(process.cwd(), "resource-hub", "content");

export async function getResourceContent(slug: string): Promise<string> {
  const filePath = join(CONTENT_DIR, `${slug}.md`);
  return readFile(filePath, "utf-8");
}

export async function getResourceBySlug(slug: string) {
  const content = await getResourceContent(slug);
  return content;
}
