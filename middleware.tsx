import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "./services/auth";
import { Payload } from "./interfaces/interfaces";
import { useUser } from "./context/auth";

const protectedRoutes = [
  "/budget",
  "/budget/update",
  "/transaction",
  "/transaction/update",
  "/dashboard",
  "/goal",
  "/goal/update",
  "/income",
  "/income/update",
  "/settings"
];

const unprotectedRoute = [
  "/auth/login",
  "/auth/register"
];

export default async function middleware(req: NextRequest) {
  if (unprotectedRoute.includes(req.nextUrl.pathname)) {
    console.log('unprotected route');
    return NextResponse.next(); 
  }  

  console.log(`Middleware triggered for ${req.nextUrl.pathname}`);

  const userFromToken = await getUserFromToken(req); // Pass the request object
  console.log('+++++++++', userFromToken)

  console.log(`User from token: ${JSON.stringify(userFromToken)}`);

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);

  // If route is protected and user is not authenticated, redirect to home
  if (isProtectedRoute && !userFromToken) {
    console.log(`Redirecting to home due to unauthenticated access to ${req.nextUrl.pathname}`);
    return NextResponse.redirect(new URL("/", req.nextUrl.origin).toString());
  }

  // If user is authenticated but token is expired, redirect to home
  if (userFromToken && isProtectedRoute) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (userFromToken.exp <= currentTime) {
      console.log(`Redirecting to home due to expired token for ${req.nextUrl.pathname}`);
      return NextResponse.redirect(new URL("/", req.nextUrl.origin).toString());
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}
