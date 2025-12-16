import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token");
  const userId = req.cookies.get("sb-user-id");

  // Jika mengakses /profile tanpa token, redirect ke /login
  if (!token && req.nextUrl.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika sudah login dan akses /register atau /login, redirect ke /profile
  if (token && userId && (req.nextUrl.pathname === "/register" || req.nextUrl.pathname === "/login")) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/register", "/login"],
};
