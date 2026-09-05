import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import type { AuthPayload } from "@/backend/middleware/auth";

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "fallback-change-me");

export async function signDeskToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAnyToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as AuthPayload;
}

export function deskCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function getDeskAuthFromRequest(
  request: NextRequest
): Promise<AuthPayload | null> {
  const token =
    request.cookies.get("desk_token")?.value ||
    request.cookies.get("admin_token")?.value;
  if (!token) return null;
  try {
    return await verifyAnyToken(token);
  } catch {
    return null;
  }
}

export function unauthorizedJson() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
