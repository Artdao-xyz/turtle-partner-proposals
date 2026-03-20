import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isEditorPage =
    pathname.startsWith("/blog/editor") ||
    (pathname.startsWith("/blog/preview/") && pathname.endsWith("/edit")) ||
    pathname.startsWith("/blog/preview-local") ||
    pathname.startsWith("/resource-hub/editor") ||
    (pathname.startsWith("/resource-hub/preview/") && pathname.endsWith("/edit")) ||
    pathname.startsWith("/resource-hub/preview-local");

  const isEditorApi =
    pathname.startsWith("/api/article-upload/article") ||
    pathname === "/api/article-upload/draft" ||
    pathname === "/api/article-upload/publish-draft" ||
    pathname === "/api/article-upload/preview-local";

  if (!isEditorPage && !isEditorApi) {
    return NextResponse.next();
  }

  // Allow internal bot/automation via header
  const internalToken = process.env.INTERNAL_EDITOR_TOKEN;
  const headerToken = req.headers.get("x-internal-editor-token");
  if (internalToken && headerToken && headerToken === internalToken) {
    return NextResponse.next();
  }

  const hasSession = Boolean(req.cookies.get("editor_session")?.value);
  if (hasSession) {
    return NextResponse.next();
  }

  // Unauthorized
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/editor-login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/blog/editor/:path*",
    "/blog/preview-local",
    "/blog/preview/:previewId/edit",
    "/resource-hub/editor/:path*",
    "/resource-hub/preview-local",
    "/resource-hub/preview/:previewId/edit",
    "/api/article-upload/article/:path*",
    "/api/article-upload/draft",
    "/api/article-upload/publish-draft",
  ],
};

