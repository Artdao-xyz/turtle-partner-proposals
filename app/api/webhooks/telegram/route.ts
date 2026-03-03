import { bot } from "@/lib/bot";
import { after } from "next/server";

export async function POST(request: Request): Promise<Response> {
  return bot.webhooks.telegram(request, {
    waitUntil: (promise) => after(() => promise),
  });
}
