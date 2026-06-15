import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-gemshouse-2026"
);

async function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload && payload.role === "ADMIN") {
      return payload;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Host and Subdomain detection
  const host = request.headers.get("host") || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const isProduction = !isLocalhost;

  // Subdomain starts with "admin."
  const isAdminDomain = isLocalhost
    ? host.startsWith("admin.")
    : host === "admin.gemshouse.shop";

  const isStorefrontPath =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    pathname !== "/login";

  // 2. Subdomain Routing & Enforcements
  if (isAdminDomain) {
    // If accessing the root of the admin subdomain, redirect to the admin dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // If on admin subdomain and accessing other storefront pages, redirect to main storefront domain
    if (isStorefrontPath) {
      const mainDomain = isLocalhost ? `localhost:${host.split(":")[1] || "3000"}` : "gemshouse.shop";
      const protocol = isLocalhost ? "http" : "https";
      return NextResponse.redirect(
        new URL(`${protocol}://${mainDomain}${pathname}${request.nextUrl.search}`)
      );
    }
  } else {
    // If on main domain and attempting to access admin or login routes, return 404 (pretend they don't exist)
    if (pathname.startsWith("/admin") || pathname === "/login") {
      return NextResponse.rewrite(new URL("/_not-found", request.url));
    }
  }

  // 3. Normal Admin Protection for /admin/*
  if (pathname.startsWith("/admin")) {
    const adminUser = await getAdminUser(request);
    if (!adminUser) {
      // Redirect to login page
      const loginUrl = new URL("/login", request.url);
      // Keep track of redirect URL
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Protect API write endpoints (POST/PUT/DELETE on /api/*)
  if (pathname.startsWith("/api")) {
    const { method } = request;

    // GET requests are public
    if (method === "GET") {
      return NextResponse.next();
    }

    // Exclude public write endpoints:
    // - POST /api/auth (Login)
    // - DELETE /api/auth (Logout)
    // - POST /api/inquiries (Contact form submission)
    // - POST /api/dealers (Wholesale request submission)
    // - POST /api/reviews (Review submission)
    const isPublicAuth = pathname === "/api/auth";
    const isPublicInquiry = pathname === "/api/inquiries" && method === "POST";
    const isPublicDealer = pathname === "/api/dealers" && method === "POST";
    const isPublicReview = pathname === "/api/reviews" && method === "POST";

    if (isPublicAuth || isPublicInquiry || isPublicDealer || isPublicReview) {
      return NextResponse.next();
    }

    // All other POST/PUT/DELETE APIs require admin auth
    const adminUser = await getAdminUser(request);
    if (!adminUser) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized access" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded files in public)
     * - images (design system images in public)
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads|images).*)",
  ],
};