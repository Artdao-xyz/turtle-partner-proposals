import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlobDraftContent } from "@/resource-hub/lib/storage";
import {
  isLocalPreviewId,
  getLocalPreviewContent,
} from "@/resource-hub/lib/preview-store";
import { parseFrontmatter, type ResourceFrontmatter } from "@/resource-hub/lib/parse";
import { ARTICLE_CATEGORIES } from "@/resource-hub/lib/constants";
import DraftEditForm from "./DraftEditForm";

export const dynamic = "force-dynamic";

async function getPreviewContent(previewId: string): Promise<string | null> {
  if (isLocalPreviewId(previewId)) {
    return getLocalPreviewContent(previewId);
  }
  if (process.env.CONTENT_SOURCE !== "blob") return null;
  try {
    return await getBlobDraftContent(previewId);
  } catch {
    return null;
  }
}

interface EditPageProps {
  params: Promise<{ previewId: string }>;
}

export default async function DraftPreviewEditPage({ params }: EditPageProps) {
  const { previewId } = await params;
  const rawContent = await getPreviewContent(previewId);
  if (!rawContent) {
    notFound();
  }

  const { frontmatter, content } = parseFrontmatter(rawContent);
  const categories = [...ARTICLE_CATEGORIES];
  const preservedFrontmatter: Partial<ResourceFrontmatter> = {
    slug: frontmatter.slug,
    heroImage: frontmatter.heroImage,
    sources: frontmatter.sources,
    disclaimer: frontmatter.disclaimer,
  };

  return (
    <main
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-12 sm:pt-32 sm:pb-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-wise-white mb-1">
              Edit draft preview
            </h1>
            <p className="text-wise-white/70 text-xs sm:text-sm">
              Preview ID:{" "}
              <span className="font-mono text-wise-white/80">{previewId}</span>
            </p>
          </div>
          <Link
            href={`/resource-hub/preview/${previewId}`}
            className="text-sm text-wise-white/70 hover:text-wise-white"
          >
            ← Back to preview
          </Link>
        </div>

        <DraftEditForm
          previewId={previewId}
          initialTitle={frontmatter.title ?? ""}
          initialSubtitle={frontmatter.subtitle ?? ""}
          initialCategory={frontmatter.category ?? "Research"}
          initialPublishedDate={frontmatter.publishedDate ?? ""}
          initialBody={content}
          categories={categories}
          preservedFrontmatter={preservedFrontmatter}
        />
      </div>
    </main>
  );
}

