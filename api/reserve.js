/* POST /api/reserve — бронирование подарка и отмена своей брони.
   { action: 'reserve', giftId, name, contact, note, secret }
   { action: 'cancel',  giftId, token }                                     */
import crypto from 'node:crypto';
import { readGifts, readReservation, reserve, cancel } from './_lib/store.js';
import { publicReservations } from './_lib/gifts.js';
import { readBody, send, fail, clean } from './_lib/http.js';
import { readReservations } from './_lib/store.js';

async function publicState() {
  const [gifts, reservations] = await Promise.all([readGifts(), readReservations()]);
  return { gifts, reserved: publicReservations(reservations) };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Только POST');

  let body;
  try { body = await readBody(req); }
  catch { return fail(res, 413, 'Слишком большой запрос'); }

  const giftId = clean(body.giftId, 40);
  if (!giftId) return fail(res, 400, 'Не указан подарок');

  try {
    const gifts = await readGifts();
    if (!gifts.some(g => g.id === giftId)) return fail(res, 404, 'Такого подарка больше нет в списке');

    /* ---------- отмена своей брони ---------- */
    if (body.action === 'cancel') {
      const current = await readReservation(giftId);
      if (!current) return send(res, 200, { ok: true, ...(await publicState()) });

      const given = clean(body.token, 80);
      /* Отменить может только тот, кто бронировал — по выданному ему токену */
      if (!given || given !== current.token) {
        return fail(res, 403, 'Эту бронь оформляли не с этого устройства');
      }
      await cancel(giftId);
      return send(res, 200, { ok: true, ...(await publicState()) });
    }

    /* ---------- бронирование ---------- */
    const name = clean(body.name, 60);
    if (name.length < 2) return fail(res, 400, 'Напишите имя — хотя бы 2 буквы');

    const token = crypto.randomUUID();
    const payload = {
      name,
      contact: clean(body.contact, 60),
      note: clean(body.note, 200, { allowNewlines: true }),
      secret: Boolean(body.secret),
      at: new Date().toISOString(),
      token
    };

    const won = await reserve(giftId, payload);
    if (!won) {
      /* кто-то успел за доли секунды до нас */
      return send(res, 409, {
        ok: false,
        error: 'Этот подарок только что забронировали. Выберите, пожалуйста, другой.',
        ...(await publicState())
      });
    }

    return send(res, 200, { ok: true, token, ...(await publicState()) });
  } catch (err) {
    console.error('reserve:', err);
    return fail(res, 500, 'Не получилось сохранить бронь, попробуйте ещё раз');
  }
}
