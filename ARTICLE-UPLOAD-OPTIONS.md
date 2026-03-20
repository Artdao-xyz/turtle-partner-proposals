# Article Upload & Auto-Publish — Agent + Blob (Option 3)

**Stack:** Vercel Blob, Redis (Upstash), AI SDK, Chat SDK. Send Google Doc link to agent → Preview → Publish.

**Chat SDK vs AI SDK (different):**
- **Chat SDK** (`chat`, `@chat-adapter/discord`, `@chat-adapter/telegram`): Platform integration — receives messages, posts replies, buttons, thread state. [chat-sdk.dev](https://chat-sdk.dev/docs)
- **AI SDK** (`ai`): LLM integration — `generateText` for markdown conversion + extraction. [ai-sdk.dev](https://ai-sdk.dev/docs/introduction)
- They work together: Chat SDK can stream AI SDK responses.

---

## UX Flow

| Step | User | System |
|------|------|--------|
| **Upload** | Sends Doc URL to agent (Telegram or Discord) | Agent fetches doc, converts to markdown, prompts for slug/category |
| **Preview** | Clicks preview link, reviews in browser | Draft stored in Blob; preview route serves it |
| **Publish** | Clicks Approve (or replies "publish") | Agent promotes draft to live; revalidates |

---

## MVP (Validate with Client)

**Goal:** Test conversion quality and publish flow before building the full bot + Blob stack.

**Scope:** Web form only. No Chat SDK, no Blob, no Redis.

| Step | What | Details |
|------|------|---------|
| 1 | **Page** | `/resource-hub/upload` — form: paste Google Doc URL. |
| 2 | **Fetch** | Extract doc ID, fetch `export?format=html`. If 403: show "Set sharing to anyone with link can view." |
| 3 | **Convert** | LLM: HTML → markdown + frontmatter. Same prompt as full plan. |
| 4 | **Preview** | Show rendered article (reuse ArticleLayoutTemplate). Editable slug, category. |
| 5 | **Publish** | Button writes to `resource-hub/content/{slug}.md` and `public/hub/images/` (filesystem, same as today). Revalidate. |

**Stack:** Next.js, AI SDK. No new services.

**Validates:** Conversion quality, preview UX, whether publish flow is useful. If yes → add bot (Phase 3) and Blob (Phase 1).

**MVP images:** Option A: Skip (text only, fastest). Option B: Extract from HTML, save to `public/hub/images/` on publish.

**Effort:** ~1–2 days.

**Implemented:** Branch `feat/article-upload-mvp`. Add `ANTHROPIC_API_KEY` to `.env.local`. Visit `/resource-hub/upload`.

**MVP storage:** Writes to `resource-hub/content/{slug}.md` (filesystem). Works locally. **On Vercel prod, the app filesystem is read-only at runtime** — writes would fail. For production, use Blob (Phase 1) or a DB. The full plan migrates to Blob.

---

## Action Plan

### Phase 1: Storage & API

| # | Task | Details |
|---|------|---------|
| 1.1 | **Vercel Blob** | Create store. Paths: `articles/{slug}.md`, `articles/images/{slug}-{index}.{ext}` (0=hero), `drafts/{previewId}.md`, `drafts/images/{previewId}-{index}.{ext}`. |
| 1.2 | **Redis** | Store draft state: `draft:{previewId}` → `{ slug, userId, platform, threadId, createdAt }`. TTL 24h. Use Upstash Redis (Vercel KV sunset Dec 2024). |
| 1.3 | **POST /api/articles** | Accept JSON: slug, title, subtitle, category, publishedDate, heroImage (base64 or URL), body, sources?, disclaimer?, `draft=true`, `previewId?` (agent generates before upload for image paths). Validate, write to Blob `drafts/` or `articles/`. Return previewId. Require API auth (same as publish). |
| 1.4 | **POST /api/articles/publish** | Accept `{ previewId, slug }`. Move draft to articles. Revalidate `/resource-hub` and `/resource-hub/[slug]`. Delete draft. Require API auth. |
| 1.5 | **PATCH /api/articles/drafts/[previewId]** | Accept `{ heroImage: url }`. Update draft hero. For URL override flow. |
| 1.6 | **DELETE /api/articles/drafts/[previewId]** | Delete draft and images from Blob. For Cancel button. |
| 1.7 | **getResource refactor** | Read from Blob when `CONTENT_SOURCE=blob`. `getResourceSlugs`: list `articles/*.md`, exclude drafts. `getResourceContent(slug)`: fetch published. `getDraftContent(previewId)`: fetch `drafts/{previewId}.md`. Fallback to filesystem for dev. |

### Phase 2: Doc Fetch & Conversion

| # | Task | Details |
|---|------|---------|
| 2.1 | **Fetch doc (no API)** | Extract doc ID from URL (regex: `\/d\/([a-zA-Z0-9_-]+)`). Fetch `https://docs.google.com/document/d/{id}/export?format=html` (needed for images). Works for docs shared "anyone with link can view". If 403: reply "Please set sharing to 'anyone with link can view'." |
| 2.2 | **Images first** | Parse HTML, extract `img src`. Download each, upload to Blob `drafts/images/{previewId}-{index}.{ext}`. Replace URLs in HTML with Blob paths. (Google image URLs expire — must download before LLM.) |
| 2.3 | **LLM → Markdown** | Pass HTML (with Blob image paths) to LLM. Single prompt: convert to markdown + extract frontmatter (title, subtitle, category). Output JSON: `{ frontmatter, body }`. |
| 2.4 | **Slug generation** | slugify(title). Check uniqueness against filesystem slugs + Blob `articles/*.md`. On conflict: append `-2`, `-3`, etc. |

### Phase 3: Agent (Chat SDK)

| # | Task | Details |
|---|------|---------|
| 3.1 | **Chat SDK setup** | `chat` + `@chat-adapter/telegram` or `@chat-adapter/discord`. State: `@chat-adapter/state-redis` (needs `REDIS_URL` — Upstash). |
| 3.2 | **Trigger** | Slash command `/publish <doc_url>` or mention + message with doc URL. Parse URL with regex. |
| 3.3 | **Flow handler** | 1) Generate previewId (nanoid). 2) Fetch doc. 3) Extract images, download to Blob. 4) LLM converts to markdown + extracts frontmatter. 5) POST draft to API. 6) Reply with preview card (link + Approve/Cancel buttons). 7) On Approve: call publish API, confirm. On Cancel: delete draft from Blob, optionally reply "Draft discarded." On error (403, LLM fail, slug conflict): reply with clear message. |
| 3.4 | **State** | Store `threadId → previewId` in Redis. On Approve button: lookup previewId, call publish. On hero URL message: lookup previewId, update draft. TTL 24h. |
| 3.5 | **Auth** | Whitelist one user. Env: `ALLOWED_USER_ID` (platform-specific: Telegram or Discord). Platform TBD. |

### Phase 4: Images

| # | Task | Details |
|---|------|---------|
| 4.1 | **Doc images** | Handled in Phase 2.2 (extract before LLM). |
| 4.2 | **Hero image** | First image in doc = hero (index 0). URL override: in preview reply, say "Reply with a hero URL to replace." On message with URL in same thread: lookup `threadId → previewId`, fetch URL, upload to Blob, update draft. Fallback: default/placeholder if no images. |
| 4.3 | **Image limits** | Max 2MB per image. Types: png, jpg, webp. Reject with friendly message if exceeded. |

### Phase 5: Preview

| # | Task | Details |
|---|------|---------|
| 5.1 | **Preview route** | `/resource-hub/preview/[previewId]`. Add `getDraftContent(previewId)` to fetch `drafts/{previewId}.md` from Blob. Reuse ArticleLayoutTemplate for rendering. |
| 5.2 | **Exclude from listing** | `getResourceSlugs` / `getAllResources` never list drafts. Preview only for direct link. |
| 5.3 | **Banner** | Preview page shows "Draft preview" banner. |

### Phase 6: Repo Modifications

| # | Task | Details |
|---|------|---------|
| 6.1 | **getResource** | Add Blob client. Env `CONTENT_SOURCE=blob|filesystem`. When blob: list/fetch from Blob. See 1.7. |
| 6.2 | **ResourceHubHeroImage** | Support full URLs (heroImage can be Blob URL). |
| 6.3 | **API routes** | New: `app/api/articles/route.ts`, `app/api/articles/publish/route.ts`, `app/api/articles/drafts/[previewId]/route.ts` (PATCH hero, DELETE draft). |
| 6.4 | **Agent** | New dir: `agent/` or `bot/` with Chat SDK entry. Deploy as serverless or separate Vercel project. |
| 6.5 | **Migration** | Dual-source during transition. Eventually move all `resource-hub/content/*.md` and `public/hub/images/*` to Blob or DB. |

---

## Services & Env Vars

| Service | Purpose | Env |
|---------|---------|-----|
| Vercel Blob | Markdown + images | `BLOB_READ_WRITE_TOKEN` |
| Upstash Redis | Draft state, Chat SDK state | `REDIS_URL` |
| AI SDK | LLM (markdown conversion + extraction) | `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` |
| Chat SDK | Bot (Telegram or Discord) | `TELEGRAM_BOT_TOKEN` or Discord app credentials |
| API auth | Protect articles API (agent-only) | `INTERNAL_API_KEY` — agent sends in `Authorization: Bearer` or `x-api-key` |

---

## LLM Prompts (Draft)

**Doc structure (recommended):** At the top of the Google Doc:
```
Title: <article title>
Subtitle: <article subtitle>
Category: Usecases|Benchmark|Guides|Research|Comparisons|Updates

[hero image]

[full article content]
```

**Conversion:** Turndown (HTML→markdown, deterministic, no hallucination). Metadata: regex for Title/Subtitle/Category block, or fallback to first heading + first paragraph. Body = article content only (exclude metadata block and hero image). No LLM for body.

**Alternative (two calls):** First call: convert to markdown. Second call: extract frontmatter from result. Single call is cheaper and faster.

---

## Foreseen Problems

| Problem | Mitigation |
|---------|------------|
| **Doc → Markdown quality** | Test with real docs early. Fallback: ask editors to use simple formatting. LLM polish for edge cases. |
| **Large docs** | Token limit. Chunk or summarize. Or reject docs > N chars with "Doc too long, please split." |
| **Images in Docs** | Export HTML, parse img src. Google image URLs may expire; download immediately and re-upload to Blob. |
| **Concurrent flow** | User sends doc, bot processes. User sends another before first done. Use threadId + lock or queue. |
| **Auth** | Whitelist one user via `ALLOWED_USER_ID` (platform-specific). |
| **Rate limits** | LLM, Chat SDK. Add retries, backoff. Export URL has no quota. Consider queue (e.g. Inngest) for heavy work. |
| **Existing content** | Dual-source during transition. Eventually migrate all to Blob or DB. |
| **Sources array** | Complex in chat. MVP: omit or single text field. Full: structured prompt or skip. |

---

## Open Questions

1. **Sources:** Keep YAML array or simplify? Editors rarely edit this.
2. **Migration:** Eventually move all articles to Blob or DB. Dual-source (filesystem + Blob) during transition.
3. **Platform:** Telegram or Discord? (whitelist one user; both supported by Chat SDK)
4. **Doc format:** Always Google Docs, or also support pasted markdown / Notion export?

---

## References

- [Chat SDK](https://vercel.com/changelog/chat-sdk) — Slack, Discord, Telegram, etc. One codebase, every platform.
- [AI SDK](https://ai-sdk.dev/docs/introduction) — LLM integration (generateText, streamText, structured output).
- [Vercel Blob](https://vercel.com/docs/vercel-blob) — Object storage for markdown + images.
- [Upstash Redis](https://vercel.com/marketplace/upstash) — Redis for state (Vercel KV sunset; use Marketplace).
