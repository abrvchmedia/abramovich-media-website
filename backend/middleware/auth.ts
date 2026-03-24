import { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "fallback-change-me");

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as AuthPayload;
}

export async function getAuthFromRequest(
  request: NextRequest
): Promise<AuthPayload | null> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
