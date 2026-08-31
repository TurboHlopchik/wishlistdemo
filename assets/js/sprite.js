/* ============================================================
   Общий SVG-спрайт: иконки интерфейса и иллюстрации подарков.
   Подключается обычным <script> в начале <body> — вставляется
   синхронно, до отрисовки, поэтому значки не мигают.
   Используется и на главной, и в админке.
   ============================================================ */
(function () {
  'use strict';
  var SPRITE = `<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
<defs>

<!-- ── UI icons (stroke, currentColor) ── -->
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.5 2.7C20.5 15 12 20.5 12 20.5Z" fill="currentColor"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.5 5.6 6.1.7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6.1-.7L12 3Z" fill="currentColor"/></symbol>
<symbol id="i-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
<symbol id="i-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.4v.1"/></symbol>
<symbol id="i-cursor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5 18.5 11l-5.4 1.6L11 18 6 3.5Z"/><path d="M13.6 13.8 19 19.4"/></symbol>
<symbol id="i-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0 0-3l-1.2-1.2a2.1 2.1 0 0 0-3 0L4 15.8V20Z"/><path d="M13.8 6.2 17.8 10.2"/></symbol>
<symbol id="i-gift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9.5h17V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V9.5Z"/><path d="M2.5 6.5h19v3h-19zM12 6.5V21"/><path d="M12 6.5S10.6 3 8.6 3a2 2 0 0 0 0 3.5H12Zm0 0S13.4 3 15.4 3a2 2 0 0 1 0 3.5H12Z"/></symbol>
<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 2.5c.6 4.6 1.9 5.9 6.5 6.5-4.6.6-5.9 1.9-6.5 6.5-.6-4.6-1.9-5.9-6.5-6.5 4.6-.6 5.9-1.9 6.5-6.5Z" fill="currentColor"/><path d="M19 15c.3 2.3.9 3 3.2 3.2-2.3.3-2.9.9-3.2 3.2-.3-2.3-.9-2.9-3.2-3.2 2.3-.3 2.9-.9 3.2-3.2Z" fill="currentColor" opacity=".6"/></symbol>
<symbol id="i-bag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8h13l1 11.5a1.5 1.5 0 0 1-1.5 1.6H6a1.5 1.5 0 0 1-1.5-1.6L5.5 8Z"/><path d="M9 10V6.8A3 3 0 0 1 12 4a3 3 0 0 1 3 2.8V10"/></symbol>
<symbol id="i-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h4.5"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></symbol>
<symbol id="i-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7"/><path d="M6.5 7.5 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-11.5"/><path d="M10.5 11v6M13.5 11v6"/></symbol>
<symbol id="i-free" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5A8.5 8.5 0 1 1 17.2 5.3"/><path d="M20.5 4v4.5H16"/></symbol>
<symbol id="i-leaf-l" viewBox="0 0 60 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M58 12H14"/><path d="M26 12c-2.6-3.4-6.4-4.2-9.6-3 .8 3.4 3.8 5.6 7.2 5.4M26 12c-2.6 3.4-6.4 4.2-9.6 3 .8-3.4 3.8-5.6 7.2-5.4"/><circle cx="8" cy="12" r="3.4" fill="currentColor" stroke="none"/></symbol>

<!-- ── Brand monogram ── -->
<symbol id="brand-mark" viewBox="0 0 64 64">
  <g class="petals">
    <g fill="#F9C7C0">
      <ellipse cx="32" cy="9"  rx="10" ry="8"/><ellipse cx="55" cy="32" rx="8"  ry="10"/>
      <ellipse cx="32" cy="55" rx="10" ry="8"/><ellipse cx="9"  cy="32" rx="8"  ry="10"/>
      <ellipse cx="48" cy="16" rx="8.5" ry="8.5"/><ellipse cx="48" cy="48" rx="8.5" ry="8.5"/>
      <ellipse cx="16" cy="48" rx="8.5" ry="8.5"/><ellipse cx="16" cy="16" rx="8.5" ry="8.5"/>
    </g>
  </g>
  <path d="M6 34c-3-6 1-13 7-14 2 5-1 12-7 14Z" fill="#A9C6A0"/>
  <path d="M58 34c3-6-1-13-7-14-2 5 1 12 7 14Z" fill="#A9C6A0"/>
  <circle cx="32" cy="32" r="19" fill="#FDF3E7"/>
  <text x="32" y="41" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="24" font-weight="600" fill="#F2867E">А</text>
</symbol>

<!-- ── Floating hero decorations ── -->
<symbol id="d-cloud" viewBox="0 0 100 60"><g fill="#FFFFFF" opacity=".92"><ellipse cx="30" cy="38" rx="24" ry="18"/><ellipse cx="55" cy="30" rx="27" ry="22"/><ellipse cx="76" cy="40" rx="20" ry="16"/></g></symbol>
<symbol id="d-star" viewBox="0 0 40 40"><path d="M20 3c2.2 8.6 8.2 14.6 16.8 16.8C28.2 22 22.2 28 20 36.6 17.8 28 11.8 22 3.2 19.8 11.8 17.6 17.8 11.6 20 3Z" fill="#F5C36B"/></symbol>
<symbol id="d-butterfly" viewBox="0 0 60 50">
  <path d="M29 25C22 10 8 8 5 16c-3 8 8 16 24 9Z" fill="#F6A8B0"/>
  <path d="M31 25C38 10 52 8 55 16c3 8-8 16-24 9Z" fill="#F6A8B0"/>
  <path d="M29 25C24 38 12 44 9 38c-2-5 6-12 20-13Z" fill="#F9C3C9"/>
  <path d="M31 25c5 13 17 19 20 13 2-5-6-12-20-13Z" fill="#F9C3C9"/>
  <rect x="28.5" y="14" width="3" height="24" rx="1.5" fill="#8F6E7A"/>
</symbol>
<symbol id="d-balloon" viewBox="0 0 50 80">
  <ellipse cx="25" cy="28" rx="21" ry="26" fill="#F6A8B0"/>
  <ellipse cx="18" cy="19" rx="6" ry="8" fill="#FFFFFF" opacity=".45"/>
  <path d="M25 54 21 62h8l-4-8Z" fill="#E8919B"/>
  <path d="M25 62c6 6-6 10 0 18" stroke="#E8919B" stroke-width="2" fill="none" stroke-linecap="round"/>
</symbol>
<symbol id="d-moon" viewBox="0 0 60 60"><path d="M40 6a26 26 0 1 0 14 44A22 22 0 0 1 40 6Z" fill="#F7CF8E"/></symbol>
</defs>
</svg>

<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
<defs>
<radialGradient id="glow-warm" cx="50%" cy="45%" r="55%">
  <stop offset="0%" stop-color="#FFF6D8"/><stop offset="60%" stop-color="#FDE9BC" stop-opacity=".7"/><stop offset="100%" stop-color="#F8DCAE" stop-opacity="0"/>
</radialGradient>
<g id="shadow-ground"><ellipse cx="50" cy="90" rx="30" ry="4.6" fill="#E2BCA8" opacity=".42"/></g>

<symbol id="g-present" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <rect x="16" y="44" width="68" height="42" rx="8" fill="#F2867E"/>
  <rect x="12" y="32" width="76" height="16" rx="6" fill="#F5A29B"/>
  <rect x="43" y="32" width="14" height="54" fill="#F8D492"/>
  <path d="M50 32S44 18 36 18a7 7 0 0 0 0 14h14Zm0 0s6-14 14-14a7 7 0 0 1 0 14H50Z" fill="#F8D492"/>
  <circle cx="50" cy="30" r="6" fill="#F5C36B"/>
</symbol>

<!-- 1. Развивающий куб -->
<symbol id="g-cube" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M38 24q6-9 14-3" stroke="#C9A47A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="38" cy="24" r="4" fill="#F3A7A0"/><circle cx="52" cy="21" r="4" fill="#A8D8C4"/>
  <rect x="20" y="28" width="60" height="58" rx="13" fill="#EFCF9F"/>
  <path d="M67 28h0a13 13 0 0 1 13 13v32a13 13 0 0 1-13 13Z" fill="#DDB681"/>
  <rect x="26" y="34" width="41" height="46" rx="9" fill="#F8E3BE"/>
  <circle cx="40" cy="48" r="9" fill="#F3A7A0"/><circle cx="40" cy="48" r="3.4" fill="#FFF4EA"/>
  <circle cx="56" cy="46" r="6" fill="#A6CBE8"/>
  <rect x="33" y="62" width="13" height="13" rx="3.5" fill="#A8D8C4"/>
  <path d="M57 60.5 60 66l6 .8-4.4 4.1 1.1 5.9-5.7-3-5.7 3 1.1-5.9L48 66.8l6-.8 3-5.5Z" fill="#F5C36B"/>
</symbol>

<!-- 2. Беговел -->
<symbol id="g-bike" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M30 70 55 44h18" stroke="#F2867E" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 70h40" stroke="#F2867E" stroke-width="7.5" fill="none" stroke-linecap="round"/>
  <path d="M70 70V47" stroke="#F2867E" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="46" y="36" width="20" height="8" rx="4" fill="#7C6A74"/>
  <path d="M73 44h9" stroke="#7C6A74" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M73 32v12" stroke="#7C6A74" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M64 30h16" stroke="#5E5058" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="30" cy="70" r="17" fill="#5E5058"/><circle cx="30" cy="70" r="8.5" fill="#F6EADD"/><circle cx="30" cy="70" r="3" fill="#C9B4A4"/>
  <circle cx="72" cy="70" r="17" fill="#5E5058"/><circle cx="72" cy="70" r="8.5" fill="#F6EADD"/><circle cx="72" cy="70" r="3" fill="#C9B4A4"/>
</symbol>

<!-- 3. Музыкальная книжка -->
<symbol id="g-book" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <rect x="18" y="20" width="64" height="64" rx="9" fill="#EAB4C4"/>
  <rect x="18" y="20" width="13" height="64" rx="6" fill="#D999AE"/>
  <circle cx="24.5" cy="32" r="2.6" fill="#F7E3D2"/><circle cx="24.5" cy="46" r="2.6" fill="#F7E3D2"/>
  <circle cx="24.5" cy="60" r="2.6" fill="#F7E3D2"/><circle cx="24.5" cy="74" r="2.6" fill="#F7E3D2"/>
  <rect x="34" y="25" width="43" height="54" rx="6" fill="#FBEEDC"/>
  <ellipse cx="47" cy="45" rx="12" ry="11" fill="#F2DCC6"/>
  <ellipse cx="41" cy="31" rx="4" ry="9" fill="#F2DCC6"/><ellipse cx="53" cy="31" rx="4" ry="9" fill="#F2DCC6"/>
  <ellipse cx="41" cy="32" rx="1.8" ry="5.4" fill="#EDB9BC"/><ellipse cx="53" cy="32" rx="1.8" ry="5.4" fill="#EDB9BC"/>
  <circle cx="43" cy="44" r="1.9" fill="#5E5058"/><circle cx="51" cy="44" r="1.9" fill="#5E5058"/>
  <path d="M45 50q2 2 4 0" stroke="#5E5058" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <circle cx="65" cy="63" r="9.5" fill="#F5C36B"/>
  <path d="M62 68V58l7-1.6V66" stroke="#8A6A3E" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="60.4" cy="68" r="2.2" fill="#8A6A3E"/><circle cx="67.4" cy="66" r="2.2" fill="#8A6A3E"/>
  <circle cx="42" cy="63" r="4.6" fill="#A8D8C4"/><circle cx="53" cy="70" r="4" fill="#A6CBE8"/>
</symbol>

<!-- 4. Игрушки для ванны -->
<symbol id="g-bath" viewBox="0 0 100 100">
  <path d="M8 78q10-5 20 0t20 0 20 0 24 0v10H8Z" fill="#BFE0F2"/>
  <path d="M8 78q10-5 20 0t20 0 20 0 24 0" stroke="#9CCDE8" stroke-width="2.6" fill="none"/>
  <ellipse cx="34" cy="55" rx="17" ry="14" fill="#F7CE72"/>
  <circle cx="42" cy="36" r="11" fill="#F7CE72"/>
  <path d="M51 35h9l-8 6Z" fill="#F09A5B"/>
  <circle cx="45" cy="33" r="2.1" fill="#5E5058"/>
  <path d="M22 52q-6 4-2 10" stroke="#EDBB5E" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="72" cy="64" rx="16" ry="12" fill="#8FC4E6"/>
  <path d="M86 60q7-6 10-2-3 6-9 8Z" fill="#8FC4E6"/>
  <circle cx="65" cy="60" r="2.1" fill="#4A5866"/>
  <path d="M64 68q4 3 8 0" stroke="#4A5866" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M70 52q3-8 9-6" stroke="#BFE0F2" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="24" cy="26" r="4" fill="#CFE9F7"/><circle cx="80" cy="30" r="5.5" fill="#CFE9F7"/><circle cx="63" cy="20" r="3" fill="#CFE9F7"/>
</symbol>

<!-- 5. Мягкая кукла -->
<symbol id="g-doll" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M50 60 32 88h36L50 60Z" fill="#F3A7A0"/>
  <path d="M32 88q18 6 36 0l-2-5q-16 5-32 0Z" fill="#E88D89"/>
  <rect x="42" y="52" width="16" height="12" rx="5" fill="#F7DCC8"/>
  <path d="M34 66q-8 6-6 14" stroke="#F7DCC8" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M66 66q8 6 6 14" stroke="#F7DCC8" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M42 88v6M58 88v6" stroke="#F7DCC8" stroke-width="7" stroke-linecap="round"/>
  <circle cx="50" cy="36" r="19" fill="#F7DCC8"/>
  <path d="M31 34a19 19 0 0 1 38 0q-6-9-19-7T31 34Z" fill="#D89A6A"/>
  <circle cx="28" cy="40" r="8" fill="#D89A6A"/><circle cx="72" cy="40" r="8" fill="#D89A6A"/>
  <circle cx="43" cy="37" r="2.6" fill="#5E5058"/><circle cx="57" cy="37" r="2.6" fill="#5E5058"/>
  <circle cx="37" cy="43" r="3.4" fill="#F5B4AC" opacity=".8"/><circle cx="63" cy="43" r="3.4" fill="#F5B4AC" opacity=".8"/>
  <path d="M46 44q4 4 8 0" stroke="#C4796F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M62 22q6-6 11-1-7 0-8 5Z" fill="#F2867E"/>
</symbol>

<!-- 6. Ночник -->
<symbol id="g-light" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#5C4E82"/>
  <circle cx="50" cy="52" r="42" fill="url(#glow-warm)"/>
  <ellipse cx="50" cy="66" rx="21" ry="19" fill="#FCEFC8"/>
  <circle cx="50" cy="44" r="15" fill="#FCEFC8"/>
  <ellipse cx="42" cy="26" rx="5" ry="12" fill="#FCEFC8"/><ellipse cx="58" cy="26" rx="5" ry="12" fill="#FCEFC8"/>
  <ellipse cx="42" cy="27" rx="2.2" ry="7" fill="#F6D9AE"/><ellipse cx="58" cy="27" rx="2.2" ry="7" fill="#F6D9AE"/>
  <circle cx="44.5" cy="43" r="2.1" fill="#7A6248"/><circle cx="55.5" cy="43" r="2.1" fill="#7A6248"/>
  <path d="M47.5 49q2.5 2.5 5 0" stroke="#7A6248" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <g fill="#F7D98C">
    <path d="M20 20c.9 3.4.9 3.4 4.3 4.3-3.4.9-3.4.9-4.3 4.3-.9-3.4-.9-3.4-4.3-4.3 3.4-.9 3.4-.9 4.3-4.3Z"/>
    <path d="M80 30c.8 3 .8 3 3.8 3.8-3 .8-3 .8-3.8 3.8-.8-3-.8-3-3.8-3.8 3-.8 3-.8 3.8-3.8Z"/>
    <path d="M76 66c.7 2.5.7 2.5 3.2 3.2-2.5.7-2.5.7-3.2 3.2-.7-2.5-.7-2.5-3.2-3.2 2.5-.7 2.5-.7 3.2-3.2Z"/>
    <path d="M22 60c.7 2.5.7 2.5 3.2 3.2-2.5.7-2.5.7-3.2 3.2-.7-2.5-.7-2.5-3.2-3.2 2.5-.7 2.5-.7 3.2-3.2Z"/>
    <circle cx="32" cy="40" r="1.7"/><circle cx="68" cy="18" r="1.7"/><circle cx="88" cy="55" r="1.5"/><circle cx="13" cy="45" r="1.5"/>
  </g>
</symbol>

<!-- 7. Пирамидка -->
<symbol id="g-pyramid" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <ellipse cx="50" cy="82" rx="30" ry="7" fill="#EFCF9F"/>
  <rect x="47.5" y="24" width="5" height="56" rx="2.5" fill="#DDB681"/>
  <ellipse cx="50" cy="74" rx="27" ry="8.5" fill="#8FC4E6"/>
  <ellipse cx="50" cy="62" rx="22" ry="7.5" fill="#A8D8C4"/>
  <ellipse cx="50" cy="51" rx="17.5" ry="6.5" fill="#F5C36B"/>
  <ellipse cx="50" cy="41" rx="13" ry="5.5" fill="#F2867E"/>
  <ellipse cx="50" cy="33" rx="9.5" ry="4.5" fill="#C7B4E6"/>
  <ellipse cx="50" cy="23" rx="6.5" ry="6.5" fill="#DDB681"/>
  <ellipse cx="47" cy="21" rx="2" ry="2" fill="#F4DCBB" opacity=".8"/>
</symbol>

<!-- 8. Сортер по формам -->
<symbol id="g-sorter" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <rect x="18" y="30" width="60" height="54" rx="11" fill="#EFCF9F"/>
  <path d="M65 30h0a13 13 0 0 1 13 13v28a13 13 0 0 1-13 13Z" fill="#DDB681"/>
  <rect x="24" y="36" width="41" height="42" rx="7" fill="#F8E3BE"/>
  <circle cx="35" cy="48" r="6.5" fill="#C99C63"/>
  <path d="M53 41.5 60 55H46l7-13.5Z" fill="#C99C63"/>
  <rect x="29" y="61" width="12" height="12" rx="2.5" fill="#C99C63"/>
  <path d="M53 60.5 60 67l-7 6.5L46 67l7-6.5Z" fill="#C99C63"/>
  <rect x="74" y="62" width="17" height="17" rx="3.5" fill="#F2867E" transform="rotate(-9 82 70)"/>
  <path d="M84 40 92 55H76l8-15Z" fill="#A8D8C4"/>
  <circle cx="12" cy="70" r="8" fill="#A6CBE8"/>
</symbol>

<!-- 9. Первые кроссовки -->
<symbol id="g-shoes" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M14 62q4-16 16-16 5 0 7 6l4 8q8 3 12 6t3 8q-.5 4-6 4H20q-6 0-6.5-5Z" fill="#F9E7E4"/>
  <path d="M13 74q0-6 7-6h30q6 0 6 6t-6 6H20q-7 0-7-6Z" fill="#FBFAF8"/>
  <path d="M30 50q4 5 4 12" stroke="#F2C6C0" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M38 54q4 4 4 10" stroke="#F2C6C0" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M22 55q6-1 9 3" stroke="#F2867E" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M50 60q6-16 18-16 5 0 7 6l4 8q8 3 12 6t2 8q-.6 4-6 4H56q-6 0-6-5Z" fill="#F6D9D4"/>
  <path d="M49 74q0-6 7-6h30q6 0 6 6t-6 6H56q-7 0-7-6Z" fill="#FBFAF8"/>
  <path d="M67 48q4 5 4 12" stroke="#E8B0AA" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M75 52q4 4 4 10" stroke="#E8B0AA" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M59 53q6-1 9 3" stroke="#F2867E" stroke-width="3" fill="none" stroke-linecap="round"/>
</symbol>

<!-- 10. Полотенце с капюшоном -->
<symbol id="g-towel" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M50 30q26 0 30 26l6 30H14l6-30q4-26 30-26Z" fill="#F6C9BE"/>
  <path d="M50 30q26 0 30 26l3 15q-15 6-33 6t-33-6l3-15q4-26 30-26Z" fill="#FADCD3"/>
  <circle cx="31" cy="26" r="9" fill="#F6C9BE"/><circle cx="69" cy="26" r="9" fill="#F6C9BE"/>
  <circle cx="31" cy="26" r="4.5" fill="#EFAEA2"/><circle cx="69" cy="26" r="4.5" fill="#EFAEA2"/>
  <path d="M50 18q19 0 21 20-10-6-21-6t-21 6q2-20 21-20Z" fill="#F6C9BE"/>
  <ellipse cx="50" cy="48" rx="10" ry="8" fill="#F7E7DC"/>
  <circle cx="41" cy="41" r="2.5" fill="#7C6A74"/><circle cx="59" cy="41" r="2.5" fill="#7C6A74"/>
  <ellipse cx="50" cy="45" rx="3" ry="2.2" fill="#B98074"/>
  <path d="M46 50q4 4 8 0" stroke="#B98074" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <path d="M22 78h56" stroke="#EFAEA2" stroke-width="3" stroke-linecap="round"/>
</symbol>

<!-- 11. Детская посуда -->
<symbol id="g-dishes" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M14 54h44q0 18-14 22H28q-14-4-14-22Z" fill="#EDE7D6"/>
  <ellipse cx="36" cy="54" rx="22" ry="7" fill="#F8F4E8"/>
  <ellipse cx="36" cy="54" rx="14" ry="4.2" fill="#DCD5C2"/>
  <ellipse cx="30" cy="66" rx="6" ry="5" fill="#D8C9B4"/>
  <ellipse cx="27" cy="63" rx="2" ry="1.8" fill="#F8F4E8"/><ellipse cx="33" cy="63" rx="2" ry="1.8" fill="#F8F4E8"/>
  <ellipse cx="27" cy="63" rx=".9" ry=".9" fill="#7C6A74"/><ellipse cx="33" cy="63" rx=".9" ry=".9" fill="#7C6A74"/>
  <path d="M62 50h24v22q0 8-8 8h-8q-8 0-8-8V50Z" fill="#EDE7D6"/>
  <ellipse cx="74" cy="50" rx="12" ry="4.4" fill="#F8F4E8"/>
  <path d="M86 56q9 0 9 7t-9 7" stroke="#EDE7D6" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="74" cy="66" rx="5.5" ry="4.6" fill="#C9DCCF"/>
  <circle cx="71.5" cy="64.5" r=".9" fill="#5E5058"/><circle cx="76.5" cy="64.5" r=".9" fill="#5E5058"/>
  <circle cx="24" cy="30" r="5" fill="#F5C7C1"/><circle cx="24" cy="30" r="1.8" fill="#F5C36B"/>
  <circle cx="76" cy="26" r="4" fill="#C9DCCF"/>
</symbol>

<!-- 12. Фотоальбом первого года -->
<symbol id="g-album" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <rect x="22" y="16" width="58" height="70" rx="8" fill="#F0F0F2"/>
  <rect x="18" y="14" width="58" height="70" rx="8" fill="#E2CFEA"/>
  <rect x="18" y="14" width="9" height="70" rx="4.5" fill="#CBB2D8"/>
  <rect x="32" y="22" width="36" height="26" rx="6" fill="#FBF3E6"/>
  <text x="50" y="33" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="9" fill="#8B6FA0">Мой</text>
  <text x="50" y="44" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="9" fill="#8B6FA0">первый год</text>
  <circle cx="50" cy="64" r="12" fill="#E6C79E"/>
  <circle cx="41" cy="55" r="5" fill="#E6C79E"/><circle cx="59" cy="55" r="5" fill="#E6C79E"/>
  <circle cx="41" cy="55" r="2.4" fill="#D3A97A"/><circle cx="59" cy="55" r="2.4" fill="#D3A97A"/>
  <circle cx="46" cy="62" r="1.9" fill="#5E5058"/><circle cx="54" cy="62" r="1.9" fill="#5E5058"/>
  <ellipse cx="50" cy="67" rx="3.4" ry="2.6" fill="#F5EADF"/>
  <ellipse cx="50" cy="66" rx="1.8" ry="1.3" fill="#8A6A5E"/>
  <g fill="#F5C36B"><circle cx="34" cy="76" r="2"/><circle cx="66" cy="76" r="2"/><circle cx="50" cy="79" r="2"/></g>
</symbol>

<!-- 13. Мягкий мишка -->
<symbol id="g-teddy" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <ellipse cx="50" cy="66" rx="22" ry="21" fill="#E9C9A6"/>
  <ellipse cx="50" cy="70" rx="14" ry="14" fill="#F7E3CB"/>
  <ellipse cx="27" cy="61" rx="8" ry="11" fill="#E9C9A6" transform="rotate(20 27 61)"/>
  <ellipse cx="73" cy="61" rx="8" ry="11" fill="#E9C9A6" transform="rotate(-20 73 61)"/>
  <ellipse cx="37" cy="85" rx="9" ry="7" fill="#E9C9A6"/><ellipse cx="63" cy="85" rx="9" ry="7" fill="#E9C9A6"/>
  <ellipse cx="37" cy="85" rx="5" ry="3.6" fill="#F7E3CB"/><ellipse cx="63" cy="85" rx="5" ry="3.6" fill="#F7E3CB"/>
  <circle cx="50" cy="38" r="19" fill="#E9C9A6"/>
  <circle cx="33" cy="24" r="9" fill="#E9C9A6"/><circle cx="67" cy="24" r="9" fill="#E9C9A6"/>
  <circle cx="33" cy="24" r="4.5" fill="#F2C9C4"/><circle cx="67" cy="24" r="4.5" fill="#F2C9C4"/>
  <ellipse cx="50" cy="45" rx="11" ry="8.5" fill="#F7E3CB"/>
  <circle cx="42" cy="36" r="2.5" fill="#5E5058"/><circle cx="58" cy="36" r="2.5" fill="#5E5058"/>
  <ellipse cx="50" cy="42" rx="3.6" ry="2.8" fill="#8A6A5E"/>
  <path d="M50 45v3M50 48q-3 3-6 1M50 48q3 3 6 1" stroke="#8A6A5E" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M43 55q-6 4-9-2 6 1 6-3 6 3 12 0 0 4 6 3-3 6-9 2Z" fill="#F2867E"/>
  <circle cx="50" cy="55" r="3" fill="#E8746D"/>
</symbol>

<!-- 14. Ксилофон -->
<symbol id="g-xylo" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M18 76 26 40h48l8 36q1 6-6 6H24q-7 0-6-6Z" fill="#EFCF9F"/>
  <rect x="26" y="44" width="48" height="6" rx="3" fill="#F2867E"/>
  <rect x="26.8" y="53" width="46.4" height="6" rx="3" fill="#F5C36B"/>
  <rect x="27.6" y="62" width="44.8" height="6" rx="3" fill="#A8D8C4"/>
  <rect x="28.4" y="71" width="43.2" height="6" rx="3" fill="#A6CBE8"/>
  <circle cx="30" cy="47" r="1.4" fill="#FBEEDC"/><circle cx="70" cy="47" r="1.4" fill="#FBEEDC"/>
  <path d="M78 30 62 52" stroke="#DDB681" stroke-width="3.4" stroke-linecap="round"/>
  <circle cx="79" cy="28" r="6" fill="#C7B4E6"/>
  <path d="M88 38 72 60" stroke="#DDB681" stroke-width="3.4" stroke-linecap="round"/>
  <circle cx="89" cy="36" r="6" fill="#F2867E"/>
  <g fill="#C7B4E6" opacity=".8"><path d="M20 26v-8l6-2v8" stroke="#C7B4E6" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="18.5" cy="26" r="2.6"/><circle cx="24.5" cy="24" r="2.6"/></g>
</symbol>

<!-- 15. Стаканчики-пирамидка -->
<symbol id="g-cups" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M18 84 22 60h34l4 24Z" fill="#A6CBE8"/>
  <ellipse cx="39" cy="60" rx="17" ry="4.6" fill="#BFDCF0"/>
  <path d="M26 56 29 38h26l3 18Z" fill="#A8D8C4"/>
  <ellipse cx="42" cy="38" rx="13" ry="3.8" fill="#C0E5D6"/>
  <path d="M33 34 35.5 20h19L57 34Z" fill="#F5C36B"/>
  <ellipse cx="45" cy="20" rx="9.5" ry="3" fill="#F8D492"/>
  <path d="M64 84 67 68h20l3 16Z" fill="#F2867E"/>
  <ellipse cx="77" cy="68" rx="10" ry="3.2" fill="#F5A29B"/>
  <path d="M72 64 74 52h14l2 12Z" fill="#C7B4E6"/>
  <ellipse cx="81" cy="52" rx="7" ry="2.4" fill="#D6C7EE"/>
</symbol>

<!-- 16. Качалка-лошадка -->
<symbol id="g-horse" viewBox="0 0 100 100">
  <path d="M12 78q38 22 76 0" stroke="#DDB681" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M32 74V56M68 74V56" stroke="#E9C9A6" stroke-width="7" stroke-linecap="round"/>
  <rect x="26" y="42" width="48" height="20" rx="10" fill="#F0D6B4"/>
  <path d="M66 44q8-12 14-12 4 0 4 5l-2 10q-1 5-6 5h-8Z" fill="#F0D6B4"/>
  <path d="M72 32q-2-8 3-9 2 4 5 4" fill="#F2867E"/>
  <path d="M78 30q6-2 8 2-4 1-5 4" fill="#F2867E"/>
  <path d="M70 28q-6 2-9 8 6 0 9-2Z" fill="#C7B4E6"/>
  <circle cx="76" cy="42" r="2.2" fill="#5E5058"/>
  <path d="M80 50q3 1 4-1" stroke="#B98074" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M28 48q-10-4-13 4 8 2 12 8Z" fill="#C7B4E6"/>
  <rect x="38" y="38" width="20" height="10" rx="5" fill="#F2867E"/>
  <path d="M38 43H32M58 43h6" stroke="#F2867E" stroke-width="3.4" stroke-linecap="round"/>
</symbol>

<!-- 17. Вигвам для игр -->
<symbol id="g-tipi" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M50 16 82 86H18L50 16Z" fill="#F7EFE2"/>
  <path d="M50 16 66 51H34L50 16Z" fill="#EFE3D0"/>
  <path d="M50 40 62 86H38L50 40Z" fill="#F2867E" opacity=".22"/>
  <path d="M50 44 60 86H40L50 44Z" fill="#FBF6EE"/>
  <path d="M34 60h-9M25 72h-7M75 60h9M75 72h7" stroke="#F2867E" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M28 68h-4M76 68h-4" stroke="#A8D8C4" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M40 86 50 46l10 40" stroke="#E2C7AE" stroke-width="2.2" fill="none"/>
  <path d="M44 14 38 8M56 14 62 8M50 12V6" stroke="#DDB681" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M50 8h12l-3 4 3 4H50Z" fill="#F2867E"/>
  <g fill="#F5C36B"><circle cx="46" cy="62" r="2"/><circle cx="54" cy="70" r="2"/><circle cx="46" cy="78" r="2"/></g>
</symbol>

<!-- 18. Панамка -->
<symbol id="g-hat" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <ellipse cx="50" cy="66" rx="42" ry="16" fill="#F7E3C6"/>
  <ellipse cx="50" cy="63" rx="42" ry="15" fill="#FBEFD9"/>
  <path d="M22 62q0-30 28-30t28 30q-13 7-28 7t-28-7Z" fill="#F7E3C6"/>
  <path d="M22 60q6 5 28 5t28-5v4q-13 7-28 7t-28-7Z" fill="#F2867E"/>
  <ellipse cx="50" cy="34" rx="10" ry="4" fill="#FBEFD9"/>
  <path d="M74 62q8 4 12 12-8-1-14-6Z" fill="#F2867E"/>
  <g fill="#F5C7C1"><circle cx="40" cy="46" r="3"/><circle cx="58" cy="42" r="3"/><circle cx="50" cy="53" r="3"/></g>
  <g fill="#F5C36B"><circle cx="40" cy="46" r="1.1"/><circle cx="58" cy="42" r="1.1"/><circle cx="50" cy="53" r="1.1"/></g>
</symbol>

<!-- 19. Кубики с буквами -->
<symbol id="g-blocks" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <rect x="10" y="52" width="34" height="34" rx="7" fill="#F5C36B"/>
  <rect x="15" y="57" width="24" height="24" rx="5" fill="#FBEEDC"/>
  <text x="27" y="76" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="19" fill="#E19A3C">А</text>
  <rect x="48" y="56" width="32" height="32" rx="7" fill="#A8D8C4" transform="rotate(6 64 72)"/>
  <rect x="53" y="61" width="22" height="22" rx="5" fill="#F1FAF6" transform="rotate(6 64 72)"/>
  <text x="64" y="79" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" fill="#4E9E7E" transform="rotate(6 64 72)">Л</text>
  <rect x="30" y="18" width="32" height="32" rx="7" fill="#F2867E" transform="rotate(-8 46 34)"/>
  <rect x="35" y="23" width="22" height="22" rx="5" fill="#FDEEEC" transform="rotate(-8 46 34)"/>
  <text x="46" y="41" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" fill="#D9564E" transform="rotate(-8 46 34)">И</text>
  <rect x="66" y="26" width="24" height="24" rx="6" fill="#C7B4E6" transform="rotate(12 78 38)"/>
  <rect x="70" y="30" width="16" height="16" rx="4" fill="#F6F1FC" transform="rotate(12 78 38)"/>
  <text x="78" y="43" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="13" fill="#8B6FA0" transform="rotate(12 78 38)">С</text>
</symbol>

<!-- 20. Каталка-машинка -->
<symbol id="g-walker" viewBox="0 0 100 100"><use href="#shadow-ground"/>
  <path d="M14 66q0-10 10-10h52q10 0 10 10v6q0 6-6 6H20q-6 0-6-6Z" fill="#F2867E"/>
  <path d="M28 56q4-16 12-16h18q9 0 12 16Z" fill="#F5A29B"/>
  <rect x="34" y="43" width="12" height="12" rx="4" fill="#CFE9F7"/>
  <rect x="52" y="43" width="12" height="12" rx="4" fill="#CFE9F7"/>
  <path d="M76 40q10 0 10 10v10" stroke="#DDB681" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M76 40h-9" stroke="#DDB681" stroke-width="5" stroke-linecap="round"/>
  <circle cx="32" cy="78" r="10" fill="#5E5058"/><circle cx="32" cy="78" r="4.6" fill="#F6EADD"/>
  <circle cx="68" cy="78" r="10" fill="#5E5058"/><circle cx="68" cy="78" r="4.6" fill="#F6EADD"/>
  <circle cx="20" cy="66" r="3.6" fill="#F5C36B"/>
  <circle cx="80" cy="66" r="3.6" fill="#F5C36B"/>
</symbol>
</defs>
</svg>`;
  var host = document.currentScript;
  if (host) host.insertAdjacentHTML('afterend', SPRITE);
  else document.body.insertAdjacentHTML('afterbegin', SPRITE);
})();
