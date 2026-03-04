#!/usr/bin/env node
/**
 * Empty the Vercel Blob store (hub/articles, hub/images, hub/drafts).
 * Requires BLOB_READ_WRITE_TOKEN in .env.local.
 *
 * Usage: node scripts/empty-blob.mjs
 */

import { list, del } from "@vercel/blob";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.replace(/#.*$/, "").trim();
    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN not set. Add it to .env.local");
    process.exit(1);
  }

  const allPathnames = [];
  let cursor;

  do {
    const result = await list({ prefix: "hub/", limit: 1000, cursor });
    for (const blob of result.blobs) {
      allPathnames.push(blob.pathname);
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  if (allPathnames.length === 0) {
    console.log("Blob store is already empty.");
    return;
  }

  console.log(`Deleting ${allPathnames.length} blob(s)...`);
  await del(allPathnames);
  console.log("Done. Blob store emptied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
