import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/auth";
import { readCmsSnapshot } from "@/lib/cms/content";
import { getBaseRef, getGitHubConfig } from "@/lib/cms/github";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireCmsAuth();
  if (unauthorized) return unauthorized;
  const config = getGitHubConfig();
  let baseCommitSha: string | null = null;
  try { baseCommitSha = await getBaseRef(config); } catch { baseCommitSha = null; }
  return NextResponse.json(await readCmsSnapshot(config.branch, baseCommitSha));
}
