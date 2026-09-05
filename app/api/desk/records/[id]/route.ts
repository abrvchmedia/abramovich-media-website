import { NextRequest, NextResponse } from "next/server";
import {
  getDeskAuthFromRequest,
  unauthorizedJson,
} from "@/backend/middleware/deskAuth";
import {
  deleteDeskRecord,
  updateDeskRecord,
} from "@/backend/controllers/deskController";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getDeskAuthFromRequest(request);
  if (!auth) return unauthorizedJson();

  try {
    const { id } = await params;
    const data = await request.json();
    const record = await updateDeskRecord(id, data);
    return NextResponse.json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getDeskAuthFromRequest(_request);
  if (!auth) return unauthorizedJson();

  try {
    const { id } = await params;
    await deleteDeskRecord(id);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
