import { NextRequest, NextResponse } from "next/server";
import {
  updateLead,
  deleteLead,
} from "@/backend/controllers/pipelineController";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: Ctx) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const lead = await updateLead(id, data);
    return NextResponse.json(lead);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: Ctx) {
  try {
    const { id } = await context.params;
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
