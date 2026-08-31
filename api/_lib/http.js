/* ============================================================
   Мелкие помощники для обработчиков: тело запроса, валидация, ответы.
   ============================================================ */

/** Vercel сам парсит JSON-тело, локальный сервер — нет. Поддерживаем оба. */
export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error('too-large');   /* защита от мусора */
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
}

export function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function fail(res, status, message) {
  return send(res, status, { ok: false, error: message });
}

/* Управляющие символы: всё, кроме перевода строки */
const CTRL_ALL = /[\u0000-\u001F\u007F]/g;
const CTRL_KEEP_NEWLINE = /[\u0000-\u0009\u000B-\u001F\u007F]/g;

/** Обрезает строку, убирая управляющие символы (перевод строки — по флагу) */
export function clean(value, maxLength, { allowNewlines = false } = {}) {
  const strip = allowNewlines ? CTRL_KEEP_NEWLINE : CTRL_ALL;
  return String(value ?? '').replace(strip, '').trim().slice(0, maxLength);
}

/** Латинский идентификатор из русского названия — для id нового подарка */
export function slugify(text) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
    й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y',
    ь: '', э: 'e', ю: 'yu', я: 'ya'
  };
  return String(text ?? '')
    .toLowerCase()
    .replace(/[а-яё]/g, ch => map[ch] ?? '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'gift';
}
