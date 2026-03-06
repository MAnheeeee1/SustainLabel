import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/", "/dashboard", "/dashboard/aigenerator"];

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  if (req.method === "GET") {
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5,
      );

      if (PROTECTED_PATHS.includes(pathWithoutEdit)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      const pathWithEditPrefix = `/puck${pathWithoutEdit}`;

      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
    }

    // Disable direct access to "/puck/[...puckPath]"
    if (req.nextUrl.pathname.startsWith("/puck")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}
