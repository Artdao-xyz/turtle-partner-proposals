import { randomBytes } from "crypto";
import { Chat, type Thread, Card, CardText, Actions, Button, LinkButton } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";
import { kv } from "@vercel/kv";

const GOOGLE_DOC_URL_REGEX =
  /https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)(?:\/edit)?(?:\?[^/]*)?/;

/** Matches hub article URL (full or path). Captures slug. */
const HUB_ARTICLE_REGEX = /(?:https?:\/\/[^/\s]+)?\/resource-hub\/([a-z0-9-]+)/;

/** Matches /delete <slug or url>. */
const DELETE_CMD_REGEX = /^\/delete\s+(.+)$/;

function getBaseUrl(): string {
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypass) headers["x-vercel-protection-bypass"] = bypass;
  const editorToken = process.env.INTERNAL_EDITOR_TOKEN;
  if (editorToken) headers["x-internal-editor-token"] = editorToken;
  return headers;
}

function apiUrl(path: string): string {
  const base = getBaseUrl();
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const url = `${base}${path}`;
  if (bypass) return `${url}${path.includes("?") ? "&" : "?"}x-vercel-protection-bypass=${encodeURIComponent(bypass)}`;
  return url;
}

function getAllowedUserIds(): string[] {
  const raw = process.env.TELEGRAM_ALLOWED_USER_IDS;
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function isAllowedUser(author: { userId: string; userName?: string }): boolean {
  const allowed = getAllowedUserIds();
  if (allowed.length === 0) return true;
  return allowed.some(
    (id) => id === author.userId || id === author.userName || id === `@${author.userName}`
  );
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

const DELETE_PENDING_PREFIX = "bot:del:";
const DELETE_PENDING_TTL = 300; // 5 min

function shortId(): string {
  return randomBytes(4).toString("hex");
}

async function storeDeletePending(slug: string): Promise<string> {
  const id = shortId();
  await kv.setex(`${DELETE_PENDING_PREFIX}${id}`, DELETE_PENDING_TTL, slug);
  return id;
}

async function getDeletePending(id: string): Promise<string | null> {
  const slug = await kv.get<string>(`${DELETE_PENDING_PREFIX}${id}`);
  return slug ?? null;
}

function extractSlugFromMessage(text: string): string | null {
  const hubMatch = text.match(HUB_ARTICLE_REGEX);
  if (hubMatch) return hubMatch[1];

  const deleteMatch = text.match(DELETE_CMD_REGEX);
  if (deleteMatch) {
    const arg = deleteMatch[1].trim();
    const fromUrl = arg.match(HUB_ARTICLE_REGEX);
    if (fromUrl) return fromUrl[1];
    const slug = arg.replace(/[^a-z0-9-]/g, "");
    return slug || null;
  }
  return null;
}

async function handleDeleteFlow(thread: Thread, slug: string) {
  try {
    const res = await fetch(apiUrl("/api/article-upload/unpublish"), {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({ slug, preview: true }),
    });

    if (res.status === 404) {
      await thread.post("Article not found.");
      return;
    }
    if (res.status === 409) {
      await thread.post("Article is already unpublished.");
      return;
    }
    if (!res.ok) {
      const err = await safeJson<{ error?: string }>(res);
      await thread.post(`Error: ${err?.error ?? res.statusText}`);
      return;
    }

    const data = await safeJson<{ title: string }>(res);
    if (!data) {
      await thread.post("Invalid response from server.");
      return;
    }

    const token = await storeDeletePending(slug);

    await thread.post(
      Card({
        title: "Unpublish article?",
        subtitle: data.title,
        children: [
          CardText("Article will be hidden from the hub. You can restore it later."),
          Actions([
            Button({ id: "delete", label: "Unpublish", style: "danger", value: token }),
            Button({ id: "cancel-delete", label: "Cancel", value: token }),
          ]),
        ],
      })
    );
  } catch (err) {
    console.error("[bot] delete flow error:", err);
    await thread.post(
      `Something went wrong: ${err instanceof Error ? err.message : "Unknown error"}`
    );
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

async function handleDocxFile(thread: Thread, fileUrl: string, fileName?: string | null) {
  const baseUrl = getBaseUrl();
  console.log("[bot] Processing DOCX file:", fileName ?? "(no name)", "baseUrl:", baseUrl);

  try {
    await thread.startTyping();

    const headers = getApiHeaders();
    const convertUrl = apiUrl(
      `/api/article-upload/convert-docx?fileUrl=${encodeURIComponent(fileUrl)}`
    );
    console.log(
      "[bot] Fetching convert-docx:",
      convertUrl.replace(/x-vercel-protection-bypass=[^&]+/, "x-vercel-protection-bypass=***")
    );
    const convertRes = await fetch(convertUrl, {
      method: "POST",
      headers,
    });

    console.log("[bot] Convert-docx response:", convertRes.status);

    if (!convertRes.ok) {
      const err = await safeJson<{ error?: string }>(convertRes);
      await thread.post(`DOCX conversion failed: ${err?.error ?? convertRes.statusText}`);
      return;
    }

    const convertData = await safeJson<{
      slug: string;
      frontmatter: {
        title: string;
        subtitle?: string;
        category?: string;
        publishedDate?: string;
        sources?: unknown[];
      };
      body: string;
      heroImage?: string;
    }>(convertRes);
    if (!convertData) {
      await thread.post("DOCX conversion failed: invalid response from server");
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

    console.log("[bot] Draft (from DOCX) response:", draftRes.status);

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
    console.log("[bot] Draft (from DOCX) saved, previewUrl:", previewUrl);

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
        title: "Draft ready (from DOCX)",
        subtitle: convertData.frontmatter.title,
        children: [
          CardText(`Preview: ${previewUrl}`),
          Actions(actionButtons),
        ],
      })
    );
  } catch (err) {
    console.error("[bot] DOCX publish flow error:", err);
    await thread.post(
      `Something went wrong: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

bot.onNewMessage(/^\/start/, async (thread, message) => {
  if (!isAllowedUser(message.author)) {
    await thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
  console.log("[bot] /start received");
  await thread.post(
    "Send me a Google Doc URL to publish.\n\nExample:\nhttps://docs.google.com/document/d/xxx/edit"
  );
});

// Handle DOCX uploads (Telegram adapter exposes files array).
// Use a catch-all pattern so this runs for any message, and bail out
// early if there are no files.
bot.onNewMessage(/.*/, async (thread, message) => {
  if (!isAllowedUser(message.author)) {
    await thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }

  const files: any[] | undefined = (message as any).files;
  if (!files || files.length === 0) return;

  const docx = files.find((f) => {
    const name = (f.name as string | undefined) ?? "";
    const mime = (f.mimeType as string | undefined) ?? "";
    return name.toLowerCase().endsWith(".docx") ||
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  });

  if (!docx) return;

  const fileUrl = (docx.url as string | undefined) ?? (docx.href as string | undefined);
  if (!fileUrl) {
    console.warn("[bot] DOCX file detected but no URL/href available on file object");
    await thread.post("I received a DOCX file but couldn't access its contents.");
    return;
  }

  await handleDocxFile(thread, fileUrl, (docx.name as string | undefined) ?? null);
});

bot.onNewMention(async (thread, message) => {
  if (!isAllowedUser(message.author)) {
    await thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
  const text = message.text?.trim() ?? "";
  console.log("[bot] onNewMention, text:", text?.slice(0, 80));
  await handleDocUrl(thread, text);
});

bot.onNewMessage(GOOGLE_DOC_URL_REGEX, async (thread, message) => {
  if (!isAllowedUser(message.author)) {
    await thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
  const text = message.text?.trim() ?? "";
  console.log("[bot] onNewMessage (doc URL match), text:", text?.slice(0, 80));
  await handleDocUrl(thread, text);
});

// Delete flow: hub URL or /delete <slug|url>
const DELETE_TRIGGER_REGEX = /(?:\/resource-hub\/[a-z0-9-]+|\/delete\s)/;
bot.onNewMessage(DELETE_TRIGGER_REGEX, async (thread, message) => {
  if (!isAllowedUser(message.author)) {
    await thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
  const text = message.text?.trim() ?? "";
  const slug = extractSlugFromMessage(text);
  if (!slug) return;
  console.log("[bot] onNewMessage (delete trigger), slug:", slug);
  await handleDeleteFlow(thread, slug);
});

bot.onAction("publish", async (event) => {
  if (!isAllowedUser(event.user)) {
    await event.thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
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
  if (!isAllowedUser(event.user)) {
    await event.thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
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

bot.onAction("delete", async (event) => {
  if (!isAllowedUser(event.user)) {
    await event.thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
  const token = event.value;
  if (!token) {
    await event.thread.post("Invalid article. Please try again.");
    return;
  }
  const slug = await getDeletePending(token);
  if (!slug) {
    await event.thread.post("Session expired. Send the article URL or /delete <slug> again.");
    return;
  }

  try {
    await event.thread.startTyping();

    const res = await fetch(apiUrl("/api/article-upload/unpublish"), {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({ slug }),
    });

    if (res.status === 404) {
      await event.thread.post("Article not found.");
      return;
    }
    if (res.status === 409) {
      await event.thread.post("Article is already unpublished.");
      return;
    }
    if (!res.ok) {
      const err = await safeJson<{ error?: string }>(res);
      await event.thread.post(`Unpublish failed: ${err?.error ?? res.statusText}`);
      return;
    }

    const data = await safeJson<{ title: string }>(res);
    await event.thread.post(`Unpublished: ${data?.title ?? slug}`);
  } catch (err) {
    console.error("[bot] delete action error:", err);
    await event.thread.post(
      `Unpublish failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
});

bot.onAction("cancel-delete", async (event) => {
  if (!isAllowedUser(event.user)) {
    await event.thread.post("You're not on the publisher waitlist. Contact the team to get access.");
    return;
  }
  await event.thread.post("Cancelled.");
});
