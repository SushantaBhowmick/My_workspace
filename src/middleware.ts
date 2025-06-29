import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/supabase.types";

export async function middleware(request: NextRequest) {
  
  const response = NextResponse.next();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  
  // Refresh the session to ensure we have the latest user state
  const { data: { user } } = await supabase.auth.getUser();
//   const user = session?.user;


  const { pathname } = request.nextUrl;

  // 🔒 1. Block unauthenticated access to protected routes
  const protectedRoutes = ["/dashboard", "/tasks", "/workspace", "/profile"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 2. Block authenticated access to auth pages
  const authPages = ["/login", "/signup", "/auth"];
  const isAuthPage = authPages.some((route) => pathname.startsWith(route));
  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/workspace/:path*", "/profile/:path*", "/login", "/signup", "/auth/callback"],
};