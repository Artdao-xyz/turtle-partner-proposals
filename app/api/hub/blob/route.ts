import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

/** Proxies private blob images. GET ?path=hub/images/slug-hero.png or hub/drafts/images/previewId-hero.png */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const allowed =
    path?.startsWith("hub/images/") || path?.startsWith("hub/drafts/images/");
  if (!path || !allowed) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const result = await get(path, { access: "private" });
    if (!result || result.statusCode === 304 || !result.stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contentType = result.blob.contentType ?? "image/png";
    return new Response(result.stream, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("[hub/blob]", err);
    return NextResponse.json({ error: "Failed to fetch blob" }, { status: 500 });
  }
}
