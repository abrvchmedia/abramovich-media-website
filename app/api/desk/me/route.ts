import { NextRequest, NextResponse } from "next/server";
import {
  getDeskAuthFromRequest,
  unauthorizedJson,
} from "@/backend/middleware/deskAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await getDeskAuthFromRequest(request);
  if (!auth) return unauthorizedJson();
  return NextResponse.json({
    user: { id: auth.userId, email: auth.email, role: auth.role },
  });
}
