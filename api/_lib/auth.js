/* ============================================================
   Сессия админа: подписанная HMAC-кука, без базы и без зависимостей.
   ============================================================ */
import crypto from 'node:crypto';

const PASSWORD = process.env.ADMIN_PASSWORD || '';
const SECRET   = process.env.ADMIN_SECRET || PASSWORD || 'dev-secret-not-for-production';
const COOKIE   = 'alisa_admin';
const TTL_MS   = 7 * 24 * 60 * 60 * 1000;   /* неделя */

export const passwordConfigured = Boolean(PASSWORD);

function hmac(data) {
  return crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
}

/** Сравнение без утечки по времени */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function checkPassword(input) {
  if (!PASSWORD) return false;
  return safeEqual(input ?? '', PASSWORD);
}

export function makeToken() {
  const expires = Date.now() + TTL_MS;
  return `${expires}.${hmac(String(expires))}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string') return false;
  const [expires, sig] = token.split('.');
  if (!expires || !sig) return false;
  if (Number(expires) < Date.now()) return false;
  return safeEqual(sig, hmac(expires));
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function isAdmin(req) {
  return verifyToken(parseCookies(req.headers?.cookie)[COOKIE]);
}

export function sessionCookie(token) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? ' Secure;' : '';
  return token
    ? `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${TTL_MS / 1000}`
    : `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=0`;
}
