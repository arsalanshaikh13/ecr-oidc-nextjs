import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  const protectedRoutes = ["/dashboard", "/tasks"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const user = session?.user || null;

  if (isProtectedRoute) {
    // If no session exists, redirect to home page
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If user is logged in and trying to access home page, redirect to dashboard
  if (pathname === "/") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/tasks",
    "/tasks/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
