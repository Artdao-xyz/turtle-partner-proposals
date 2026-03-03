import { ResourceHub } from "@/resource-hub";
import { getBlobDraftContent } from "@/resource-hub/lib/storage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PreviewPageProps {
  params: Promise<{ previewId: string }>;
}

export async function generateMetadata({ params }: PreviewPageProps) {
  const { previewId } = await params;
  if (process.env.CONTENT_SOURCE !== "blob") return { title: "Not Found" };
  try {
    const rawContent = await getBlobDraftContent(previewId);
    const match = rawContent.match(/title:\s*["']([^"']+)["']/);
    const title = match?.[1] ?? "Draft preview";
    return { title: `${title} (Draft) | Turtle Partner Proposals` };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function ResourceHubPreviewPage({ params }: PreviewPageProps) {
  const { previewId } = await params;

  if (process.env.CONTENT_SOURCE !== "blob") {
    notFound();
  }

  let rawContent: string;
  try {
    rawContent = await getBlobDraftContent(previewId);
  } catch {
    notFound();
  }

  return (
    <div className="relative pt-14">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm font-medium">
        Draft preview
      </div>
      <ResourceHub rawContent={rawContent} />
    </div>
  );
}