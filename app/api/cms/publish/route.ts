import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/auth";
import { buildCmsFiles } from "@/lib/cms/publish-files";
import { publishCmsFiles } from "@/lib/cms/github";
import { cmsPublishSchema } from "@/lib/cms/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauthorized = await requireCmsAuth();
  if (unauthorized) return unauthorized;
  try {
    const payload = cmsPublishSchema.parse(await req.json());
    return NextResponse.json(
      await publishCmsFiles({
        mode: payload.mode,
        message: payload.message,
        expectedBaseSha: payload.baseCommitSha,
        files: buildCmsFiles(payload),
      }),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Publish failed.";
    return NextResponse.json(
      { error: message },
      { status: message.includes("Base branch changed") ? 409 : 400 },
    );
  }
}
