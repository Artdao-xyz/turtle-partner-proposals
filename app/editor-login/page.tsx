"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditorLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/resource-hub/editor";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("PASSWORD:", password);
    try {
      const res = await fetch("/api/editor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-wise-white">Editor login</h1>
          <p className="text-wise-white/70 text-sm mt-1">
            Internal access for the Resource Hub editor.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-wise-white/80 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-wise-white/5 border border-wise-white/20 text-wise-white placeholder-wise-white/40 focus:outline-none focus:ring-2 focus:ring-green-turtle/50"
              required
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-green-turtle text-black font-medium hover:bg-green-turtle/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}

