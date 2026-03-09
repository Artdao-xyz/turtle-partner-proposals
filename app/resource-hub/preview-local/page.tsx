"use client";

import { useState } from "react";

export default function PreviewLocalPage() {
  const [docUrl, setDocUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/article-upload/preview-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docUrl: docUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to convert");
        return;
      }
      window.location.href = data.previewUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-semibold text-wise-white">
          Local preview (no Blob)
        </h1>
        <p className="text-wise-white/70 text-sm">
          Paste a Google Doc URL to preview the converted article. Content is stored in memory only — nothing is saved to Blob.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="https://docs.google.com/document/d/xxx/edit"
            className="w-full px-4 py-3 rounded-lg bg-wise-white/5 border border-wise-white/20 text-wise-white placeholder-wise-white/40 focus:outline-none focus:ring-2 focus:ring-green-turtle/50"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-turtle text-black font-medium hover:bg-green-turtle/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Converting…" : "Preview"}
          </button>
        </form>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>
    </main>
  );
}
