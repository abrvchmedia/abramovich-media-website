import { NextRequest, NextResponse } from "next/server";
import { addBlock } from "@/backend/controllers/pageController";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const block = await request.json();
    if (!block.type) {
      return NextResponse.json(
        { error: "Block type is required" },
        { status: 400 }
      );
    }
    const page = await addBlock(id, block);
    return NextResponse.json(page);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add block";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
