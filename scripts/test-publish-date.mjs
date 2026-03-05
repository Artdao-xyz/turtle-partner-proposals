#!/usr/bin/env node
/**
 * Test isPublished logic without running the full app.
 * Run: node scripts/test-publish-date.mjs
 */

function isPublished(publishedDate) {
  if (!publishedDate?.trim()) return true;
  const date = publishedDate.trim().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  return date <= today;
}

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const future = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

const cases = [
  [undefined, true, "no date"],
  ["", true, "empty string"],
  ["  ", true, "whitespace only"],
  [today, true, "today"],
  [yesterday, true, "yesterday"],
  [tomorrow, false, "tomorrow"],
  [future, false, "future date (30d)"],
  ["2020-01-01", true, "past date"],
  ["2025-03-15", today >= "2025-03-15", "2025-03-15 vs today"],
];

console.log("Today (UTC):", today);
console.log("");
console.log("isPublished() tests:");
console.log("─".repeat(50));

let passed = 0;
for (const [input, expected, label] of cases) {
  const result = isPublished(input);
  const ok = result === expected;
  if (ok) passed++;
  const status = ok ? "✓" : "✗";
  console.log(`${status} ${label.padEnd(20)} → ${result} (expected ${expected})`);
}

console.log("─".repeat(50));
console.log(`${passed}/${cases.length} passed`);
process.exit(passed === cases.length ? 0 : 1);
