import { NextResponse } from 'next/server';
import { adminConfigured, checkPassword, createSessionValue, SESSION_COOKIE, sessionCookieOptions } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  let password = '';
  try {
    password = String((await req.json())?.password ?? '');
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // ralentit les essais en série
    console.warn('[admin] mot de passe incorrect');
    return NextResponse.json({ ok: false, error: 'wrong_password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions);
  return res;
}
