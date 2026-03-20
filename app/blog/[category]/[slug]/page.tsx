import { ResourceHub } from "@/resource-hub";
import {
  getResourceSlugs,
  getResourceContent,
  isVisible,
} from "@/resource-hub/lib/getResource";
import { parseFrontmatter } from "@/resource-hub/lib/parse";
import { buildArticleMetadata } from "@/resource-hub/lib/metadata";
import { buildArticlePathFromFrontmatter, categoryToSegment } from "@/resource-hub/lib/article-url";
import { toStorageSlug, toPublicSlug } from "@/resource-hub/lib/slug-aliases";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface BlogArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { category, slug: pathSlug } = await params;
  const slugs = await getResourceSlugs();
  const storageSlug = slugs.includes(pathSlug) ? pathSlug : toStorageSlug(pathSlug);
  if (!storageSlug || !slugs.includes(storageSlug)) return { title: "Not Found" };
  const publicSlug = toPublicSlug(storageSlug);
  if (pathSlug !== publicSlug) return { title: "Redirecting..." };
  const rawContent = await getResourceContent(storageSlug);
  const { frontmatter } = parseFrontmatter(rawContent);
  if (!isVisible(frontmatter.publishedDate, frontmatter.unpublished)) return { title: "Not Found" };
  if (category !== categoryToSegment(frontmatter.category)) return { title: "Redirecting..." };
  const title = frontmatter.title || storageSlug.replace(/-/g, " ");
  return buildArticleMetadata({
    title,
    subtitle: frontmatter.subtitle,
    heroImage: frontmatter.heroImage,
    articlePath: buildArticlePathFromFrontmatter(storageSlug, frontmatter),
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { category, slug: pathSlug } = await params;
  const slugs = await getResourceSlugs();
  const storageSlug = slugs.includes(pathSlug) ? pathSlug : toStorageSlug(pathSlug);

  if (!storageSlug || !slugs.includes(storageSlug)) {
    notFound();
  }

  const rawContent = await getResourceContent(storageSlug);
  const { frontmatter } = parseFrontmatter(rawContent);

  if (!isVisible(frontmatter.publishedDate, frontmatter.unpublished)) {
    notFound();
  }

  const canonicalPath = buildArticlePathFromFrontmatter(storageSlug, frontmatter);
  const publicSlug = toPublicSlug(storageSlug);
  if (category !== categoryToSegment(frontmatter.category) || pathSlug !== publicSlug) {
    permanentRedirect(canonicalPath);
  }

  return <ResourceHub slug={storageSlug} />;
}

