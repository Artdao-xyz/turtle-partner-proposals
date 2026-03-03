import { Chat, type Thread, Card, CardText, Actions, Button, LinkButton } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";

const GOOGLE_DOC_URL_REGEX =
  /https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)(?:\/edit)?(?:\?[^/]*)?/;

function getBaseUrl(): string {
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypass) headers["x-vercel-protection-bypass"] = bypass;
  return headers;
}

function apiUrl(path: string): string {
  const base = getBaseUrl();
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const url = `${base}${path}`;
  if (bypass) return `${url}${path.includes("?") ? "&" : "?"}x-vercel-protection-bypass=${encodeURIComponent(bypass)}`;
  return url;
}

async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("[bot] API returned non-JSON:", text.slice(0, 200));
    return null;
  }
}

export const bot = new Chat({
  userName: process.env.TELEGRAM_BOT_USERNAME ?? "turtle_publish_bot",
  adapters: {
    telegram: createTelegramAdapter(),
  },
  state: createRedisState(),
  logger: process.env.DEBUG ? "debug" : "info",
});

async function handleDocUrl(thread: Thread, text: string) {
  const docMatch = text.match(GOOGLE_DOC_URL_REGEX);
  if (!docMatch) {
    await thread.post(
      "Send me a Google Doc URL to publish. Example:\nhttps://docs.google.com/document/d/xxx/edit"
    );
    return;
  }

  const docUrl = docMatch[0];
  const baseUrl = getBaseUrl();
  console.log("[bot] Processing doc URL:", docUrl, "baseUrl:", baseUrl);

  try {
    await thread.startTyping();

    const headers = getApiHeaders();
    const convertUrl = apiUrl("/api/article-upload/convert");
    console.log("[bot] Fetching convert:", convertUrl.replace(/x-vercel-protection-bypass=[^&]+/, "x-vercel-protection-bypass=***"));
    const convertRes = await fetch(convertUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ docUrl }),
    });

    console.log("[bot] Convert response:", convertRes.status);

    if (!convertRes.ok) {
      const err = await safeJson<{ error?: string }>(convertRes);
      await thread.post(`Conversion failed: ${err?.error ?? convertRes.statusText}`);
      return;
    }

    const convertData = await safeJson<{
      slug: string;
      frontmatter: { title: string; subtitle?: string; category?: string; publishedDate?: string; sources?: unknown[] };
      body: string;
      heroImage?: string;
    }>(convertRes);
    if (!convertData) {
      await thread.post("Conversion failed: invalid response from server");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const draftPayload = {
      slug: convertData.slug,
      title: convertData.frontmatter.title,
      subtitle: convertData.frontmatter.subtitle,
      category: convertData.frontmatter.category ?? "Research",
      body: convertData.body,
      publishedDate: convertData.frontmatter.publishedDate ?? today,
      heroImage: convertData.heroImage ?? undefined,
      sources: convertData.frontmatter.sources ?? [],
    };

    const draftRes = await fetch(apiUrl("/api/article-upload/draft"), {
      method: "POST",
      headers,
      body: JSON.stringify(draftPayload),
    });

    console.log("[bot] Draft response:", draftRes.status);

    if (!draftRes.ok) {
      const err = await safeJson<{ error?: string }>(draftRes);
      await thread.post(`Failed to save draft: ${err?.error ?? draftRes.statusText}`);
      return;
    }

    const draftResult = await safeJson<{ previewId: string; previewUrl: string }>(draftRes);
    if (!draftResult) {
      await thread.post("Failed to save draft: invalid response from server");
      return;
    }
    const { previewId, previewUrl } = draftResult;
    console.log("[bot] Draft saved, previewUrl:", previewUrl);

    // Telegram rejects localhost URLs for inline keyboard buttons (must be HTTPS + public)
    const isPublicUrl = previewUrl.startsWith("https://") && !previewUrl.includes("localhost");

    const actionButtons = [
      ...(isPublicUrl
        ? [
            LinkButton({
              url: previewUrl,
              label: "View preview",
              style: "primary",
            }),
          ]
        : []),
      Button({
        id: "publish",
        label: "Publish",
        style: "primary",
        value: previewId,
      }),
      Button({
        id: "cancel",
        label: "Cancel",
        style: "danger",
        value: previewId,
      }),
    ];

    await thread.post(
      Card({
        title: "Draft ready",
        subtitle: convertData.frontmatter.title,
        children: [
          CardText(`Preview: ${previewUrl}`),
          Actions(actionButtons),
        ],
      })
    );
  } catch (err) {
    console.error("[bot] publish flow error:", err);
    await thread.post(
      `Something went wrong: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

bot.onNewMessage(/^\/start/, async (thread) => {
  console.log("[bot] /start received");
  await thread.post(
    "Send me a Google Doc URL to publish.\n\nExample:\nhttps://docs.google.com/document/d/xxx/edit"
  );
});

bot.onNewMention(async (thread, message) => {
  const text = message.text?.trim() ?? "";
  console.log("[bot] onNewMention, text:", text?.slice(0, 80));
  await handleDocUrl(thread, text);
});

bot.onNewMessage(GOOGLE_DOC_URL_REGEX, async (thread, message) => {
  const text = message.text?.trim() ?? "";
  console.log("[bot] onNewMessage (doc URL match), text:", text?.slice(0, 80));
  await handleDocUrl(thread, text);
});

bot.onAction("publish", async (event) => {
  const previewId = event.value;
  if (!previewId) {
    await event.thread.post("Invalid preview. Please try again.");
    return;
  }

  const baseUrl = getBaseUrl();

  try {
    await event.thread.startTyping();

    const res = await fetch(apiUrl("/api/article-upload/publish-draft"), {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({ previewId }),
    });

    if (!res.ok) {
      const err = await res.json();
      await event.thread.post(`Publish failed: ${err.error ?? res.statusText}`);
      return;
    }

    const { slug, url } = await res.json();
    const fullUrl = `${baseUrl}${url}`;

    await event.thread.post(
      Card({
        title: "Published!",
        subtitle: slug,
        children: [
          CardText(`Article is live.`),
          Actions([
            LinkButton({
              url: fullUrl,
              label: "View article",
              style: "primary",
            }),
          ]),
        ],
      })
    );
  } catch (err) {
    console.error("[bot] publish action error:", err);
    await event.thread.post(
      `Publish failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
});

bot.onAction("cancel", async (event) => {
  const previewId = event.value;
  if (!previewId) {
    await event.thread.post("Invalid preview. Please try again.");
    return;
  }

  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(apiUrl("/api/article-upload/draft"), {
      method: "DELETE",
      headers: getApiHeaders(),
      body: JSON.stringify({ previewId }),
    });

    if (res.ok) {
      await event.thread.post("Draft discarded.");
    } else {
      const err = await res.json();
      await event.thread.post(`Failed to delete draft: ${err.error ?? res.statusText}`);
    }
  } catch (err) {
    console.error("[bot] cancel action error:", err);
    await event.thread.post(
      `Failed to discard: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
});
