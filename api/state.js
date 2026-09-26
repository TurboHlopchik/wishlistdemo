/* GET /api/state — каталог подарков и кто уже занят. Публичный, без личных данных. */
import { readGifts, readReservations } from './_lib/store.js';
import { publicReservations } from './_lib/gifts.js';
import { send, fail } from './_lib/http.js';
import { sessionScope } from './_lib/demo.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return fail(res, 405, 'Только GET');
  const scope = sessionScope(req, res);
  try {
    const [gifts, reservations] = await Promise.all([readGifts(scope), readReservations(scope)]);
    return send(res, 200, {
      ok: true,
      gifts,
      reserved: publicReservations(reservations)
    });
  } catch (err) {
    console.error('state:', err);
    return fail(res, 500, 'Не получилось загрузить список подарков');
  }
}
