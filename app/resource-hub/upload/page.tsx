"use client";

import { useState } from "react";
import Link from "next/link";
import { FILTER_OPTIONS } from "@/resource-hub/lib/constants";
import GoBackButton from "@/resource-hub/components/GoBackButton";
import ResourceHubHeroImage from "@/resource-hub/components/ResourceHubHeroImage";
import ResourceHubTitle from "@/resource-hub/components/ResourceHubTitle";
import ArticleFooter from "@/resource-hub/components/ArticleFooter";
import ArticleBodyPreview from "@/resource-hub/components/ArticleBodyPreview";
import TalkToUsSection from "@/resource-hub/components/TalkToUsSection";

const CATEGORIES = FILTER_OPTIONS.filter((c) => c !== "All");

type SourceItem = { title: string; url?: string; author: string; year?: string };

type ConvertResult = {
  frontmatter: {
    title: string;
    subtitle: string;
    category: string;
    publishedDate?: string;
    sources?: SourceItem[];
  };
  body: string;
  slug: string;
  heroImage?: string;
};

export default function ArticleUploadPage() {
  const [docUrl, setDocUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Research");
  const [publishedDate, setPublishedDate] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/article-upload/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Conversion failed");
      }
      setResult(data);
      setSlug(data.slug);
      setCategory(data.frontmatter.category);
      setPublishedDate(data.frontmatter.publishedDate ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!result) return;
    setPublishing(true);
    setPublishSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/article-upload/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: result.frontmatter.title,
          subtitle: result.frontmatter.subtitle,
          category,
          body: result.body,
          heroImage: result.heroImage,
          publishedDate: publishedDate || result.frontmatter.publishedDate,
          sources: result.frontmatter.sources,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Publish failed");
      }
      setPublishSuccess(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-12 sm:pt-32 sm:pb-28">
        <Link
          href="/resource-hub"
          className="inline-flex items-center gap-2 text-wise-white/70 hover:text-wise-white text-sm mb-8"
        >
          ← Back to Resource Hub
        </Link>

        <h1 className="text-2xl font-semibold text-wise-white mb-2">
          Upload Article from Google Doc
        </h1>
        <p className="text-wise-white/70 text-sm mb-8">
          Paste a Google Doc URL. The document must be shared with &quot;Anyone with the
          link can view&quot;.
        </p>

        <form onSubmit={handleConvert} className="space-y-4 mb-8">
          <input
            type="url"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="https://docs.google.com/document/d/xxx/edit"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-wise-white placeholder:text-wise-white/40 focus:outline-none focus:border-green-turtle"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-green-turtle text-black font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Converting…" : "Convert"}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {publishSuccess && (
          <div className="mb-8 p-4 rounded-lg bg-green-turtle/10 border border-green-turtle/20 text-green-turtle text-sm">
            Published!{" "}
            <Link href={publishSuccess} className="underline hover:no-underline">
              View article
            </Link>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-wise-white/70 text-sm mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white focus:outline-none focus:border-green-turtle"
            />
              </div>
              <div>
                <label className="block text-wise-white/70 text-sm mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white focus:outline-none focus:border-green-turtle"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-wise-white/70 text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white focus:outline-none focus:border-green-turtle"
                />
              </div>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-6 py-2.5 rounded-lg bg-green-turtle text-black font-medium hover:opacity-90 disabled:opacity-50"
              >
                {publishing ? "Publishing…" : "Publish"}
              </button>
            </div>

            <div className="rounded-lg border border-white/10 overflow-hidden -mx-4 sm:-mx-6 md:-mx-10">
              <div className="px-4 py-2 bg-white/5 text-wise-white/70 text-sm border-b border-white/10">
                Preview (same layout as published article)
              </div>
              <div className="min-h-[400px] bg-black-turtle w-full">
                <main
                  className="w-full min-h-screen"
                  style={{ backgroundColor: "var(--black-turtle)" }}
                >
                  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-12 sm:pt-32 sm:pb-28 md:pt-36 md:pb-24">
                    <div className="space-y-10 lg:space-y-5">
                      <GoBackButton href="/resource-hub/upload" />
                      <ResourceHubHeroImage src={result.heroImage} />
                      <ResourceHubTitle
                        title={result.frontmatter.title}
                        subtitle={result.frontmatter.subtitle}
                        badge={category}
                      />
                    </div>
                    <div className="mt-4 lg:mt-16 max-w-3xl">
                      <article>
                        <div className="prose-resource-hub [&_p]:text-wise-white/90 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-[15px] [&_h2]:text-wise-white [&_h3]:text-wise-white [&_strong]:text-wise-white [&_a]:text-green-turtle [&_a]:underline">
                          <ArticleBodyPreview body={result.body} />
                        </div>
                        <ArticleFooter
                          sources={result.frontmatter.sources}
                          publishedDate={
                            publishedDate || result.frontmatter.publishedDate || new Date().toISOString().slice(0, 10)
                          }
                        />
                      </article>
                    </div>
                  </div>
                  <TalkToUsSection />
                  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8">
                    <img
                      src="/media/turtle-big.svg"
                      alt="Turtle"
                      className="w-auto h-auto mx-auto"
                    />
                  </div>
                </main>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
