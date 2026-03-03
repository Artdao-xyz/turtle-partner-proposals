# Telegram Bot Setup

## 1. Create a bot

1. Open [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the prompts
3. Copy the bot token (e.g. `123456789:ABCdefGHI...`)

## 2. Environment variables

Add to `.env.local` (and Vercel env for production):

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_SECRET_TOKEN=your_random_secret  # optional, for webhook verification
TELEGRAM_BOT_USERNAME=your_bot_username           # optional, auto-detected from getMe
```

Also ensure:
- `CONTENT_SOURCE=blob`
- `REDIS_URL` (for state)
- `BLOB_READ_WRITE_TOKEN`

## 3. Deploy and set webhook

After deploying to Vercel:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.vercel.app/api/webhooks/telegram",
    "secret_token": "your_random_secret"
  }'
```

Replace `your-app.vercel.app` with your Vercel URL. If you use `TELEGRAM_WEBHOOK_SECRET_TOKEN`, use the same value for `secret_token`.

## 4. Local testing

Use [ngrok](https://ngrok.com/) or similar to expose localhost:

```bash
ngrok http 3000
```

Then set the webhook to your ngrok URL:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://abc123.ngrok.io/api/webhooks/telegram"}'
```

## Flow

1. **DM the bot** (or @mention in a group) with a Google Doc URL
2. Bot converts → saves draft → replies with preview link + [View preview] [Publish] [Cancel]
3. Open the preview link in a browser to review
4. Tap **Publish** to publish the article, or **Cancel** to discard the draft

## Troubleshooting: Preview deployments (Vercel Deployment Protection)

If you see `Authentication Required` or `API returned non-JSON: <!doctype html>` in logs, Vercel's Deployment Protection is blocking the bot's internal API calls.

**Option A – Enable bypass (recommended):**

1. Vercel Dashboard → Project → **Settings** → **Deployment Protection**
2. Under **Protection Bypass for Automation**, click **Generate Secret**
3. Copy the secret and add it as `VERCEL_AUTOMATION_BYPASS_SECRET` in your project's environment variables
4. Redeploy

The bot will send this header when calling its own APIs.

**Option B – Disable protection for previews:**

1. Vercel Dashboard → Project → **Settings** → **Deployment Protection**
2. For **Preview Deployments**, set protection to **None** (or use **Deployment Protection Exceptions** to allow your preview domain)
