import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = ["/login", "/register"].includes(pathname);
  const isLandingPage = pathname === "/";

  // Get session using NextAuth
  const session = await auth();

  // Redirect authenticated users away from auth routes
  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Allow access to landing page without authentication
  if (isLandingPage) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!static|favicon.ico|_next|.*\\..*|api|trpc).*)", "/"],
};
