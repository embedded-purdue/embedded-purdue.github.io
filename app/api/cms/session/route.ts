import { NextResponse } from "next/server";
import { isCmsAuthed } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ authenticated: await isCmsAuthed() });
}
