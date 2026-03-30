import { NextRequest, NextResponse } from "next/server";
import { getSnapshotBySlug } from "@/backend/controllers/pipelineController";

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, context: Ctx) {
  try {
    const { slug } = await context.params;
    const snap = await getSnapshotBySlug(slug);
    if (!snap) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(snap);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
