import { NextResponse, type NextRequest } from 'next/server';

import { AUTH_COOKIE } from '@/constants';
import { verifyToken } from '@/utils/session';

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = process.env.JWT_SECRET ?? '';
  const user = secret ? await verifyToken(request.cookies.get(AUTH_COOKIE)?.value, secret) : null;

  if (pathname === '/login') {
    return user ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next();
  }
  if (!user) {
    const url = new URL('/login', request.url);
    if (pathname !== '/') url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|serwist|~offline|manifest\\.webmanifest|favicon|android-chrome|apple-touch-icon|products/|.*\\.(?:png|jpg|jpeg|svg|ico|webp|txt|js)$).*)',
  ],
};
