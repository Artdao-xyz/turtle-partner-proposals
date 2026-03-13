import Link from "next/link";
import { ResourceHub } from "@/resource-hub";
import { getBlobDraftContent } from "@/resource-hub/lib/storage";
import {
  isLocalPreviewId,
  getLocalPreviewContent,
} from "@/resource-hub/lib/preview-store";
import { parseFrontmatter } from "@/resource-hub/lib/parse";
import { buildArticleMetadata } from "@/resource-hub/lib/metadata";
import { notFound } from "next/navigation";

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

interface PreviewPageProps {
  params: Promise<{ previewId: string }>;
}

export async function generateMetadata({ params }: PreviewPageProps) {
  const { previewId } = await params;
  try {
    const rawContent = await getPreviewContent(previewId);
    if (!rawContent) return { title: "Not Found" };
    const { frontmatter } = parseFrontmatter(rawContent);
    const title = frontmatter.title || "Draft preview";
    return buildArticleMetadata({
      title,
      subtitle: frontmatter.subtitle,
      heroImage: frontmatter.heroImage,
      isDraft: true,
    });
  } catch {
    return { title: "Not Found" };
  }
}

export default async function ResourceHubPreviewPage({ params }: PreviewPageProps) {
  const { previewId } = await params;

  const rawContent = await getPreviewContent(previewId);
  if (!rawContent) {
    notFound();
  }

  return (
    <ResourceHub
      rawContent={rawContent}
      headerRight={
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm font-medium">
            Draft preview
          </div>
          <Link
            href={`/resource-hub/preview/${previewId}/edit`}
            className="px-4 py-2 rounded-lg bg-green-turtle/20 border border-green-turtle/40 text-green-turtle text-sm font-medium hover:bg-green-turtle/30"
          >
            Edit
          </Link>
        </div>
      }
    />
  );
}