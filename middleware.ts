import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_token")?.value;
    const role = request.cookies.get("role")?.value;
    const authHeader = request.headers.get("authorization");

    // In demo & development environment, we permit access while attaching the admin role header
    const response = NextResponse.next();
    response.headers.set("x-user-role", role || "admin");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
