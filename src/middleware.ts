import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UserRoleEnum } from "./enums/common.enum";
import { me } from "./utils/auth.lib";

const protectedRoutes = [
  "/",
  "/asset-types",
  "/departments",
  "/depreciation-calculations",
  "/employees",
  "/fixed-assets",
  "/inventory-types",
  "/journal-entries",
  "/ledger-accounts",
  "/users",
];

// Helper function to check if a path is protected
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  // const cookie = await getCookie();

  const user = await me();

  const currentPath = request.nextUrl.pathname;

  if (currentPath === "/auth/sign-in") {
    return NextResponse.next();
  }

  if (isProtectedRoute(currentPath) && !user.data) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const role = user?.data?.role;

  if (currentPath === "/employees" && role === UserRoleEnum.EMPLOYEE) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Optionally, you can add a matcher to optimize performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|__nextjs_original-stack-frames).*)",
  ],
};
