/* ============================================================
   Локальный сервер для разработки: статика + те же обработчики /api,
   что уедут на Vercel. Данные лежат в .data/db.json.

       npm run dev     →  http://localhost:4173

   Пароль админки берётся из ADMIN_PASSWORD, по умолчанию — «alisa».
   ============================================================ */
import http from 'node:http';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 4173;

process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'alisa';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

/* Обработчики грузим лениво, чтобы правки в api/ подхватывались перезапуском */
const routes = {
  '/api/state': () => import('../api/state.js'),
  '/api/reserve': () => import('../api/reserve.js'),
  '/api/admin': () => import('../api/admin.js')
};

/** Доводим node-овский res до вида, который ждут обработчики Vercel */
function decorate(res) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = payload => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
    return res;
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  decorate(res);
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  /* ---------- API ---------- */
  const route = routes[pathname];
  if (route) {
    try {
      const mod = await route();
      req.query = Object.fromEntries(url.searchParams);
      await mod.default(req, res);
    } catch (err) {
      console.error(`[api] ${pathname}:`, err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ ok: false, error: 'Внутренняя ошибка' }));
      }
    }
    return;
  }

  if (pathname.startsWith('/api/')) {
    res.statusCode = 404;
    res.end(JSON.stringify({ ok: false, error: 'Нет такого метода' }));
    return;
  }

  /* ---------- статика ---------- */
  let rel = pathname === '/' ? '/index.html' : pathname;
  if (!path.extname(rel)) rel += '.html';          /* cleanUrls, как на Vercel */

  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) {                    /* защита от ../ */
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  try {
    const data = await fs.readFile(file);
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>404</h1><p>Страница не найдена</p>');
  }
});

server.listen(PORT, () => {
  console.log(`\n  Список подарков Алисы — http://localhost:${PORT}`);
  console.log(`  Админка               — http://localhost:${PORT}/admin  (пароль: ${process.env.ADMIN_PASSWORD})`);
  console.log(`  Хранилище             — .data/db.json\n`);
});
