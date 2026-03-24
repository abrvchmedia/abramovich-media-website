import { NextRequest, NextResponse } from "next/server";
import { reorderBlocks } from "@/backend/controllers/pageController";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { blockIds } = await request.json();
    if (!Array.isArray(blockIds)) {
      return NextResponse.json(
        { error: "blockIds array is required" },
        { status: 400 }
      );
    }
    const page = await reorderBlocks(id, blockIds);
    return NextResponse.json(page);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to reorder blocks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
