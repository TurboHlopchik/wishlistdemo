/* ============================================================
   Демо-режим (DEMO_SESSIONS=1): у каждой браузерной сессии свои брони.

   Сайт показывают многим потенциальным клиентам. Если брони общие, первые
   посетители займут весь список, и остальным нечего будет попробовать.
   Поэтому каждому браузеру выдаём сессионную куку (без Max-Age — живёт,
   пока открыт браузер), а брони храним отдельно под её id.
   Каталог подарков при этом общий.
   ============================================================ */
import crypto from 'node:crypto';
import { parseCookies } from './auth.js';

export const demoSessions = process.env.DEMO_SESSIONS === '1';

const COOKIE = 'demo_session';
const ID_RE  = /^[0-9a-f-]{36}$/;

/** id демо-сессии для хранилища или null, если демо-режим выключен. */
export function reservationScope(req, res) {
  if (!demoSessions) return null;
  const existing = parseCookies(req.headers?.cookie)[COOKIE];
  if (existing && ID_RE.test(existing)) return existing;

  const id = crypto.randomUUID();
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? ' Secure;' : '';
  const prev = res.getHeader('Set-Cookie');
  const cookie = `${COOKIE}=${id}; Path=/; HttpOnly; SameSite=Lax;${secure}`;
  res.setHeader('Set-Cookie', prev ? [].concat(prev, cookie) : cookie);
  return id;
}
