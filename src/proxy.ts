import { NextResponse, type NextRequest } from 'next/server';

import { AUTH_COOKIE } from '@/constants';
import { verifyToken } from '@/utils/session';

function safeNextPath(next: string | null): string | null {
  if (!next) return null;
  // only allow relative in-app paths
  if (!next.startsWith('/') || next.startsWith('//')) return null;
  return next;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = process.env.JWT_SECRET ?? '';
  const user = secret ? await verifyToken(request.cookies.get(AUTH_COOKIE)?.value, secret) : null;

  if (pathname === '/login') {
    if (!user) return NextResponse.next();
    const next = safeNextPath(request.nextUrl.searchParams.get('next'));
    return NextResponse.redirect(new URL(next ?? '/', request.url));
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
    '/((?!api|_next/static|_next/image|serwist|~offline|manifest\\.webmanifest|favicon|android-chrome|apple-touch-icon|.*\\.(?:png|jpg|jpeg|svg|ico|webp|txt|js)$).*)',
  ],
};
