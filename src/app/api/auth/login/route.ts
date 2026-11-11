import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/db/client';
import { users } from '@/db/schema/users';
import { loginSchema } from '@/lib/shemas';
import { AUTH_COOKIE, TOKEN_TTL_SECONDS } from '@/constants';
import { verifyPassword } from '@/utils/hash';
import { getJwtSecretString, signToken } from '@/utils/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalidInput' }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)
    .then((rows) => rows[0]);
  const valid = await verifyPassword(password, user?.passwordHash);

  if (!user || !valid) {
    return NextResponse.json({ error: 'invalidCredentials' }, { status: 401 });
  }

  const sessionUser = { id: user.id, email: user.email, displayName: user.displayName };
  const token = await signToken(sessionUser, getJwtSecretString());
  const response = NextResponse.json({ user: sessionUser });

  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_TTL_SECONDS,
  });
  return response;
}
