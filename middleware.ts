import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that should NOT be editable via the Puck editor
const PROTECTED_PATHS = ["/", "/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/puck") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  for (const protected_path of PROTECTED_PATHS) {
    if (protected_path !== "/" && pathname === `/puck${protected_path}`) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/puck/:path*", "/puck"],
};
