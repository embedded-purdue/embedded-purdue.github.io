import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/auth";
import { getDeployStatus } from "@/lib/cms/github";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireCmsAuth();
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await getDeployStatus());
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Deploy status failed." }, { status: 500 });
  }
}
