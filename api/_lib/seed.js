/* ============================================================
   Стартовый список подарков.

   Используется РОВНО ОДИН РАЗ — когда база ещё пуста. Дальше каталог
   живёт в хранилище и правится через админку, этот файл больше не читается.

   Обычный модуль, а не JSON: статический импорт гарантированно попадает
   в бандл serverless-функции, а чтение файла через fs — нет.
   ============================================================ */
export const SEED_GIFTS = [
  { id: "cube",     art: "g-cube",      title: "Деревянный\nразвивающий куб",   price: 4990 },
  { id: "bike",     art: "g-bike",      title: "Беговел",                       price: 8490 },
  { id: "book",     art: "g-book",      title: "Музыкальная\nкнижка",           price: 2190 },
  { id: "bath",     art: "g-bath",      title: "Игрушки\nдля ванны",            price: 1690 },
  { id: "doll",     art: "g-doll",      title: "Мягкая кукла",                  price: 2990 },
  { id: "light",    art: "g-light",     title: "Ночник «Зайка»",                price: 2490 },
  { id: "pyramid",  art: "g-pyramid",   title: "Пирамидка",                     price: 2290 },
  { id: "sorter",   art: "g-sorter",    title: "Сортер\nпо формам",             price: 3490 },
  { id: "shoes",    art: "g-shoes",     title: "Первые\nкроссовки",             price: 4790 },
  { id: "towel",    art: "g-towel",     title: "Полотенце\nс капюшоном",        price: 3990 },
  { id: "dishes",   art: "g-dishes",    title: "Детская посуда",                price: 2590 },
  { id: "album",    art: "g-album",     title: "Фотоальбом\nпервого года",      price: 1990 },
  { id: "teddy",    art: "g-teddy",     title: "Мягкий мишка",                  price: 3290 },
  { id: "xylo",     art: "g-xylo",      title: "Ксилофон",                      price: 2890 },
  { id: "cups",     art: "g-cups",      title: "Стаканчики-\nпирамидка",        price: 1290 },
  { id: "horse",    art: "g-horse",     title: "Качалка-лошадка",               price: 6990 },
  { id: "tipi",     art: "g-tipi",      title: "Вигвам для игр",                price: 7490 },
  { id: "hat",      art: "g-hat",       title: "Летняя панамка",                price: 1490 },
  { id: "blocks",   art: "g-blocks",    title: "Кубики\nс буквами",             price: 2190 },
  { id: "walker",   art: "g-walker",    title: "Каталка-машинка",               price: 5490 },
];
