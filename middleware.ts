import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/backend/middleware/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // next.config `redirects` match sources case-insensitively, so a lowercase→mixed-case
  // rule loops forever on /proposals/UncoverResearch. Only exact lowercase here.
  if (pathname === "/proposals/uncoverresearch") {
    return NextResponse.redirect(
      new URL("/proposals/UncoverResearch", request.url),
      308
    );
  }

  const token = request.cookies.get("admin_token")?.value;

  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/logout");

  if (isAdminApi) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (isAdminPage && !isLoginPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  if (isLoginPage && token) {
    try {
      await verifyToken(token);
      return NextResponse.redirect(new URL("/admin", request.url));
    } catch {
      /* invalid token, let them see login */
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/proposals/uncoverresearch",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
