import { auth } from "@/lib/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
    const isOnAuth = req.nextUrl.pathname.startsWith("/auth")

    if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return null;
        return Response.redirect(new URL("/auth/login", req.nextUrl));
    }

    if (isOnAuth) {
        if (isLoggedIn) {
            if (req.auth.user?.role === "ADMIN") {
                return Response.redirect(new URL("/admin/dashboard", req.nextUrl));
            }
            return Response.redirect(new URL("/dashboard", req.nextUrl));
        }
    }

    return null
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
