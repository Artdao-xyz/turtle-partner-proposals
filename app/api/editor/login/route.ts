import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const password = body?.password;

    if (typeof password !== "string" || password.length < 1 || password.length > 200) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const editorPassword = process.env.EDITOR_PASSWORD;
    if (!editorPassword) {
      console.error("EDITOR_PASSWORD not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (password !== editorPassword) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("editor_session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 12 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("[editor/login] error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
