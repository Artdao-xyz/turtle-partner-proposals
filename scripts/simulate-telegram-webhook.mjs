#!/usr/bin/env node
/**
 * Simulate a Telegram webhook locally for debugging.
 *
 * Usage:
 *   npm run webhook:simulate "https://docs.google.com/document/d/xxx/edit"
 *
 * Add TELEGRAM_CHAT_ID to .env.local (get it from @userinfobot on Telegram).
 * Or pass as second arg: node scripts/simulate-telegram-webhook.mjs "url" 123456789
 *
 * Without a real chat ID, the bot will fail with "chat not found" when trying to reply.
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local so TELEGRAM_CHAT_ID is available
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.replace(/#.*$/, "").trim();
    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}
// DEBUG=1 enables Chat SDK debug logs (lock, routing, etc.)

const BASE = process.env.WEBHOOK_BASE ?? "http://localhost:3000";
const docUrl =
  (process.argv[2] ?? "https://docs.google.com/document/d/1abc123def456ghi789jkl/edit").replace(
    /\\/g,
    ""
  );
const chatId = process.env.TELEGRAM_CHAT_ID || process.argv[3] || "123456789";

const payload = {
  update_id: Math.floor(Math.random() * 1e9),
  message: {
    message_id: 1,
    from: {
      id: Number(chatId),
      is_bot: false,
      first_name: "Test",
      username: "testuser",
    },
    chat: {
      id: Number(chatId),
      type: "private",
      first_name: "Test",
      username: "testuser",
    },
    date: Math.floor(Date.now() / 1000),
    text: docUrl,
  },
};

async function main() {
  const url = `${BASE}/api/webhooks/telegram`;
  console.log("[simulate] POST", url);
  console.log("[simulate] Chat ID:", chatId, chatId === "123456789" ? "(fake - bot will fail to reply)" : "(real)");
  console.log("[simulate] Payload text:", payload.message.text);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log("[simulate] Response:", res.status, res.statusText);
  if (!res.ok) {
    const text = await res.text();
    console.error("[simulate] Body:", text);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[simulate] Error:", err.message);
  process.exit(1);
});
