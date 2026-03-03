import { bot } from "@/lib/bot";
import { after } from "next/server";

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  const update = JSON.parse(body);
  const text = update?.message?.text ?? update?.callback_query?.data ?? "(no text)";
  const type = update?.message ? "message" : update?.callback_query ? "callback" : "other";
  const vercelUrl = process.env.VERCEL_URL ?? "local";
  console.log("[webhook] Telegram", type, "VERCEL_URL=" + vercelUrl, "text:", String(text).slice(0, 100));

  const res = await bot.webhooks.telegram(
    new Request(request.url, { method: "POST", headers: request.headers, body }),
    {
      waitUntil: (promise) => after(() => promise),
    }
  );
  console.log("[webhook] Bot returned", res.status);
  return res;
}
