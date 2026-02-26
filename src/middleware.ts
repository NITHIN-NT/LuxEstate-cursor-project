import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Public admin routes (login + forgot password)
    const publicRoutes = ["/admin/login", "/admin/forgot-password"];
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // API auth routes are public
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Protect all /admin/* routes
    if (pathname.startsWith("/admin")) {
        if (!req.auth) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/api/auth/:path*"],
};
