import { NextResponse } from "next/server";
import { convertGoogleDoc } from "@/resource-hub/lib/article-conversion";
import mammoth from "mammoth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const fileUrl = url.searchParams.get("fileUrl");

    if (!fileUrl || !fileUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid request. fileUrl is required and must be a valid URL." },
        { status: 400 }
      );
    }

    const res = await fetch(fileUrl);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch DOCX file: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength < 100) {
      return NextResponse.json(
        { error: "DOCX file appears empty or could not be fetched." },
        { status: 400 }
      );
    }

    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    if (!html || html.length < 50) {
      return NextResponse.json(
        { error: "DOCX file conversion produced empty HTML." },
        { status: 400 }
      );
    }

    const result = await convertGoogleDoc(html);

    return NextResponse.json({
      frontmatter: result.frontmatter,
      body: result.body,
      slug: result.slug,
      heroImage: result.heroImage,
    });
  } catch (err) {
    console.error("[article-upload/convert-docx]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "DOCX conversion failed. Please try again.",
      },
      { status: 500 }
    );
  }
}

