import Link from "next/link";
import { getResourceContent } from "@/resource-hub/lib/getResource";
import { parseFrontmatter, type ResourceFrontmatter } from "@/resource-hub/lib/parse";
import { ARTICLE_CATEGORIES, normalizeArticleCategory } from "@/resource-hub/lib/constants";
import ArticleEditorForm from "./ArticleEditorForm";

export const dynamic = "force-dynamic";

interface EditorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResourceHubEditorPage({ params }: EditorPageProps) {
  const { slug } = await params;
  const rawContent = await getResourceContent(slug);

  const { frontmatter, content } = parseFrontmatter(rawContent);

  const categories = [...ARTICLE_CATEGORIES];

  const preservedFrontmatter: Partial<ResourceFrontmatter> = {
    slug,
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
              Edit article
            </h1>
            <p className="text-wise-white/70 text-xs sm:text-sm">
              Url: <span className="font-mono text-wise-white/80">{slug}</span>
            </p>
          </div>
          <Link
            href="/resource-hub/editor"
            className="text-sm text-wise-white/70 hover:text-wise-white"
          >
            ← Back to editor
          </Link>
        </div>

        <ArticleEditorForm
          slug={slug}
          initialTitle={frontmatter.title ?? ""}
          initialSubtitle={frontmatter.subtitle ?? ""}
          initialCategory={normalizeArticleCategory(frontmatter.category)}
          initialPublishedDate={frontmatter.publishedDate ?? ""}
          initialBody={content}
          categories={categories}
          preservedFrontmatter={preservedFrontmatter}
        />
      </div>
    </main>
  );
}
