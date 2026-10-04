import { NextResponse } from "next/server";
import { CMS_COOKIE, cmsCookieOptions } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(CMS_COOKIE, "", { ...cmsCookieOptions, maxAge: 0 });
  return res;
}
