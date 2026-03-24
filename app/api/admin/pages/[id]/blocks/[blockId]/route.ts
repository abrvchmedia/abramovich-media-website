import { NextRequest, NextResponse } from "next/server";
import { deleteBlock } from "@/backend/controllers/pageController";

interface RouteContext {
  params: Promise<{ id: string; blockId: string }>;
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id, blockId } = await context.params;
    const page = await deleteBlock(id, blockId);
    return NextResponse.json(page);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete block";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
