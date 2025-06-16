import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from "next/server";


export async function middleware(request:NextRequest){
  return updateSession(request)
}

export const config = {
  matcher: [
     '/dashboard/:path*',
    '/tasks/:path*',
    '/workspace/:path*',
    '/account/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}