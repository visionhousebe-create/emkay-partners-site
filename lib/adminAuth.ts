// Authentification de l'administration (serveur uniquement).
// Mot de passe : variable Vercel ADMIN_PASSWORD. Session : cookie httpOnly signé (HMAC-SHA256), valable 12 h.
// Changer ADMIN_PASSWORD invalide toutes les sessions en cours.

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'emk_admin';
export const SESSION_TTL_S = 12 * 60 * 60;

const secret = () => process.env.ADMIN_PASSWORD || '';
export const adminConfigured = () => secret().length >= 12;

const sign = (payload: string) => createHmac('sha256', `emkay-admin:${secret()}`).update(payload).digest('base64url');
const sameDigest = (a: string, b: string) => timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

export function checkPassword(input: string) {
  return adminConfigured() && sameDigest(input, secret());
}

export function createSessionValue() {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_TTL_S);
  return `${exp}.${sign(exp)}`;
}

export function isValidSession(value: string | undefined) {
  if (!value || !adminConfigured()) return false;
  const [exp, sig] = value.split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return sameDigest(sig, sign(exp));
}

export async function isAdmin() {
  return isValidSession((await cookies()).get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: SESSION_TTL_S,
};
