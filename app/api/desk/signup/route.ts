import { NextRequest, NextResponse } from "next/server";
import { signupDeskUser } from "@/backend/controllers/deskAuthController";
import { deskCookieOptions } from "@/backend/middleware/deskAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, inviteCode } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }
    const { token, user } = await signupDeskUser({
      name,
      email,
      password,
      inviteCode,
    });
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set("desk_token", token, deskCookieOptions(60 * 60 * 24 * 7));
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
