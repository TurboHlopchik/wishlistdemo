/* ============================================================
   Стартовый список подарков.

   Используется РОВНО ОДИН РАЗ — когда база ещё пуста. Дальше каталог
   живёт в хранилище и правится через админку, этот файл больше не читается.

   Обычный модуль, а не JSON: статический импорт гарантированно попадает
   в бандл serverless-функции, а чтение файла через fs — нет.
   ============================================================ */
export const SEED_GIFTS = [
  { id: "learning-tower", art: "assets/img/gifts/learning-tower.png",          title: "Башня-помощник",               price: 12900 },
  { id: "pikler",         art: "assets/img/gifts/pikler-climbing-set.png",     title: "Комплекс Пиклера",             price: 15500 },
  { id: "tipi",           art: "assets/img/gifts/kids-tipi.png",               title: "Вигвам для игр",               price: 7490 },
  { id: "busy-board",     art: "assets/img/gifts/busy-board-cube.png",         title: "Бизиборд-куб",                 price: 5990 },
  { id: "sorter",         art: "assets/img/gifts/wooden-shape-sorter.png",     title: "Деревянный\nсортер",           price: 2490 },
  { id: "animal-blocks",  art: "assets/img/gifts/animal-blocks-set.png",       title: "Кубики\nс животными",          price: 1990 },
  { id: "soft-blocks",    art: "assets/img/gifts/soft-building-blocks.png",    title: "Мягкие кубики",                price: 2290 },
  { id: "sensory-mats",   art: "assets/img/gifts/sensory-mats.png",            title: "Сенсорные\nковрики",           price: 3490 },
  { id: "turtle-walker",  art: "assets/img/gifts/turtle-push-walker.png",      title: "Каталка-черепашка",            price: 4290 },
  { id: "farm",           art: "assets/img/gifts/farm-animals.png",            title: "Животные фермы",               price: 1790 },
  { id: "words-book",     art: "assets/img/gifts/musical-first-words-book.png",title: "Музыкальная книжка\n«Первые слова»", price: 1590 },
  { id: "sea-book",       art: "assets/img/gifts/tactile-sea-book.png",        title: "Тактильная книжка\n«Море»",     price: 1390 },
  { id: "bunny",          art: "assets/img/gifts/plush-bunny.png",             title: "Плюшевый зайка",               price: 2790 },
  { id: "elephant",       art: "assets/img/gifts/plush-elephant.png",          title: "Плюшевый слоник",              price: 2990 },
  { id: "ducks",          art: "assets/img/gifts/rubber-ducks-set.png",        title: "Резиновые уточки",             price: 890 },
  { id: "feeding",        art: "assets/img/gifts/feeding-set.png",             title: "Набор\nдля кормления",         price: 2190 },
  { id: "xylo",           art: "g-xylo",                                       title: "Ксилофон",                     price: 2890 },
  { id: "light",          art: "g-light",                                      title: "Ночник «Зайка»",               price: 2490 },
  { id: "horse",          art: "g-horse",                                      title: "Качалка-лошадка",              price: 6990 },
  { id: "album",          art: "g-album",                                      title: "Фотоальбом\nпервого года",     price: 1990 },
];
