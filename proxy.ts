import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
 
  // return;
  const token = await getToken({ req });
  const pathname = req.nextUrl.pathname;

  const publicPaths = ["/login", "/register", "/api/auth"];

  if (!token && !publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/panel", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images|api/auth).*)"
  ],
};
