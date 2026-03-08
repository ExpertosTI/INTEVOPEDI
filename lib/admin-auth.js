import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'intevopedi_admin_session';
const SESSION_TTL = 1000 * 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_ACCESS_PASSWORD || 'intevopedi-local-admin';
}

function sign(value) {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

function encode(payload) {
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${base}.${sign(base)}`;
}

function decode(rawValue) {
  if (!rawValue || !rawValue.includes('.')) {
    return null;
  }

  const [base, signature] = rawValue.split('.');
  const expected = sign(base);

  if (expected.length !== signature.length) {
    return null;
  }

  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(base, 'base64url').toString('utf8'));

  if (!payload?.expiresAt || payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
}

export async function createAdminSession() {
  const expiresAt = Date.now() + SESSION_TTL;
  const cookieStore = cookies();

  cookieStore.set(COOKIE_NAME, encode({ expiresAt }), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
    priority: 'high'
  });
}

export async function destroyAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const value = cookies().get(COOKIE_NAME)?.value;
  return Boolean(decode(value));
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }
}
