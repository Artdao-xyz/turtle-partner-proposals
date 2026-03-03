import { Chat, Card, CardText, Actions, Button, LinkButton } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";

const GOOGLE_DOC_URL_REGEX =
  /https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)(?:\/edit)?(?:\?[^/]*)?/;

function getBaseUrl(): string {
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export const bot = new Chat({
  userName: process.env.TELEGRAM_BOT_USERNAME ?? "turtle_publish_bot",
  adapters: {
    telegram: createTelegramAdapter(),
  },
  state: createRedisState(),
  logger: "info",
});

async function handleDocUrl(thread: { post: (msg: unknown) => Promise<unknown>; startTyping: () => Promise<void> }, text: string) {
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

    const convertRes = await fetch(`${baseUrl}/api/article-upload/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docUrl }),
    });

    console.log("[bot] Convert response:", convertRes.status);

    if (!convertRes.ok) {
      const err = await convertRes.json();
      await thread.post(`Conversion failed: ${err.error ?? convertRes.statusText}`);
      return;
    }

    const convertData = await convertRes.json();
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

    const draftRes = await fetch(`${baseUrl}/api/article-upload/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftPayload),
    });

    console.log("[bot] Draft response:", draftRes.status);

    if (!draftRes.ok) {
      const err = await draftRes.json();
      await thread.post(`Failed to save draft: ${err.error ?? draftRes.statusText}`);
      return;
    }

    const { previewId, previewUrl } = await draftRes.json();
    console.log("[bot] Draft saved, previewUrl:", previewUrl);

    await thread.post(
      Card({
        title: "Draft ready",
        subtitle: convertData.frontmatter.title,
        children: [
          CardText(`Preview: ${previewUrl}`),
          Actions([
            LinkButton({
              url: previewUrl,
              label: "View preview",
              style: "primary",
            }),
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
          ]),
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

    const res = await fetch(`${baseUrl}/api/article-upload/publish-draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${baseUrl}/api/article-upload/draft`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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
