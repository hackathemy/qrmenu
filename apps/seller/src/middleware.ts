import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = await fetch(
    new URL("/api/session", process.env.NEXT_PUBLIC_BASE_URL),
    {
      headers: request.headers,
    }
  );
  if (res.status !== 200) {
    return NextResponse.redirect(
      new URL(
        "/signin?from=" + request.nextUrl.pathname,
        process.env.NEXT_PUBLIC_BASE_URL
      )
    );
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|signin|signup|find|favicon.ico|.*\\..*).*)",
  ],
};
