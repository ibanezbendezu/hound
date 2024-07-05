import { NextResponse, NextRequest } from 'next/server'
import cookie from 'cookie';

export function middleware(req: NextRequest) {
/*     const cookies = cookie.parse(req.headers.get("Cookie") || "");
    const token = cookies.jwt;

    if (req.nextUrl.pathname.startsWith("/login") && token) {
        console.log("Ya estás logueado");
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (!token && req.nextUrl.pathname.startsWith("/home")) {
        console.log("No estas logueado");
        return NextResponse.redirect(new URL("/login", req.url));
    }

  return NextResponse.next()
 */  
}

/* export function middleware(req: NextRequest) {
    const cookies = cookie.parse(req.headers.get("Cookie") || "");
    const token = cookies.jwt;

    let tokenData;

    if (token) {
        tokenData = parseJwt(token.toString());
    }

    if ((req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname === "/") && token) {
        console.log("Ya estás logueado");
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (!token && req.nextUrl.pathname.startsWith("/home")) {
        console.log("No estas logueado");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
} */

