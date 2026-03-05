import { ResourceHub } from "@/resource-hub";
import {
  getResourceSlugs,
  getResourceContent,
} from "@/resource-hub/lib/getResource";
import { parseFrontmatter } from "@/resource-hub/lib/parse";
import { buildArticleMetadata } from "@/resource-hub/lib/metadata";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ResourceHubArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourceHubArticlePageProps) {
  const { slug } = await params;
  const slugs = await getResourceSlugs();
  if (!slugs.includes(slug)) return { title: "Not Found" };
  const rawContent = await getResourceContent(slug);
  const { frontmatter } = parseFrontmatter(rawContent);
  const title = frontmatter.title || slug.replace(/-/g, " ");
  return buildArticleMetadata({
    title,
    subtitle: frontmatter.subtitle,
    heroImage: frontmatter.heroImage,
    slug,
  });
}

export default async function ResourceHubArticlePage({
  params,
}: ResourceHubArticlePageProps) {
  const { slug } = await params;
  const slugs = await getResourceSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  return <ResourceHub slug={slug} />;
}
