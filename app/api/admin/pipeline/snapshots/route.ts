import { NextRequest, NextResponse } from "next/server";
import {
  listSnapshots,
  createSnapshot,
} from "@/backend/controllers/pipelineController";

export async function GET() {
  try {
    const snapshots = await listSnapshots();
    return NextResponse.json(snapshots);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to list snapshots";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.title || data.rawJson === undefined) {
      return NextResponse.json(
        { error: "title and rawJson are required" },
        { status: 400 }
      );
    }
    const snap = await createSnapshot({
      title: data.title,
      slug: data.slug,
      source: data.source,
      rawJson: data.rawJson,
      notes: data.notes,
    });
    return NextResponse.json(snap, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save snapshot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
