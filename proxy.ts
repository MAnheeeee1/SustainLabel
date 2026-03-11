import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/", "/dashboard", "/dashboard/aigenerator"];

const AUTH_PATHS = ["/dashboard", "/puck"];

export async function proxy(req: NextRequest) {
  // ── Supabase session refresh ────────────────────────────────────
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — keeps auth cookies alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Auth guard for /dashboard and /puck ──────────────────────────
  const isProtected = AUTH_PATHS.some((p) =>
    req.nextUrl.pathname.startsWith(p),
  );

  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ── Puck editor rewrite (/path/edit → /puck/path) ────────────────
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
