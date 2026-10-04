import { NextRequest, NextResponse } from "next/server";
import { CMS_COOKIE, cmsCookieOptions, createCmsSession, verifyCmsPassword } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string };
    if (!verifyCmsPassword(body.password || "")) return NextResponse.json({ error: "Invalid CMS password." }, { status: 401 });
    const res = NextResponse.json({ authenticated: true });
    res.cookies.set(CMS_COOKIE, createCmsSession(), cmsCookieOptions);
    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Login failed." }, { status: 500 });
  }
}
