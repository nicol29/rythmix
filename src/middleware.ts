import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware"
import { NextRequestWithAuth } from "next-auth/middleware"


export default withAuth(
  function middleware (request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const pathName = request.nextUrl.pathname;

    if (!token?.isProfileCompleted && !pathName.startsWith("/register/complete-account")) {
      return NextResponse.redirect(new URL("/register/complete-account", request.nextUrl));
    } else if (token?.isProfileCompleted && pathName.startsWith("/register/complete-account")) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = { 
  matcher: [
    "/register/complete-account",
    "/profile",
    "/track/upload/:path*",
  ]
};


