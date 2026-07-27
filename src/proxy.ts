import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function isApplicationRoute(pathname: string) {
  return pathname === "/app" || pathname.startsWith("/app/");
}

// Redirect signed-out document requests before Next.js renders the dashboard
// layout and page in parallel. Resource boundaries still re-verify the Clerk
// session and active organization before accessing tenant-owned data.
export default clerkMiddleware(async (auth, request) => {
  if (isApplicationRoute(request.nextUrl.pathname)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
});

export const config = {
  matcher: [
    "/",
    "/app(.*)",
    "/organization(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
