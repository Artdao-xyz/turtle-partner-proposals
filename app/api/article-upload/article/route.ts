import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStorage } from "@/resource-hub/lib/storage";
import { getResourceContent } from "@/resource-hub/lib/getResource";

/**
 * PATCH published article content.
 * Body: { slug: string; content: string } where content is full markdown (frontmatter + body).
 * Uses existing storage abstraction so it works for both filesystem and Blob.
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const slug = body?.slug;
    const content = body?.content;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    // Ensure article exists (throws if not found)
    await getResourceContent(slug);

    const storage = getStorage();
    await storage.writeArticle(slug, content);

    revalidatePath("/resource-hub");
    revalidatePath(`/resource-hub/${slug}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message.includes("not found")) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    console.error("[article-upload/article PATCH]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to update article.",
      },
      { status: 500 }
    );
  }
}
