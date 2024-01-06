import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware"
import { NextRequestWithAuth } from "next-auth/middleware"

// middleware is applied to all routes, use conditionals to select

export default withAuth(
  function middleware (request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const pathName = request.nextUrl.pathname;

    if (!token?.isProfileCompleted && pathName !== "/register/complete-account") {
      return NextResponse.redirect(new URL("/register/complete-account", request.nextUrl));
    } else if (token?.isProfileCompleted && pathName === "/register/complete-account") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        console.log("skdjvbskdjbvdskjbvkjb")
        switch (req.nextUrl.pathname) {
          case "/lol":
            return !!token // Only require authentication
          case "/admin":
            return token?.userType === "producer" // Require authorization
          case "/":
          default:
            return true // Bypass auth for these routes
        }
      }
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = { matcher: ["/profile", "/register/complete-account", "/admin"] };