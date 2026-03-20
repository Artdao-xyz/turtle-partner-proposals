import {
  getResourceSlugs,
  getResourceContent,
  isVisible,
} from "@/resource-hub/lib/getResource";
import { parseFrontmatter } from "@/resource-hub/lib/parse";
import { buildArticlePathFromFrontmatter } from "@/resource-hub/lib/article-url";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface ResourceHubArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourceHubArticlePageProps) {
  void params;
  return { title: "Redirecting..." };
}

export default async function ResourceHubArticlePage({
  params,
}: ResourceHubArticlePageProps) {
  const { slug } = await params;
  const slugs = await getResourceSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const rawContent = await getResourceContent(slug);
  const { frontmatter } = parseFrontmatter(rawContent);

  if (!isVisible(frontmatter.publishedDate, frontmatter.unpublished)) {
    notFound();
  }

  permanentRedirect(buildArticlePathFromFrontmatter(slug, frontmatter));
}
