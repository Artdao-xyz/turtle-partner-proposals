import { NextResponse } from "next/server";
import {
  extractDocId,
  convertGoogleDoc,
} from "@/resource-hub/lib/article-conversion";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const docUrl = payload?.docUrl;
    if (!docUrl || typeof docUrl !== "string" || !docUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid request. docUrl is required and must be a valid URL." },
        { status: 400 }
      );
    }

    const docId = extractDocId(docUrl);
    if (!docId) {
      return NextResponse.json(
        {
          error:
            "Could not extract document ID from URL. Use a Google Docs URL like https://docs.google.com/document/d/xxx/edit",
        },
        { status: 400 }
      );
    }

    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;
    const res = await fetch(exportUrl);

    if (!res.ok) {
      if (res.status === 403) {
        return NextResponse.json(
          {
            error:
              "Document is not accessible. Please set sharing to 'Anyone with the link can view'.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch document: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const html = await res.text();
    if (!html || html.length < 50) {
      return NextResponse.json(
        { error: "Document appears empty or could not be fetched." },
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
    console.error("[article-upload/convert]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Conversion failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
