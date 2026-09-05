import { NextRequest, NextResponse } from "next/server";
import {
  getDeskAuthFromRequest,
  unauthorizedJson,
} from "@/backend/middleware/deskAuth";
import { isDeskBook, type DiscoveryProviderId } from "@/lib/desk/kinds";
import { runDiscovery } from "@/lib/desk/providers";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const auth = await getDeskAuthFromRequest(request);
  if (!auth) return unauthorizedJson();

  try {
    const body = await request.json();
    const kind = String(body.kind || "");
    const provider = String(body.provider || "web") as DiscoveryProviderId;
    const query = String(body.query || "");
    if (!isDeskBook(kind)) {
      return NextResponse.json({ error: "Invalid desk book" }, { status: 400 });
    }
    const result = await runDiscovery({ provider, query, kind });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Discovery failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
