import { NextRequest, NextResponse } from "next/server";
import {
  getDeskAuthFromRequest,
  unauthorizedJson,
} from "@/backend/middleware/deskAuth";
import {
  createDeskRecord,
  listDeskRecords,
} from "@/backend/controllers/deskController";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await getDeskAuthFromRequest(request);
  if (!auth) return unauthorizedJson();

  try {
    const { searchParams } = new URL(request.url);
    const items = await listDeskRecords({
      kind: searchParams.get("kind") || undefined,
      search: searchParams.get("search") || undefined,
      stage: searchParams.get("stage") || undefined,
      subtype: searchParams.get("subtype") || undefined,
      watchlisted: searchParams.get("watchlisted") === "1",
    });
    return NextResponse.json({ items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to list records";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await getDeskAuthFromRequest(request);
  if (!auth) return unauthorizedJson();

  try {
    const data = await request.json();
    const record = await createDeskRecord(data, auth.userId);
    return NextResponse.json(record, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
