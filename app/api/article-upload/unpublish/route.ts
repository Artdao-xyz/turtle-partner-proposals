import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { unpublishBlobArticle, getBlobArticleContent } from "@/resource-hub/lib/storage";
import { parseFrontmatter } from "@/resource-hub/lib/parse";
import { buildArticlePathFromFrontmatter } from "@/resource-hub/lib/article-url";

export async function POST(req: Request) {
  if (process.env.CONTENT_SOURCE !== "blob") {
    return NextResponse.json(
      { error: "Unpublish requires CONTENT_SOURCE=blob" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const slug = body?.slug;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    const sanitized = slug.replace(/[^a-z0-9-]/g, "");
    if (sanitized !== slug) {
      return NextResponse.json(
        { error: "Invalid slug" },
        { status: 400 }
      );
    }

    const preview = body?.preview === true;
    if (preview) {
      const rawContent = await getBlobArticleContent(slug);
      const { frontmatter } = parseFrontmatter(rawContent);
      if (frontmatter.unpublished) {
        return NextResponse.json({ error: "Article is already unpublished" }, { status: 409 });
      }
      return NextResponse.json({
        slug,
        title: frontmatter.title || slug,
      });
    }

    const rawBeforeUnpublish = await getBlobArticleContent(slug);
    const { frontmatter: beforeFrontmatter } = parseFrontmatter(rawBeforeUnpublish);
    const articlePath = buildArticlePathFromFrontmatter(slug, beforeFrontmatter);
    const { title } = await unpublishBlobArticle(slug);

    revalidatePath("/resource-hub");
    revalidatePath(`/resource-hub/${slug}`);
    revalidatePath(articlePath);

    return NextResponse.json({
      success: true,
      slug,
      title,
    });
  } catch (err) {
    console.error("[article-upload/unpublish]", err);
    const message = err instanceof Error ? err.message : "Failed to unpublish";
    const status = message.includes("not found") ? 404 : message.includes("already unpublished") ? 409 : 500;
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
