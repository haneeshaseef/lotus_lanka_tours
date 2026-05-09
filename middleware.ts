import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_ROUTE_RE = /^\/admin(\/.*)?$/;
const LOCALE_ADMIN_RE = /^\/(en|si|ta)(\/admin.*)/;

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const localeAdminMatch = pathname.match(LOCALE_ADMIN_RE);
  const isAdminRoute = ADMIN_ROUTE_RE.test(pathname);

  if (isAdminRoute || localeAdminMatch) {
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
              req.cookies.set(name, value)
            );
            res = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const signInUrl = new URL("/en/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/en", req.url));
    }

    // Redirect /{locale}/admin/* → /admin/* so the browser URL is canonical
    if (localeAdminMatch) {
      const url = req.nextUrl.clone();
      url.pathname = localeAdminMatch[2];
      return NextResponse.redirect(url);
    }

    return res;
  }

  if (!pathname.startsWith("/api")) {
    return intlMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
