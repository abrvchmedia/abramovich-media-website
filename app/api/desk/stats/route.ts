import { NextRequest, NextResponse } from "next/server";
import {
  getDeskAuthFromRequest,
  unauthorizedJson,
} from "@/backend/middleware/deskAuth";
import { getDeskStats } from "@/backend/controllers/deskController";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await getDeskAuthFromRequest(request);
  if (!auth) return unauthorizedJson();
  try {
    const stats = await getDeskStats();
    return NextResponse.json(stats);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
