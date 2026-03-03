import { bot } from "@/lib/bot";
import { after } from "next/server";

export async function POST(request: Request): Promise<Response> {
  const body = await request.clone().json().catch(() => ({}));
  console.log("[webhook] Telegram update received", body?.message?.text?.slice(0, 80) ?? "(no text)");
  return bot.webhooks.telegram(request, {
    waitUntil: (promise) => after(() => promise),
  });
}
