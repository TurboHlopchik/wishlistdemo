/* ============================================================
   Нормализация подарка и публичное представление состояния.
   ============================================================ */
import { clean, slugify } from './http.js';

export const MAX_GIFTS = 60;

/** Приводит присланный админом подарок к безопасному виду. Бросает Error с текстом для UI. */
export function normalizeGift(input, existingIds = []) {
  /* \r\n от textarea приводим к одному \n, лишние переносы схлопываем */
  const title = clean(input?.title, 80, { allowNewlines: true })
    .replace(/\r\n?/g, '\n')
    .replace(/\n{2,}/g, '\n');
  if (title.replace(/\s/g, '').length < 2) throw new Error('Название слишком короткое');

  const price = Math.round(Number(input?.price));
  if (!Number.isFinite(price) || price < 0 || price > 10_000_000) {
    throw new Error('Цена должна быть числом от 0 до 10 000 000');
  }

  const art = clean(input?.art, 300) || 'g-present';
  /* Три разрешённые формы, ничего больше: никаких javascript: и data: */
  const isSymbol = /^g-[a-z0-9-]+$/.test(art);                                    /* рисунок из спрайта */
  const isPhoto  = /^assets\/img\/gifts\/[a-z0-9._-]+\.(png|jpe?g|webp|svg)$/i.test(art); /* своя фотография */
  const isHttps  = /^https:\/\/[^\s"'<>]+$/i.test(art);                           /* картинка со стороны */
  if (!isSymbol && !isPhoto && !isHttps) {
    throw new Error('Иллюстрация: выберите рисунок, фотографию или дайте https-ссылку');
  }

  let id = clean(input?.id, 40);
  if (!id || !/^[a-z0-9-]+$/.test(id)) {
    id = slugify(title);
    let candidate = id;
    let n = 2;
    while (existingIds.includes(candidate)) candidate = `${id}-${n++}`;
    id = candidate;
  }

  const gift = { id, title, price, art };
  const link = clean(input?.link, 500);
  if (link) {
    if (!/^https?:\/\/[^\s"'<>]+$/i.test(link)) throw new Error('Ссылка на магазин должна начинаться с http(s)://');
    gift.link = link;
  }
  return gift;
}

/** То, что видит гость: имена дарителей, но никаких контактов и пожеланий. */
export function publicReservations(reservations) {
  const out = {};
  for (const [giftId, r] of Object.entries(reservations || {})) {
    out[giftId] = { by: r?.secret ? null : (r?.name || null), at: r?.at || null };
  }
  return out;
}
