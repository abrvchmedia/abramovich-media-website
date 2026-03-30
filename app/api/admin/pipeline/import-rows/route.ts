import { NextRequest, NextResponse } from "next/server";
import { bulkImportLeads } from "@/backend/controllers/pipelineController";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rows = body.rows;
    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { error: "Body must include rows: [...]" },
        { status: 400 }
      );
    }
    const result = await bulkImportLeads(rows);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
