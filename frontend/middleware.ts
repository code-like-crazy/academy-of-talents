import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // TODO: update the auth routes post testing
  const isAuthRoute = ["/login", "/register", "/chat", "/api/chat", "/api/image"].includes(pathname);
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
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth/* (authentication API routes)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /sitemap.xml (public files)
     * 5. /models/* (3D model files)
     * 6. /sounds/* (audio files)
     * 7. /images/* (generated images)
     * 8. /public/images/* (public image files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|models/|sounds/|images/|public/images/).*)"
  ],
  // matcher: ["/((?!static|favicon.ico|_next|.*\\..*|api|trpc).*)", "/"],
};
