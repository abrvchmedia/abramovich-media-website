import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/backend/middleware/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    user: { id: auth.userId, email: auth.email, role: auth.role },
  });
}
