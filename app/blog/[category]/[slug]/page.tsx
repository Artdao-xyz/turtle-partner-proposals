import { ResourceHub } from "@/resource-hub";
import {
  getResourceSlugs,
  getResourceContent,
  isVisible,
} from "@/resource-hub/lib/getResource";
import { parseFrontmatter } from "@/resource-hub/lib/parse";
import { buildArticleMetadata } from "@/resource-hub/lib/metadata";
import { buildArticlePathFromFrontmatter, categoryToSegment } from "@/resource-hub/lib/article-url";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface BlogArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { category, slug } = await params;
  const slugs = await getResourceSlugs();
  if (!slugs.includes(slug)) return { title: "Not Found" };
  const rawContent = await getResourceContent(slug);
  const { frontmatter } = parseFrontmatter(rawContent);
  if (!isVisible(frontmatter.publishedDate, frontmatter.unpublished)) return { title: "Not Found" };
  if (category !== categoryToSegment(frontmatter.category)) return { title: "Redirecting..." };
  const title = frontmatter.title || slug.replace(/-/g, " ");
  return buildArticleMetadata({
    title,
    subtitle: frontmatter.subtitle,
    heroImage: frontmatter.heroImage,
    articlePath: buildArticlePathFromFrontmatter(slug, frontmatter),
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { category, slug } = await params;
  const slugs = await getResourceSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const rawContent = await getResourceContent(slug);
  const { frontmatter } = parseFrontmatter(rawContent);

  if (!isVisible(frontmatter.publishedDate, frontmatter.unpublished)) {
    notFound();
  }

  const canonicalPath = buildArticlePathFromFrontmatter(slug, frontmatter);
  if (category !== categoryToSegment(frontmatter.category)) {
    permanentRedirect(canonicalPath);
  }

  return <ResourceHub slug={slug} />;
}

