import { NextRequest, NextResponse } from "next/server";
import { loginDeskUser } from "@/backend/controllers/deskAuthController";
import { deskCookieOptions } from "@/backend/middleware/deskAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const { token, user } = await loginDeskUser(email, password);
    const response = NextResponse.json({ user });
    response.cookies.set("desk_token", token, deskCookieOptions(60 * 60 * 24 * 7));
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
