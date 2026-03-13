#!/usr/bin/env node
/**
 * Quick helper to inspect how Mammoth converts a DOCX.
 *
 * Usage:
 *   node scripts/inspect-docx.mjs path/to/file.docx
 */

import { readFile } from "fs/promises";
import { resolve } from "path";
import mammoth from "mammoth";

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: node scripts/inspect-docx.mjs path/to/file.docx");
    process.exit(1);
  }

  const filePath = resolve(process.cwd(), input);
  console.log("[inspect-docx] Reading:", filePath);

  const buffer = await readFile(filePath);

  // Use any-cast compatible with plain JS to access convertToMarkdown
  const mammothAny = /** @type {any} */ (mammoth);
  const { value: markdown } = await mammothAny.convertToMarkdown({ buffer });
  const { value: html } = await mammoth.convertToHtml({ buffer });

  console.log("\n===== MARKDOWN OUTPUT =====\n");
  console.log(markdown);

  console.log("\n===== HTML OUTPUT =====\n");
  console.log(html);
}

main().catch((err) => {
  console.error("[inspect-docx] Error:", err);
  process.exit(1);
});

