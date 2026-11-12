import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

import { SessionUser } from '@/types';
import { AUTH_COOKIE, TOKEN_TTL_SECONDS } from '@/constants';

const encodeSecret = (secret: string) => new TextEncoder().encode(secret);

export async function verifyToken(
  token: string | undefined | null,
  secret: string
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodeSecret(secret), { algorithms: ['HS256'] });
    const id = Number(payload.sub);
    if (!Number.isInteger(id) || typeof payload.email !== 'string') return null;
    return { id, email: payload.email, displayName: String(payload.name ?? payload.email) };
  } catch {
    return null;
  }
}

export const getJwtSecretString = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and be at least 32 characters long');
  }
  return secret;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifyToken(store.get(AUTH_COOKIE)?.value, getJwtSecretString());
}

export async function signToken(user: SessionUser, secret: string): Promise<string> {
  return new SignJWT({ email: user.email, name: user.displayName })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(encodeSecret(secret));
}
