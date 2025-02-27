import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req: any) => {
  const isAuthenticated = !!req.auth;
  const { pathname, origin } = req.nextUrl;

  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard/course", origin));
  }

  if (!isAuthenticated && pathname.startsWith("/dashboard/course")) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
