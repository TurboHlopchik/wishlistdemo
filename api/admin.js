/* POST /api/admin — вход и всё управление списком.
   { action: 'login', password }         → ставит куку сессии
   { action: 'logout' }
   { action: 'data' }                    → полные данные, включая контакты
   { action: 'cancel-reservation', giftId }
   { action: 'save-gift', gift }         → добавить или изменить
   { action: 'delete-gift', id }
   { action: 'clear-catalog', confirm: 'ОЧИСТИТЬ' }  → пустой список и ноль броней
   { action: 'reorder', ids }                                              */
import { readGifts, writeGifts, readReservations, cancel, clearAll } from './_lib/store.js';
import { normalizeGift, MAX_GIFTS } from './_lib/gifts.js';
import { readBody, send, fail, clean } from './_lib/http.js';
import { sessionScope } from './_lib/demo.js';
import { checkPassword, makeToken, sessionCookie, isAdmin, passwordConfigured } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Только POST');

  let body;
  try { body = await readBody(req); }
  catch { return fail(res, 413, 'Слишком большой запрос'); }

  const action = clean(body.action, 40);

  /* ---------- вход ---------- */
  if (action === 'login') {
    if (!passwordConfigured) {
      return fail(res, 503, 'Пароль администратора не задан: добавьте переменную ADMIN_PASSWORD');
    }
    /* небольшая задержка гасит перебор пароля */
    await new Promise(r => setTimeout(r, 400));
    if (!checkPassword(body.password)) return fail(res, 401, 'Неверный пароль');
    res.setHeader('Set-Cookie', sessionCookie(makeToken()));
    return send(res, 200, { ok: true });
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', sessionCookie(null));
    return send(res, 200, { ok: true });
  }

  /* ---------- дальше только для админа ---------- */
  if (!isAdmin(req)) return fail(res, 401, 'Нужно войти');

  /* в демо админ видит и меняет только данные своей браузерной сессии */
  const scope = sessionScope(req, res);

  try {
    switch (action) {
      case 'data': {
        const [gifts, reservations] = await Promise.all([readGifts(scope), readReservations(scope)]);
        /* токен отмены наружу не отдаём — он личный для гостя */
        const safe = {};
        for (const [id, r] of Object.entries(reservations)) {
          const { token, ...rest } = r;
          safe[id] = rest;
        }
        return send(res, 200, { ok: true, gifts, reservations: safe });
      }

      case 'cancel-reservation': {
        const giftId = clean(body.giftId, 40);
        if (!giftId) return fail(res, 400, 'Не указан подарок');
        await cancel(giftId, scope);
        break;
      }

      case 'save-gift': {
        const gifts = await readGifts(scope);
        const incoming = body.gift || {};
        const existingIndex = gifts.findIndex(g => g.id === clean(incoming.id, 40));

        if (existingIndex < 0 && gifts.length >= MAX_GIFTS) {
          return fail(res, 400, `В списке уже ${MAX_GIFTS} подарков — больше не помещается`);
        }

        let gift;
        try {
          const otherIds = gifts.filter((_, i) => i !== existingIndex).map(g => g.id);
          gift = normalizeGift(incoming, otherIds);
        } catch (err) {
          return fail(res, 400, err.message);
        }

        /* заменяем запись целиком, а не сливаем со старой: при слиянии
           очищенное поле (например, убранная ссылка) не удалялось бы */
        if (existingIndex >= 0) gifts[existingIndex] = gift;
        else gifts.push(gift);

        await writeGifts(gifts, scope);
        break;
      }

      case 'delete-gift': {
        const id = clean(body.id, 40);
        const gifts = await readGifts(scope);
        const next = gifts.filter(g => g.id !== id);
        if (next.length === gifts.length) return fail(res, 404, 'Подарок не найден');
        await writeGifts(next, scope);
        await cancel(id, scope);   /* вместе с подарком снимаем и его бронь */
        break;
      }

      case 'clear-catalog': {
        /* Полная очистка списка вместе с бронями — только по явному подтверждению */
        if (body.confirm !== 'ОЧИСТИТЬ') return fail(res, 400, 'Очистка не подтверждена');
        await clearAll(scope);
        break;
      }

      case 'reorder': {
        const ids = Array.isArray(body.ids) ? body.ids.map(x => clean(x, 40)) : [];
        const gifts = await readGifts(scope);
        const byId = new Map(gifts.map(g => [g.id, g]));
        const next = ids.map(id => byId.get(id)).filter(Boolean);
        /* всё, что не пришло в списке, оставляем в конце — ничего не теряем */
        for (const g of gifts) if (!ids.includes(g.id)) next.push(g);
        await writeGifts(next, scope);
        break;
      }

      default:
        return fail(res, 400, 'Неизвестное действие');
    }

    const [gifts, reservations] = await Promise.all([readGifts(scope), readReservations(scope)]);
    const safe = {};
    for (const [id, r] of Object.entries(reservations)) {
      const { token, ...rest } = r;
      safe[id] = rest;
    }
    return send(res, 200, { ok: true, gifts, reservations: safe });
  } catch (err) {
    console.error('admin:', err);
    return fail(res, 500, 'Не получилось выполнить действие');
  }
}
