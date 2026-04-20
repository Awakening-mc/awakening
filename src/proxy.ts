import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { server_validateToken } from './actions/auth-actions'
const protectedRoutes = ['/dashboard', '/members', '/events'];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("awakening-app-token")?.value;
    const url = request.nextUrl.clone();
    if (protectedRoutes.some(route => url.pathname.startsWith(route))) {
        if (!token) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        const isValid = server_validateToken(token);
        if (!isValid) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }
    return NextResponse.next();
}
 
export const config = {
  matcher: '/(dashboard|members|events|login|register)(.*)?',
}