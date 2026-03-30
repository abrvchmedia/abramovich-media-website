import { NextRequest, NextResponse } from "next/server";
import { importLeadsFromRunLog } from "@/backend/controllers/pipelineController";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const raw = body.raw as Record<string, unknown> | undefined;
    if (!raw || typeof raw !== "object") {
      return NextResponse.json(
        { error: "Body must include { raw: <run log JSON object> }" },
        { status: 400 }
      );
    }
    const title = typeof body.title === "string" ? body.title : undefined;
    const batchRunId =
      typeof body.batchRunId === "string" ? body.batchRunId : undefined;
    const result = await importLeadsFromRunLog(raw, title, batchRunId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
