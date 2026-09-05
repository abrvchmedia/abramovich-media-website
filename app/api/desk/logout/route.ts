import { NextResponse } from "next/server";
import { deskCookieOptions } from "@/backend/middleware/deskAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("desk_token", "", deskCookieOptions(0));
  return response;
}
