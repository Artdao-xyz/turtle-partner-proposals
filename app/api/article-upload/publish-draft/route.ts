import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { publishBlobDraft } from "@/resource-hub/lib/storage";

export async function POST(req: Request) {
  if (process.env.CONTENT_SOURCE !== "blob") {
    return NextResponse.json(
      { error: "Publish draft requires CONTENT_SOURCE=blob" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const previewId = body?.previewId;
    if (!previewId || typeof previewId !== "string") {
      return NextResponse.json(
        { error: "previewId is required" },
        { status: 400 }
      );
    }

    const { slug } = await publishBlobDraft(previewId);

    revalidatePath("/resource-hub");
    revalidatePath(`/resource-hub/${slug}`);

    return NextResponse.json({
      success: true,
      slug,
      url: `/resource-hub/${slug}`,
    });
  } catch (err) {
    console.error("[article-upload/publish-draft]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to publish draft. Please try again.",
      },
      { status: 500 }
    );
  }
}
