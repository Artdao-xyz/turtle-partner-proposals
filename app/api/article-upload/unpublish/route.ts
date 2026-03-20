import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { unpublishBlobArticle, getBlobArticleContent } from "@/resource-hub/lib/storage";
import { parseFrontmatter } from "@/resource-hub/lib/parse";
import { buildArticlePathFromFrontmatter } from "@/resource-hub/lib/article-url";
import { getResourceSlugs } from "@/resource-hub/lib/getResource";
import { toStorageSlug } from "@/resource-hub/lib/slug-aliases";

export async function POST(req: Request) {
  if (process.env.CONTENT_SOURCE !== "blob") {
    return NextResponse.json(
      { error: "Unpublish requires CONTENT_SOURCE=blob" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const inputSlug = body?.slug;
    if (!inputSlug || typeof inputSlug !== "string") {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    const sanitized = inputSlug.replace(/[^a-z0-9-]/g, "");
    if (sanitized !== inputSlug) {
      return NextResponse.json(
        { error: "Invalid slug" },
        { status: 400 }
      );
    }

    const allStorageSlugs = await getResourceSlugs();
    const slug =
      allStorageSlugs.includes(inputSlug) ? inputSlug : toStorageSlug(inputSlug);
    if (!slug || !allStorageSlugs.includes(slug)) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
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

    revalidatePath("/blog");
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
