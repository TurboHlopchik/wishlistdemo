/* ============================================================
   Хранилище: Upstash Redis (прод) или локальный JSON-файл (разработка).
   Зависимостей нет — с Upstash общаемся его REST API через fetch.

   Ключи (префикс задаёт KEY_PREFIX, по умолчанию wishlist):
     <prefix>:gifts  → JSON-массив каталога подарков
     <prefix>:res    → HASH: giftId → JSON брони
   ============================================================ */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEED_GIFTS } from './seed.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/* Vercel Marketplace прокидывает KV_*, Upstash напрямую — UPSTASH_* */
const REST_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL   || '';
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

export const isRemote = Boolean(REST_URL && REST_TOKEN);

/* Префикс ключей: позволяет нескольким сайтам жить в одной базе Redis */
const PREFIX  = process.env.KEY_PREFIX || 'wishlist';
const K_GIFTS = `${PREFIX}:gifts`;
const K_RES   = `${PREFIX}:res`;

/* ---------- Redis через REST ---------- */
async function redis(...command) {
  const res = await fetch(REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Redis ${res.status}: ${text.slice(0, 200)}`);
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error(`Redis вернул не JSON: ${text.slice(0, 200)}`); }
  if (data.error) throw new Error(`Redis: ${data.error}`);
  return data.result;
}

/* ---------- Локальный файл ---------- */
const FILE = path.join(ROOT, '.data', 'db.json');
let writeQueue = Promise.resolve();   /* сериализуем записи — процесс один */

async function fileRead() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return { gifts: null, reservations: {} };
  }
}

function fileWrite(mutate) {
  /* каждая запись ждёт предыдущую, поэтому read-modify-write безопасен */
  writeQueue = writeQueue.then(async () => {
    const db = await fileRead();
    const result = await mutate(db);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(db, null, 2));
    return result;
  });
  return writeQueue;
}

/* ============================================================
   Каталог подарков
   ============================================================ */
function seedGifts() {
  /* копия, чтобы вызывающий не смог случайно испортить исходный массив */
  return SEED_GIFTS.map(g => ({ ...g }));
}

export async function readGifts() {
  if (isRemote) {
    const raw = await redis('GET', K_GIFTS);
    if (raw) return typeof raw === 'string' ? JSON.parse(raw) : raw;
    const seed = seedGifts();
    await redis('SET', K_GIFTS, JSON.stringify(seed));
    return seed;
  }
  const db = await fileRead();
  if (db.gifts) return db.gifts;
  const seed = seedGifts();
  await fileWrite(d => { d.gifts = seed; });
  return seed;
}

export async function writeGifts(gifts) {
  if (isRemote) {
    await redis('SET', K_GIFTS, JSON.stringify(gifts));
    return gifts;
  }
  return fileWrite(d => { d.gifts = gifts; return gifts; });
}

/* ============================================================
   Брони
   ============================================================ */
export async function readReservations() {
  if (isRemote) {
    const flat = await redis('HGETALL', K_RES);
    const out = {};
    if (Array.isArray(flat)) {
      /* HGETALL приходит плоским списком: field, value, field, value… */
      for (let i = 0; i < flat.length; i += 2) {
        try { out[flat[i]] = JSON.parse(flat[i + 1]); } catch { /* битая запись — пропускаем */ }
      }
    } else if (flat && typeof flat === 'object') {
      for (const [k, v] of Object.entries(flat)) {
        try { out[k] = typeof v === 'string' ? JSON.parse(v) : v; } catch { /* пропускаем */ }
      }
    }
    return out;
  }
  const db = await fileRead();
  return db.reservations || {};
}

/**
 * Атомарно занимает подарок. Возвращает true, если бронь поставлена,
 * и false — если кто-то успел раньше. Гонки двух гостей исключены.
 */
export async function reserve(giftId, payload) {
  if (isRemote) {
    const ok = await redis('HSETNX', K_RES, giftId, JSON.stringify(payload));
    return ok === 1;
  }
  return fileWrite(d => {
    d.reservations = d.reservations || {};
    if (d.reservations[giftId]) return false;
    d.reservations[giftId] = payload;
    return true;
  });
}

export async function cancel(giftId) {
  if (isRemote) {
    const removed = await redis('HDEL', K_RES, giftId);
    return removed === 1;
  }
  return fileWrite(d => {
    if (!d.reservations || !d.reservations[giftId]) return false;
    delete d.reservations[giftId];
    return true;
  });
}

/** Полная очистка: пустой каталог и ни одной брони. */
export async function clearAll() {
  if (isRemote) {
    await redis('SET', K_GIFTS, JSON.stringify([]));
    await redis('DEL', K_RES);
    return true;
  }
  return fileWrite(d => { d.gifts = []; d.reservations = {}; return true; });
}

export async function readReservation(giftId) {
  if (isRemote) {
    const raw = await redis('HGET', K_RES, giftId);
    if (!raw) return null;
    try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
  }
  const db = await fileRead();
  return (db.reservations || {})[giftId] || null;
}
