import { ResourceHub } from "@/resource-hub";
import { getResourceSlugs } from "@/resource-hub/lib/getResource";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ResourceHubArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourceHubArticlePageProps) {
  const { slug } = await params;
  const slugs = await getResourceSlugs();
  if (!slugs.includes(slug)) return { title: "Not Found" };
  return {
    title: `${slug.replace(/-/g, " ")} | Turtle Partner Proposals`,
  };
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
