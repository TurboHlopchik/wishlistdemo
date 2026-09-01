/* ============================================================
   Алисе — 1 год · Wishlist
   Список подарков и брони приходят с сервера (/api/state),
   поэтому бронь видят все гости, а не только тот, кто её сделал.
   Каталог редактируется в админке — /admin
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     1. Состояние
     ------------------------------------------------------------ */
  var TOKENS_KEY = 'alisa-wishlist-tokens';   /* мои брони: giftId → токен отмены */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var gifts = [];        /* каталог с сервера */
  var reserved = {};     /* giftId → { by, at } */
  var myTokens = loadTokens();
  var renderedIds = null;   /* сигнатура отрисованного каталога; null — ещё не рисовали.
                               Именно null, а не '': у пустого списка сигнатура тоже '',
                               и сетка со скелетонами не пересобралась бы никогда. */

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /** Русское склонение после числа: 1 идея, 2 идеи, 5 идей */
  function plural(n, one, few, many) {
    var mod100 = n % 100, mod10 = n % 10;
    var word = (mod100 >= 11 && mod100 <= 14) ? many
             : mod10 === 1 ? one
             : (mod10 >= 2 && mod10 <= 4) ? few
             : many;
    return n + ' ' + word;
  }

  function formatPrice(n) {
    return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* localStorage может быть недоступен (приватный режим) — не роняем страницу */
  function loadTokens() {
    try { return JSON.parse(localStorage.getItem(TOKENS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveTokens() {
    try { localStorage.setItem(TOKENS_KEY, JSON.stringify(myTokens)); }
    catch (e) { /* без хранилища кнопка «отменить» просто не появится */ }
  }

  function isReserved(gift) { return Boolean(reserved[gift.id]); }
  function isMine(gift) { return Boolean(myTokens[gift.id]); }

  /* ------------------------------------------------------------
     2. Запросы к серверу
     ------------------------------------------------------------ */
  function api(path, body) {
    return fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin'
    }).then(function (res) {
      return res.json()
        .catch(function () { return { ok: false, error: 'Сервер ответил непонятно' }; })
        .then(function (data) { return { status: res.status, data: data }; });
    });
  }

  function applyState(data) {
    if (!data) return;
    if (Array.isArray(data.gifts)) gifts = data.gifts;
    if (data.reserved) reserved = data.reserved;
    syncGrid();
  }

  /* ------------------------------------------------------------
     3. Отрисовка
     ------------------------------------------------------------ */
  var grid = $('#gift-grid');
  var statusBox = $('#gifts-status');

  /** Картинка (фотография или внешняя ссылка) — в отличие от рисунка из спрайта */
  function artIsImage(art) {
    return /^https:\/\//i.test(art) || /^assets\/img\/gifts\//i.test(art);
  }

  function artMarkup(gift, plainTitle) {
    /* иллюстрация — либо символ из спрайта, либо картинка, заданная в админке */
    if (artIsImage(gift.art)) {
      return '<img class="gift-card__art gift-card__art--photo" src="' + escapeHtml(gift.art) +
             '" alt="' + escapeHtml(plainTitle) + '" loading="lazy" decoding="async">';
    }
    var symbol = /^g-[a-z0-9-]+$/.test(gift.art || '') ? gift.art : 'g-present';
    return '<svg class="gift-card__art" viewBox="0 0 100 100" role="img" aria-label="' +
           escapeHtml(plainTitle) + '"><use href="#' + symbol + '"></use></svg>';
  }

  function buildCard(gift, index) {
    var li = document.createElement('li');
    li.className = 'gift-card reveal';
    li.dataset.id = gift.id;
    li.style.transitionDelay = reduceMotion ? '0ms' : Math.min(index, 11) * 55 + 'ms';

    var plainTitle = String(gift.title).replace(/\n/g, ' ');
    var titleHtml = escapeHtml(gift.title).split('\n').join('<br>');

    li.innerHTML =
      '<div class="gift-card__media">' +
        '<span class="gift-card__badge">Забронирован</span>' +
        artMarkup(gift, plainTitle) +
      '</div>' +
      '<h3 class="gift-card__title">' + titleHtml + '</h3>' +
      '<p class="gift-card__price">' + formatPrice(gift.price) + '</p>' +
      '<p class="gift-card__by"></p>' +
      '<div class="gift-card__foot"></div>';

    return li;
  }

  /** Обновляет состояние одной карточки */
  function paintCard(gift, celebrate) {
    var card = grid.querySelector('[data-id="' + CSS.escape(gift.id) + '"]');
    if (!card) return;
    var foot = $('.gift-card__foot', card);
    var by = $('.gift-card__by', card);
    var taken = isReserved(gift);
    var plainTitle = escapeHtml(String(gift.title).replace(/\n/g, ' '));

    card.classList.toggle('is-reserved', taken);

    if (taken) {
      var giver = reserved[gift.id] && reserved[gift.id].by;
      foot.innerHTML =
        '<button type="button" class="btn btn--primary" disabled ' +
          'aria-label="' + plainTitle + ' — уже забронирован">Забронирован</button>';
      /* подпись всегда в одну строку — карточки в ряду остаются одной высоты */
      by.innerHTML = (giver ? 'Дарит ' + escapeHtml(giver) : 'Уже выбран') +
        (isMine(gift)
          ? ' · <button type="button" class="gift-card__undo" data-undo="' + escapeHtml(gift.id) +
            '" aria-label="Отменить мою бронь: ' + plainTitle + '">отменить</button>'
          : '');
      if (celebrate && !reduceMotion) {
        card.classList.add('just-reserved');
        setTimeout(function () { card.classList.remove('just-reserved'); }, 700);
      }
    } else {
      foot.innerHTML =
        '<button type="button" class="btn btn--primary" data-gift="' + escapeHtml(gift.id) + '" ' +
          'aria-label="Подарить: ' + plainTitle + '">Подарить</button>';
      by.textContent = '';
    }
  }

  /** Пересобирает сетку, если каталог изменился, и обновляет статусы */
  function syncGrid() {
    var ids = gifts.map(function (g) { return g.id + ':' + g.title + ':' + g.price + ':' + g.art; }).join('|');

    if (ids !== renderedIds) {
      renderedIds = ids;
      grid.innerHTML = '';
      var frag = document.createDocumentFragment();
      gifts.forEach(function (gift, i) { frag.appendChild(buildCard(gift, i)); });
      grid.appendChild(frag);
      observeReveals(grid);
    }

    gifts.forEach(function (gift) { paintCard(gift, false); });
    updateProgress();

    /* подсказка под кнопкой в герое — по числу подарков, а не «20» намертво */
    var cue = $('#hero-cue');
    cue.hidden = gifts.length === 0;
    $('#hero-cue-text').textContent = plural(gifts.length, 'идея', 'идеи', 'идей');
    setStatus(gifts.length ? '' : 'Список пока пустой — мы вот-вот его наполним. Загляните чуть позже.');
  }

  function renderSkeletons(count) {
    grid.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var li = document.createElement('li');
      li.className = 'gift-card gift-card--skeleton';
      li.setAttribute('aria-hidden', 'true');
      li.innerHTML =
        '<div class="gift-card__media"></div>' +
        '<div class="skeleton-line skeleton-line--title"></div>' +
        '<div class="skeleton-line skeleton-line--price"></div>' +
        '<div class="skeleton-line skeleton-line--btn"></div>';
      grid.appendChild(li);
    }
  }

  function setStatus(message, kind) {
    if (!statusBox) return;
    statusBox.hidden = !message;
    if (!message) { statusBox.innerHTML = ''; return; }
    statusBox.className = 'gifts-status' + (kind ? ' gifts-status--' + kind : '');
    statusBox.innerHTML = escapeHtml(message) +
      (kind === 'error' ? ' <button type="button" class="gifts-status__retry" id="retry-load">Попробовать ещё раз</button>' : '');
  }

  /* ------------------------------------------------------------
     4. Прогресс
     ------------------------------------------------------------ */
  var progressBar   = $('#progress-bar');
  var progressCount = $('#progress-count');
  var progressTrack = $('#progress-track');

  function updateProgress() {
    var total = gifts.length;
    var taken = gifts.filter(isReserved).length;
    progressCount.textContent = taken;
    $('#progress-total').textContent = total;
    progressBar.style.width = total ? (taken / total * 100) + '%' : '0%';
    progressTrack.setAttribute('aria-valuenow', taken);
    progressTrack.setAttribute('aria-valuemax', total);
    progressTrack.setAttribute('aria-valuetext', 'Выбрано ' + taken + ' из ' + total + ' подарков');
  }

  /* ------------------------------------------------------------
     5. Модалка
     ------------------------------------------------------------ */
  var modal        = $('#gift-modal');
  var panel        = $('#modal-panel');
  var form         = $('#gift-form');
  var nameInput    = $('#giver-name');
  var contactInput = $('#giver-contact');
  var noteInput    = $('#giver-note');
  var secretInput  = $('#giver-secret');
  var submitBtn    = $('#submit-btn');
  var formError    = $('#form-error');
  var lastFocused  = null;
  var activeGift   = null;
  var closeTimer   = null;
  var nameTouched  = false;

  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function openModal(gift) {
    activeGift  = gift;
    lastFocused = document.activeElement;
    clearTimeout(closeTimer);

    var thumb = $('#modal-thumb');
    if (artIsImage(gift.art)) {
      thumb.outerHTML = '<img class="modal__thumb" id="modal-thumb" src="' + escapeHtml(gift.art) + '" alt="">';
    } else {
      var symbol = /^g-[a-z0-9-]+$/.test(gift.art || '') ? gift.art : 'g-present';
      thumb.outerHTML = '<svg class="modal__thumb" id="modal-thumb" viewBox="0 0 100 100" aria-hidden="true">' +
                        '<use href="#' + symbol + '"></use></svg>';
    }

    $('#modal-title').textContent = String(gift.title).replace(/\n/g, ' ');
    $('#modal-price').textContent = formatPrice(gift.price);

    panel.classList.remove('is-done');
    form.reset();
    nameTouched = false;
    clearError($('#field-name'));
    showFormError('');
    $('#note-count').textContent = '0';
    setLoading(false);
    $('#confetti').innerHTML = '';
    $('#success-actions').innerHTML = '';

    modal.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
      setTimeout(function () {
        /* на телефоне не открываем клавиатуру сразу — фокус на само окно */
        if (window.matchMedia('(pointer: fine)').matches) nameInput.focus();
        else panel.focus();
      }, reduceMotion ? 0 : 220);
    });
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    closeTimer = setTimeout(function () { modal.hidden = true; }, reduceMotion ? 0 : 260);
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    activeGift = null;
  }

  /* Ловушка фокуса + Esc */
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key !== 'Tab') return;

    var items = $$(FOCUSABLE, panel).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });

  /* ------------------------------------------------------------
     6. Валидация и отправка
     ------------------------------------------------------------ */
  function showError(field) { field.classList.add('has-error'); }
  function clearError(field) { field.classList.remove('has-error'); }

  function showFormError(text) {
    formError.hidden = !text;
    $('#form-error-text').textContent = text || '';
  }

  function validateName() {
    var ok = nameInput.value.trim().length >= 2;
    var field = $('#field-name');
    if (ok) { clearError(field); nameInput.setAttribute('aria-invalid', 'false'); }
    else    { showError(field);  nameInput.setAttribute('aria-invalid', 'true'); }
    return ok;
  }

  nameInput.addEventListener('blur', function () { if (nameTouched) validateName(); });
  nameInput.addEventListener('input', function () {
    nameTouched = true;
    if ($('#field-name').classList.contains('has-error')) validateName();
  });
  noteInput.addEventListener('input', function () {
    $('#note-count').textContent = noteInput.value.length;
  });

  function setLoading(on) {
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.disabled = on;
    $('.btn__label', submitBtn).textContent = on ? 'Бронируем…' : 'Забронировать подарок';
  }

  function shakePanel() {
    if (reduceMotion) return;
    panel.classList.add('shake');
    setTimeout(function () { panel.classList.remove('shake'); }, 400);
  }

  function launchConfetti() {
    if (reduceMotion) return;
    var box = $('#confetti');
    for (var i = 0; i < 12; i++) {
      var el = document.createElement('i');
      el.style.left = (6 + Math.random() * 88) + '%';
      el.style.animationDelay = (Math.random() * 0.7) + 's';
      el.style.setProperty('--r', (Math.random() * 90 - 45) + 'deg');
      el.style.opacity = 0.5 + Math.random() * 0.5;
      var size = 12 + Math.round(Math.random() * 14);
      el.innerHTML = '<svg width="' + size + '" height="' + size + '"><use href="#i-heart"></use></svg>';
      box.appendChild(el);
    }
    setTimeout(function () { box.innerHTML = ''; }, 3400);
  }

  /**
   * Показывает под благодарностью ссылку на магазин, если она задана в админке.
   * Пока ссылка на экране, окно само не закрывается — иначе её не успеть нажать.
   */
  function showSuccessActions(gift) {
    var box = $('#success-actions');
    var url = String(gift.link || '');
    var hasLink = /^https?:\/\//i.test(url);

    box.innerHTML = hasLink
      ? '<a class="btn btn--primary success__shop" href="' + escapeHtml(url) + '" ' +
          'target="_blank" rel="noopener noreferrer">' +
          '<svg width="18" height="18" aria-hidden="true"><use href="#i-bag"></use></svg>' +
          'Где купить подарок' +
          '<svg class="success__ext" width="14" height="14" aria-hidden="true"><use href="#i-external"></use></svg>' +
        '</a>' +
        '<button type="button" class="success__done" data-close>Готово</button>'
      : '';

    /* форма скрыта — уводим фокус на то, что осталось видимым */
    var next = box.querySelector('a') || $('.modal__close', panel);
    if (next) setTimeout(function () { next.focus(); }, reduceMotion ? 0 : 240);

    /* без ссылки закрываем сами, как раньше */
    if (!hasLink) closeTimer = setTimeout(closeModal, 3200);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    nameTouched = true;
    showFormError('');

    if (!validateName()) { nameInput.focus(); shakePanel(); return; }
    if (!activeGift) return;

    var gift = activeGift;
    setLoading(true);

    api('/api/reserve', {
      action: 'reserve',
      giftId: gift.id,
      name: nameInput.value.trim(),
      contact: contactInput.value.trim(),
      note: noteInput.value.trim(),
      secret: secretInput.checked
    }).then(function (r) {
      setLoading(false);

      if (r.status === 409) {
        /* кто-то успел раньше — показываем актуальный список */
        applyState(r.data);
        showFormError(r.data.error || 'Этот подарок только что забронировали');
        shakePanel();
        return;
      }
      if (!r.data.ok) {
        showFormError(r.data.error || 'Не получилось забронировать. Попробуйте ещё раз.');
        shakePanel();
        return;
      }

      myTokens[gift.id] = r.data.token;
      saveTokens();
      applyState(r.data);
      paintCard(gift, true);

      panel.classList.add('is-done');
      $('#success-text').innerHTML =
        '<b>' + escapeHtml(String(gift.title).replace(/\n/g, ' ')) +
        '</b> теперь забронирован за вами. Ждём вас на празднике!';
      showSuccessActions(gift);
      launchConfetti();
    }).catch(function () {
      setLoading(false);
      showFormError('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
      shakePanel();
    });
  });

  /* ------------------------------------------------------------
     7. Клики по сетке
     ------------------------------------------------------------ */
  grid.addEventListener('click', function (e) {
    var giftBtn = e.target.closest('[data-gift]');
    if (giftBtn) {
      var gift = gifts.filter(function (g) { return g.id === giftBtn.dataset.gift; })[0];
      if (gift && !isReserved(gift)) openModal(gift);
      return;
    }

    var undoBtn = e.target.closest('[data-undo]');
    if (undoBtn) {
      var id = undoBtn.dataset.undo;
      var g2 = gifts.filter(function (g) { return g.id === id; })[0];
      if (!g2) return;

      undoBtn.disabled = true;
      undoBtn.textContent = 'отменяем…';

      api('/api/reserve', { action: 'cancel', giftId: id, token: myTokens[id] })
        .then(function (r) {
          if (!r.data.ok) {
            showToast(r.data.error || 'Не получилось отменить бронь', 'error');
            paintCard(g2, false);
            return;
          }
          delete myTokens[id];
          saveTokens();
          applyState(r.data);
          showToast('Бронь отменена — подарок снова свободен');
          var again = grid.querySelector('[data-gift="' + CSS.escape(id) + '"]');
          if (again) again.focus();
        })
        .catch(function () {
          showToast('Нет связи с сервером', 'error');
          paintCard(g2, false);
        });
    }
  });

  /* ------------------------------------------------------------
     8. Тост
     ------------------------------------------------------------ */
  var toast = $('#toast'), toastTimer = null;
  function showToast(text, kind) {
    $('#toast-text').textContent = text;
    toast.classList.toggle('toast--error', kind === 'error');
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 3600);
  }

  /* ------------------------------------------------------------
     9. Появление блоков при скролле

     Считаем видимость сами в общем rAF-цикле, а не через
     IntersectionObserver: при переходе по якорю тот не присылает
     событие для элементов, мимо которых экран «перепрыгнул»,
     и они остаются невидимыми навсегда.
     ------------------------------------------------------------ */
  var pendingReveals = [];

  function observeReveals(root) {
    var items = $$('.reveal', root).filter(function (el) {
      return !el.classList.contains('is-in');
    });
    if (reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    pendingReveals = pendingReveals.concat(items);
    checkReveals();
  }

  function checkReveals() {
    if (!pendingReveals.length) return;
    var limit = window.innerHeight * 0.92;
    var still = [];
    for (var i = 0; i < pendingReveals.length; i++) {
      var el = pendingReveals[i];
      /* top < limit — элемент вошёл в кадр ИЛИ уже уехал вверх */
      if (el.getBoundingClientRect().top < limit) el.classList.add('is-in');
      else still.push(el);
    }
    pendingReveals = still;
  }

  /* ------------------------------------------------------------
     10. Параллакс + «прилипший» хедер
     ------------------------------------------------------------ */
  function initScrollFx() {
    var header  = $('.site-header');
    var layers  = $$('[data-parallax]');
    var ticking = false;

    function frame() {
      var y = window.pageYOffset;
      header.classList.toggle('is-stuck', y > 24);
      checkReveals();

      if (!reduceMotion && y < window.innerHeight * 1.5) {
        for (var i = 0; i < layers.length; i++) {
          var speed = parseFloat(layers[i].dataset.parallax) || 0;
          layers[i].style.transform = 'translate3d(0,' + (y * speed).toFixed(2) + 'px,0)';
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }, { passive: true });

    window.addEventListener('resize', checkReveals, { passive: true });

    frame();
  }

  /* ------------------------------------------------------------
     11. Подсветка активного пункта меню
     ------------------------------------------------------------ */
  function initNavSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = {};
    $$('.nav__link').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (link) link.classList.toggle('is-active', entry.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    ['gifts', 'how'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ------------------------------------------------------------
     12. Заголовок героя: слова появляются по очереди
     ------------------------------------------------------------ */
  function initTitle() {
    var title = $('[data-split]');
    if (!title) return;

    /* Разбираем заголовок на слова, сохраняя вложенные элементы (сердечко)
       как самостоятельные «слова» — иначе textContent их бы потерял */
    var parts = [];
    Array.prototype.forEach.call(title.childNodes, function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/\s+/).forEach(function (w) {
          if (w) parts.push({ text: w });
        });
      } else if (node.nodeType === 1) {
        parts.push({ el: node });
      }
    });

    title.textContent = '';   /* ссылки на элементы уже собраны выше */

    parts.forEach(function (part, i) {
      var span = document.createElement('span');
      span.className = 'word';
      if (part.el) span.appendChild(part.el);
      else span.textContent = part.text;
      if (!reduceMotion) {
        span.style.opacity = '0';
        span.style.transform = 'translateY(24px) rotate(-3deg)';
        span.style.transition = 'opacity 520ms cubic-bezier(.22,.61,.36,1) ' + (i * 90 + 120) + 'ms,' +
                                'transform 620ms cubic-bezier(.34,1.56,.64,1) ' + (i * 90 + 120) + 'ms';
      }
      title.appendChild(span);
      if (i < parts.length - 1) title.appendChild(document.createTextNode(' '));
    });

    if (reduceMotion) return;
    requestAnimationFrame(function () {
      $$('.word', title).forEach(function (w) {
        w.style.opacity = '1';
        w.style.transform = 'none';
      });
    });
  }

  /* ------------------------------------------------------------
     13. Загрузка и обновление данных
     ------------------------------------------------------------ */
  function load(silent) {
    if (!silent) setStatus('');
    return api('/api/state')
      .then(function (r) {
        if (!r.data.ok) throw new Error(r.data.error || 'Ошибка сервера');
        applyState(r.data);
      })
      .catch(function () {
        if (gifts.length) {
          /* список уже показан — молча оставляем прежний */
          if (!silent) showToast('Не удалось обновить список', 'error');
          return;
        }
        grid.innerHTML = '';
        setStatus('Не удалось загрузить список подарков.', 'error');
      });
  }

  document.addEventListener('click', function (e) {
    if (e.target.id === 'retry-load') { renderSkeletons(8); load(false); }
  });

  /* Подтягиваем свежие брони, когда гость возвращается на вкладку */
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) load(true);
  });
  window.addEventListener('focus', function () { load(true); });

  /* ------------------------------------------------------------
     14. Старт
     ------------------------------------------------------------ */
  renderSkeletons(8);
  observeReveals(document);
  initScrollFx();
  initNavSpy();
  initTitle();
  load(false);
})();
