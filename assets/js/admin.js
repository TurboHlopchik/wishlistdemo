/* ============================================================
   Админка списка подарков: вход, кто что дарит, правка каталога.
   Все запросы идут в POST /api/admin, сессия живёт в HttpOnly-куке.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var gifts = [];
  var reservations = {};

  /* Рисунки, доступные при добавлении подарка — берём прямо из спрайта */
  var ART = [];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function formatPrice(n) {
    return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }
  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ', ' +
           d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  function plain(title) { return String(title).replace(/\n/g, ' '); }

  /** Картинка (фотография или внешняя ссылка) — в отличие от рисунка из спрайта */
  function artIsImage(art) {
    return /^https:\/\//i.test(art) || /^assets\/img\/gifts\//i.test(art);
  }

  function thumbMarkup(gift, cls) {
    if (artIsImage(gift.art)) {
      return '<img class="' + cls + '" src="' + escapeHtml(gift.art) + '" alt="" loading="lazy">';
    }
    var symbol = /^g-[a-z0-9-]+$/.test(gift.art || '') ? gift.art : 'g-present';
    return '<svg class="' + cls + '" viewBox="0 0 100 100" aria-hidden="true"><use href="#' + symbol + '"></use></svg>';
  }

  /* ------------------------------------------------------------
     Запросы
     ------------------------------------------------------------ */
  function api(payload) {
    return fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    }).then(function (res) {
      return res.json()
        .catch(function () { return { ok: false, error: 'Сервер ответил непонятно' }; })
        .then(function (data) { return { status: res.status, data: data }; });
    });
  }

  function apply(data) {
    if (Array.isArray(data.gifts)) gifts = data.gifts;
    if (data.reservations) reservations = data.reservations;
    renderStats();
    renderReservations();
    renderCatalog();
  }

  /* ------------------------------------------------------------
     Экраны
     ------------------------------------------------------------ */
  var loginScreen = $('#login-screen');
  var adminScreen = $('#admin-screen');

  function showLogin(message) {
    adminScreen.hidden = true;
    loginScreen.hidden = false;
    if (message) setLoginError(message);
    $('#admin-password').focus();
  }
  function showAdmin() {
    loginScreen.hidden = true;
    adminScreen.hidden = false;
  }
  function setLoginError(text) {
    $('#login-error').hidden = !text;
    $('#login-error-text').textContent = text || '';
  }

  function setBusy(btn, on, labelBusy, labelIdle) {
    btn.classList.toggle('is-loading', on);
    btn.disabled = on;
    $('.btn__label', btn).textContent = on ? labelBusy : labelIdle;
  }

  /* ------------------------------------------------------------
     Вход
     ------------------------------------------------------------ */
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    setLoginError('');
    var btn = $('#login-btn');
    setBusy(btn, true, 'Проверяем…', 'Войти');

    api({ action: 'login', password: $('#admin-password').value })
      .then(function (r) {
        setBusy(btn, false, 'Проверяем…', 'Войти');
        if (!r.data.ok) { setLoginError(r.data.error || 'Не получилось войти'); return; }
        $('#admin-password').value = '';
        return loadData();
      })
      .catch(function () {
        setBusy(btn, false, 'Проверяем…', 'Войти');
        setLoginError('Нет связи с сервером');
      });
  });

  $('#logout-btn').addEventListener('click', function () {
    api({ action: 'logout' }).then(function () { showLogin(''); });
  });

  function loadData() {
    return api({ action: 'data' }).then(function (r) {
      if (r.status === 401) { showLogin(''); return; }
      if (!r.data.ok) { showLogin(r.data.error || 'Ошибка сервера'); return; }
      apply(r.data);
      showAdmin();
    });
  }

  /* ------------------------------------------------------------
     Сводка
     ------------------------------------------------------------ */
  function renderStats() {
    var taken = gifts.filter(function (g) { return reservations[g.id]; }).length;
    var sum = gifts.reduce(function (acc, g) { return acc + (Number(g.price) || 0); }, 0);
    $('#stat-total').textContent = gifts.length;
    $('#stat-taken').textContent = taken;
    $('#stat-free').textContent = gifts.length - taken;
    $('#stat-sum').textContent = formatPrice(sum);
  }

  /* ------------------------------------------------------------
     Таблица «кто что дарит»
     ------------------------------------------------------------ */
  function renderReservations() {
    var body = $('#res-body');
    var rows = gifts.filter(function (g) { return reservations[g.id]; });

    $('#res-empty').hidden = rows.length > 0;
    $('.table-wrap').hidden = rows.length === 0;

    body.innerHTML = rows.map(function (g) {
      var r = reservations[g.id];
      var contact = r.contact
        ? (/^@|^https?:/i.test(r.contact)
            ? '<a href="' + (r.contact.charAt(0) === '@'
                ? 'https://t.me/' + escapeHtml(r.contact.slice(1))
                : escapeHtml(r.contact)) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(r.contact) + '</a>'
            : '<a href="tel:' + escapeHtml(r.contact.replace(/[^\d+]/g, '')) + '">' + escapeHtml(r.contact) + '</a>')
        : '<span class="table__dash">—</span>';

      return '<tr>' +
        '<td><span class="table__gift">' + thumbMarkup(g, 'table__thumb') +
          '<span class="table__name">' + escapeHtml(plain(g.title)) + '</span></span></td>' +
        '<td class="table__giver">' + escapeHtml(r.name || '—') +
          (r.secret ? '<span class="table__secret">сюрприз</span>' : '') + '</td>' +
        '<td class="table__contact">' + contact + '</td>' +
        '<td class="table__note">' + (r.note ? escapeHtml(r.note) : '<span class="table__dash">—</span>') + '</td>' +
        '<td class="table__when">' + escapeHtml(formatDate(r.at)) + '</td>' +
        '<td><button type="button" class="icon-btn" data-free="' + escapeHtml(g.id) + '">' +
          '<svg width="15" height="15" aria-hidden="true"><use href="#i-free"></use></svg>Снять бронь</button></td>' +
      '</tr>';
    }).join('');
  }

  /* ------------------------------------------------------------
     Каталог
     ------------------------------------------------------------ */
  function renderCatalog() {
    $('#cat-list').innerHTML = gifts.map(function (g) {
      var taken = Boolean(reservations[g.id]);
      return '<li class="cat__item">' +
        thumbMarkup(g, 'cat__thumb') +
        '<div class="cat__body">' +
          '<div class="cat__name">' + escapeHtml(plain(g.title)) + '</div>' +
          '<div class="cat__meta"><span class="cat__price">' + formatPrice(g.price) + '</span>' +
            (taken ? '<span class="cat__flag">занят</span>' : '') +
          '</div>' +
        '</div>' +
        '<button type="button" class="cat__edit" data-edit="' + escapeHtml(g.id) + '" ' +
          'aria-label="Изменить: ' + escapeHtml(plain(g.title)) + '">' +
          '<svg width="18" height="18" aria-hidden="true"><use href="#i-pen"></use></svg>' +
        '</button>' +
      '</li>';
    }).join('');
  }

  /* ------------------------------------------------------------
     Модальные окна
     ------------------------------------------------------------ */
  var openDialog = null;
  var lastFocused = null;
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function dialogOpen(el) {
    lastFocused = document.activeElement;
    openDialog = el;
    el.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () {
      el.classList.add('is-open');
      var target = $('input:not([type=hidden]), button', $('.modal__panel', el));
      (target || $('.modal__panel', el)).focus();
    });
  }

  function dialogClose() {
    if (!openDialog) return;
    var el = openDialog;
    openDialog = null;
    el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(function () { el.hidden = true; }, 260);
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  }

  document.addEventListener('click', function (e) {
    if (openDialog && e.target.closest('[data-close]')) dialogClose();
  });

  document.addEventListener('keydown', function (e) {
    if (!openDialog) return;
    if (e.key === 'Escape') { e.preventDefault(); dialogClose(); return; }
    if (e.key !== 'Tab') return;
    var panel = $('.modal__panel', openDialog);
    var items = $$(FOCUSABLE, panel).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- подтверждение ---------- */
  var confirmAction = null;
  function askConfirm(text, onYes) {
    $('#confirm-text').textContent = text;
    confirmAction = onYes;
    dialogOpen($('#confirm'));
  }
  $('#confirm-ok').addEventListener('click', function () {
    var fn = confirmAction;
    confirmAction = null;
    dialogClose();
    if (fn) fn();
  });

  /* ------------------------------------------------------------
     Редактор подарка
     ------------------------------------------------------------ */
  var editor = $('#gift-editor');
  var editing = null;

  function collectArt() {
    /* Сначала фотографии подарков, следом рисунки из спрайта */
    var photos = (window.GIFT_PHOTOS || []).map(function (p) {
      return { art: 'assets/img/gifts/' + p.file, label: p.label, photo: true };
    });
    var drawings = $$('symbol[id^="g-"]').map(function (sym) {
      return { art: sym.id, label: 'Рисунок ' + sym.id.replace(/^g-/, ''), photo: false };
    });

    ART = photos.concat(drawings);

    $('#art-grid').innerHTML = ART.map(function (item) {
      var inner = item.photo
        ? '<img src="' + escapeHtml(item.art) + '" alt="" loading="lazy" decoding="async">'
        : '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#' + item.art + '"></use></svg>';
      return '<button type="button" class="picker__item' + (item.photo ? ' picker__item--photo' : '') +
        '" role="radio" aria-checked="false" data-art="' + escapeHtml(item.art) +
        '" title="' + escapeHtml(item.label) + '" aria-label="' + escapeHtml(item.label) + '">' +
        inner + '</button>';
    }).join('');

    $('#art-count').textContent = photos.length
      ? photos.length + ' фото и ' + plural(drawings.length, 'рисунок', 'рисунка', 'рисунков')
      : plural(drawings.length, 'рисунок', 'рисунка', 'рисунков');
  }

  /** Русское склонение после числа: 1 рисунок, 2 рисунка, 5 рисунков */
  function plural(n, one, few, many) {
    var mod100 = n % 100, mod10 = n % 10;
    var word = (mod100 >= 11 && mod100 <= 14) ? many
             : mod10 === 1 ? one
             : (mod10 >= 2 && mod10 <= 4) ? few
             : many;
    return n + ' ' + word;
  }

  function selectArt(id) {
    $$('.picker__item').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.dataset.art === id));
    });
  }

  function currentArt() {
    var url = $('#gift-art-url').value.trim();
    if (url) return url;
    var picked = $('.picker__item[aria-checked="true"]');
    return picked ? picked.dataset.art : 'g-present';
  }

  function setEditorError(text) {
    $('#editor-error').hidden = !text;
    $('#editor-error-text').textContent = text || '';
  }

  function openEditor(gift) {
    editing = gift || null;
    $('#editor-title').textContent = gift ? 'Изменить подарок' : 'Новый подарок';
    $('#gift-id').value = gift ? gift.id : '';
    $('#gift-title').value = gift ? gift.title : '';
    $('#gift-price').value = gift ? gift.price : '';
    $('#gift-link').value = gift && gift.link ? gift.link : '';

    /* фотография выделяется в сетке, произвольная ссылка попадает в поле */
    var isExternal = gift && /^https:\/\//i.test(gift.art);
    $('#gift-art-url').value = isExternal ? gift.art : '';
    selectArt(gift && !isExternal ? gift.art : 'g-present');

    $('#editor-delete').hidden = !gift;
    setEditorError('');
    setBusy($('#editor-save'), false, 'Сохраняем…', 'Сохранить');
    dialogOpen(editor);
  }

  $('#add-btn').addEventListener('click', function () { openEditor(null); });

  $('#art-grid').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-art]');
    if (!btn) return;
    $('#gift-art-url').value = '';   /* выбор рисунка отменяет ссылку */
    selectArt(btn.dataset.art);
  });

  $('#editor-form').addEventListener('submit', function (e) {
    e.preventDefault();
    setEditorError('');

    var title = $('#gift-title').value.trim();
    if (title.length < 2) { setEditorError('Название слишком короткое'); $('#gift-title').focus(); return; }
    var price = Number($('#gift-price').value);
    if (!Number.isFinite(price) || price < 0) { setEditorError('Проверьте цену'); $('#gift-price').focus(); return; }

    var btn = $('#editor-save');
    setBusy(btn, true, 'Сохраняем…', 'Сохранить');

    api({
      action: 'save-gift',
      gift: {
        id: $('#gift-id').value || undefined,
        title: title,
        price: price,
        art: currentArt(),
        link: $('#gift-link').value.trim()
      }
    }).then(function (r) {
      setBusy(btn, false, 'Сохраняем…', 'Сохранить');
      if (r.status === 401) { dialogClose(); showLogin('Сессия закончилась, войдите заново'); return; }
      if (!r.data.ok) { setEditorError(r.data.error || 'Не получилось сохранить'); return; }
      apply(r.data);
      dialogClose();
      showToast(editing ? 'Подарок изменён' : 'Подарок добавлен');
    }).catch(function () {
      setBusy(btn, false, 'Сохраняем…', 'Сохранить');
      setEditorError('Нет связи с сервером');
    });
  });

  $('#editor-delete').addEventListener('click', function () {
    if (!editing) return;
    var gift = editing;
    var warn = reservations[gift.id]
      ? 'Подарок «' + plain(gift.title) + '» уже забронирован. Удалить вместе с бронью?'
      : 'Удалить «' + plain(gift.title) + '» из списка?';
    dialogClose();
    setTimeout(function () {
      askConfirm(warn, function () {
        api({ action: 'delete-gift', id: gift.id }).then(function (r) {
          if (!r.data.ok) { showToast(r.data.error || 'Не удалось удалить', 'error'); return; }
          apply(r.data);
          showToast('Подарок удалён');
        });
      });
    }, 280);
  });

  /* ------------------------------------------------------------
     Очистка всего списка
     ------------------------------------------------------------ */
  $('#clear-btn').addEventListener('click', function () {
    var taken = Object.keys(reservations).length;
    askConfirm(
      'Удалить все подарки (' + gifts.length + ')' +
      (taken ? ' вместе с бронями (' + taken + ')' : '') +
      '? Список станет пустым, вернуть будет нельзя.',
      function () {
        api({ action: 'clear-catalog', confirm: 'ОЧИСТИТЬ' }).then(function (r) {
          if (!r.data.ok) { showToast(r.data.error || 'Не получилось очистить', 'error'); return; }
          apply(r.data);
          showToast('Список очищен — можно добавлять свои подарки');
        });
      }
    );
  });

  /* ------------------------------------------------------------
     Действия в списках
     ------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var editBtn = e.target.closest('[data-edit]');
    if (editBtn) {
      var g = gifts.filter(function (x) { return x.id === editBtn.dataset.edit; })[0];
      if (g) openEditor(g);
      return;
    }

    var freeBtn = e.target.closest('[data-free]');
    if (freeBtn) {
      var id = freeBtn.dataset.free;
      var gift = gifts.filter(function (x) { return x.id === id; })[0];
      var r = reservations[id];
      if (!gift || !r) return;
      askConfirm(
        'Снять бронь с «' + plain(gift.title) + '»? ' +
        (r.name ? 'Её оформил(а) ' + r.name + '. ' : '') + 'Подарок снова станет свободным.',
        function () {
          freeBtn.disabled = true;
          api({ action: 'cancel-reservation', giftId: id }).then(function (res) {
            if (!res.data.ok) { showToast(res.data.error || 'Не получилось', 'error'); freeBtn.disabled = false; return; }
            apply(res.data);
            showToast('Бронь снята');
          });
        }
      );
    }
  });

  /* ------------------------------------------------------------
     Тост
     ------------------------------------------------------------ */
  var toast = $('#toast'), toastTimer = null;
  function showToast(text, kind) {
    $('#toast-text').textContent = text;
    toast.classList.toggle('toast--error', kind === 'error');
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 3200);
  }

  /* ------------------------------------------------------------
     Старт: если кука ещё жива — сразу открываем панель
     ------------------------------------------------------------ */
  collectArt();
  api({ action: 'data' })
    .then(function (r) {
      if (r.data.ok) { apply(r.data); showAdmin(); }
      else showLogin('');
    })
    .catch(function () { showLogin('Нет связи с сервером'); });
})();
