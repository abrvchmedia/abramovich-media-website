import { NextRequest, NextResponse } from "next/server";
import { updateBlock } from "@/backend/controllers/pageController";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { blockId, content } = await request.json();
    if (!blockId) {
      return NextResponse.json(
        { error: "blockId is required" },
        { status: 400 }
      );
    }
    const page = await updateBlock(id, blockId, { content });
    return NextResponse.json(page);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update block";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
