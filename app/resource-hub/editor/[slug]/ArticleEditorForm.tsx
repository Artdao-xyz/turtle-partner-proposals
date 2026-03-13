"use client";

import type React from "react";
import { useState } from "react";
import matter from "gray-matter";
import type { SourceItem } from "@/resource-hub/lib/parse";
import ResourceHubHeroImage from "@/resource-hub/components/ResourceHubHeroImage";
import ResourceHubTitle from "@/resource-hub/components/ResourceHubTitle";
import ArticleBodyPreview from "@/resource-hub/components/ArticleBodyPreview";
import ArticleFooter from "@/resource-hub/components/ArticleFooter";
import TalkToUsSection from "@/resource-hub/components/TalkToUsSection";

interface PreservedFrontmatter {
  slug?: string;
  heroImage?: string;
  sources?: SourceItem[];
  disclaimer?: string;
}

interface ArticleEditorFormProps {
  slug: string;
  initialTitle: string;
  initialSubtitle: string;
  initialCategory: string;
  initialPublishedDate: string;
  initialBody: string;
  categories: readonly string[];
  preservedFrontmatter: PreservedFrontmatter;
}

export default function ArticleEditorForm({
  slug,
  initialTitle,
  initialSubtitle,
  initialCategory,
  initialPublishedDate,
  initialBody,
  categories,
  preservedFrontmatter,
}: ArticleEditorFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [category, setCategory] = useState(initialCategory);
  const [publishedDate, setPublishedDate] = useState(initialPublishedDate);
  const [heroImage, setHeroImage] = useState(preservedFrontmatter.heroImage ?? "");
  const [body, setBody] = useState(initialBody);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadMessage, setHeroUploadMessage] = useState<string | null>(null);

  function buildFullContent(): string {
    const raw: Record<string, unknown> = {
      slug,
      title,
      subtitle,
      category: category || "Research",
      publishedDate: publishedDate || new Date().toISOString().slice(0, 10),
    };
    if (heroImage.trim()) raw.heroImage = heroImage.trim();
    if (preservedFrontmatter.sources && preservedFrontmatter.sources.length > 0)
      raw.sources = preservedFrontmatter.sources;
    if (preservedFrontmatter.disclaimer)
      raw.disclaimer = preservedFrontmatter.disclaimer;
    return matter.stringify(body.trim(), raw);
  }

  async function handleHeroFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setHeroUploadMessage("Image is too large. Max size is 2MB.");
      e.target.value = "";
      return;
    }
    setHeroUploadMessage(null);
    setHeroUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error ?? new Error("Failed to read image file"));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/article-upload/article/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHeroUploadMessage(data.error ?? "Failed to upload image");
        return;
      }
      if (typeof data.heroImage === "string" && data.heroImage.trim()) {
        setHeroImage(data.heroImage);
        setHeroUploadMessage("Image uploaded. Click Save to persist metadata.");
      } else {
        setHeroUploadMessage("Image uploaded, but no heroImage path returned.");
      }
    } catch (err) {
      setHeroUploadMessage(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setHeroUploading(false);
      // reset file input so the same file can be selected again if needed
      e.target.value = "";
    }
  }

  async function handleSave() {
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/article-upload/article", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content: buildFullContent() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Failed to save" });
        return;
      }
      setMessage({ type: "success", text: "Saved" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 items-start">
      {/* Form */}
      <div className="space-y-8">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-wise-white/70 text-sm mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white placeholder:text-wise-white/40 focus:outline-none focus:border-green-turtle"
                placeholder="Article title"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-wise-white/70 text-sm mb-1">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white placeholder:text-wise-white/40 focus:outline-none focus:border-green-turtle"
                placeholder="Article subtitle"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-wise-white/70 text-sm mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white focus:outline-none focus:border-green-turtle"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-wise-white/70 text-sm mb-1">Published date</label>
              <input
                type="date"
                value={publishedDate.slice(0, 10)}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white focus:outline-none focus:border-green-turtle"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-wise-white/70 text-sm mb-1">Hero image URL / blob path</label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white placeholder:text-wise-white/40 focus:outline-none focus:border-green-turtle text-xs"
                placeholder="blob:hub/images/slug-hero.png or https://..."
              />
            <div className="flex items-center gap-2 mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroFileChange}
                disabled={heroUploading}
                className="text-xs text-wise-white/70 file:mr-2 file:px-2 file:py-1 file:rounded-md file:border file:border-white/20 file:bg-white/10 file:text-wise-white file:text-xs file:cursor-pointer"
              />
              {heroUploading && (
                <span className="text-xs text-wise-white/50">Uploading…</span>
              )}
            </div>
            {heroUploadMessage && (
              <p className="text-xs text-wise-white/60 mt-1">{heroUploadMessage}</p>
            )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-wise-white/70 text-sm mb-1">Body (markdown)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={18}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-wise-white placeholder:text-wise-white/40 focus:outline-none focus:border-green-turtle font-mono text-sm"
              placeholder="Article body in markdown..."
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.type === "success" ? "text-green-turtle" : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-green-turtle text-black font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 overflow-hidden bg-black-turtle">
          <div className="px-4 py-2 bg-white/5 text-wise-white/70 text-sm border-b border-white/10">
            Preview (same layout as published article)
          </div>
          <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="space-y-6">
              <ResourceHubHeroImage src={heroImage} />
              <ResourceHubTitle
                title={title}
                subtitle={subtitle}
                badge={category}
              />
            </div>
            <div className="max-w-3xl">
              <article>
                <div className="prose-resource-hub [&_p]:text-wise-white/90 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-[15px] [&_h2]:text-wise-white [&_h3]:text-wise-white [&_strong]:text-wise-white">
                  <ArticleBodyPreview body={body} />
                </div>
                <ArticleFooter
                  sources={preservedFrontmatter.sources}
                  publishedDate={
                    publishedDate || initialPublishedDate || new Date().toISOString().slice(0, 10)
                  }
                  disclaimer={preservedFrontmatter.disclaimer}
                />
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
