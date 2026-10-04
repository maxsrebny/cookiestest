/* cream cookies club — кликабельный прототип Telegram Mini App.
   Без бэкенда: состояние хранится в памяти и localStorage. */
(function () {
  'use strict';

  const D = window.CC_DATA;
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const inTG = !!(tg && tg.initDataUnsafe && tg.initDataUnsafe.user);
  const tgUser = inTG ? tg.initDataUnsafe.user : null;
  const photo = tgUser && tgUser.photo_url ? tgUser.photo_url : null;
  const botParam = new URLSearchParams(location.search).get('bot');
  const BOT = botParam && /^[A-Za-z0-9_]{5,32}$/.test(botParam) ? botParam : D.botUsername;

  /* ---------- helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Math.round(n).toLocaleString('ru-RU') + ' ₽';
  const plural = (n, f) => { const a = n % 10, b = n % 100; if (a === 1 && b !== 11) return f[0]; if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return f[1]; return f[2]; };
  const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const now = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const clone = o => JSON.parse(JSON.stringify(o));
  const prod = id => D.products.find(p => p.id === id);

  const P = {
    home: '<path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>',
    cookie: '<path d="M12 3a9 9 0 1 0 9 9 3.5 3.5 0 0 1-4-3.5A3.5 3.5 0 0 1 13.5 4 9 9 0 0 0 12 3z"/><circle cx="8.5" cy="10" r="1"/><circle cx="14" cy="15.5" r="1"/><circle cx="9" cy="15" r=".8"/><circle cx="12.5" cy="11" r=".8"/>',
    star: '<path d="M12 3l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.4 6.3 20.5l1.2-6.4L2.8 9.7l6.4-.8z"/>',
    bag: '<path d="M6 8h12l1 13H5z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM19 14h2v2M14 19h2v2M19 19h2v2"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 14h18M12 9c-2-4-7-3-6 0h6zm0 0c2-4 7-3 6 0h-6z"/>',
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
    share: '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3m-4 4l4-4 4 4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="3"/><path d="M15.5 14.5A5.5 5.5 0 0 1 22 20"/>',
    crown: '<path d="M3 18h18l-1.5-10-4.5 4-3-6-3 6-4.5-4z"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    ticket: '<path d="M3 9a2 2 0 0 0 2-2V5h14v2a2 2 0 0 0 2 2v6a2 2 0 0 0-2 2v2H5v-2a2 2 0 0 0-2-2z"/><path d="M12 5v14" stroke-dasharray="2 3"/>',
    cup: '<path d="M5 8h12v6a6 6 0 0 1-12 0z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2M5 20h12"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
    sbp: '<path d="M6 4l6 4 6-4v6l-6 4-6-4zM6 14l6 4 6-4v6l-6-4-6 4z"/>'
  };
  const ic = (n, s) => `<svg viewBox="0 0 24 24" width="${s || 22}" height="${s || 22}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;

  /* ---------- state ---------- */
  const KEY = 'cc_demo_v1';
  const fresh = () => ({
    tab: 'home', cat: 'all', cart: {}, pickup: 0, useBonus: false, orderSeq: 16,
    user: clone(D.user), orders: clone(D.orders), missions: clone(D.missions), collection: clone(D.collection),
    ops: clone(D.staffOps), drop: { left: D.drop.left, reserved: false }, staffMode: false, staffSeg: 'accrue', st: {}, fullscreen: false
  });
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* storage may be unavailable */ }
  S.tab = 'home'; S.staffMode = false; S.st = {};
  if (tgUser && tgUser.first_name) S.user.name = tgUser.first_name;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

  function levelInfo() {
    let i = 0; D.levels.forEach((l, k) => { if (S.user.visits >= l.minVisits) i = k; });
    const cur = D.levels[i], next = D.levels[i + 1] || null;
    const pct = next ? Math.min(1, (S.user.visits - cur.minVisits) / (next.minVisits - cur.minVisits)) : 1;
    return { i, cur, next, pct, toNext: next ? next.minVisits - S.user.visits : 0 };
  }
  const greet = () => { const h = new Date().getHours(); return h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; };
  const cartCount = () => Object.values(S.cart).reduce((a, b) => a + b, 0);
  const cartSum = () => Object.entries(S.cart).reduce((a, kv) => a + prod(kv[0]).price * kv[1], 0);
  const pickupTime = () => new Date(Date.now() + [15, 30, 45, 60][S.pickup || 0] * 60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  /* ---------- telegram ---------- */
  function hap(t) {
    try {
      if (!tg || !tg.HapticFeedback || !inTG) return;
      if (t === 'success' || t === 'error' || t === 'warning') tg.HapticFeedback.notificationOccurred(t); else tg.HapticFeedback.impactOccurred(t || 'light');
    } catch (e) { /* ignore */ }
  }
  function openShare(text, url) {
    const u = url || ('https://t.me/' + BOT + '?startapp=ref' + S.user.founderNo);
    const link = 'https://t.me/share/url?url=' + encodeURIComponent(u) + '&text=' + encodeURIComponent(text);
    if (tg && inTG && tg.openTelegramLink) tg.openTelegramLink(link); else window.open(link, '_blank');
  }
  function scan(cb) {
    if (tg && inTG && tg.showScanQrPopup && tg.isVersionAtLeast('6.4')) {
      tg.showScanQrPopup({ text: 'Наведите камеру на QR гостя' }, txt => { cb(txt); return true; });
    } else {
      toast('Сканер работает внутри Telegram. Введите код вручную');
    }
  }

  /* ---------- ui primitives ---------- */
  let toastT;
  function toast(msg, ok) { const t = $('#toast'); t.textContent = msg; t.className = 'show' + (ok ? ' ok' : ''); clearTimeout(toastT); toastT = setTimeout(() => { t.className = ''; }, 2600); }
  function openSheet(html, cls) {
    closeSheet(true);
    const ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'overlay'; ov.addEventListener('click', () => closeSheet());
    const sh = document.createElement('div'); sh.className = 'sheet ' + (cls || ''); sh.id = 'sheet'; sh.innerHTML = '<div class="grab"></div>' + html;
    document.body.append(ov, sh);
    if (tg && inTG && tg.BackButton) tg.BackButton.show();
    return sh;
  }
  function closeSheet(silent) {
    const ov = $('#overlay'), sh = $('#sheet'); if (ov) ov.remove(); if (sh) sh.remove();
    if (!silent && tg && inTG && tg.BackButton) tg.BackButton.hide();
  }
  function drawQR(id, text) {
    const box = document.getElementById(id); if (!box) return; box.innerHTML = '';
    if (window.QRCode) new window.QRCode(box, { text, width: 220, height: 220, colorDark: '#2E1B1E', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
    else box.innerHTML = '<div class="code">' + esc(text) + '</div>';
  }
  function go(tab) { S.tab = tab; save(); window.scrollTo(0, 0); render(); }

  /* ---------- shared blocks ---------- */
  function topbar() {
    const av = photo ? `<img src="${photo}" alt="">` : esc(initials(S.user.name));
    return `<header class="top"><div class="brand"><img class="brand-logo" src="assets/logo.jpg" alt=""><div><div class="brand-name">${D.brand.name}</div><div class="brand-sub">${D.brand.club}</div></div></div><button class="avatar" data-action="tab" data-arg="profile">${av}</button></header>`;
  }
  function qtyHtml(id) {
    const q = S.cart[id] || 0;
    return `<button data-action="cart" data-arg="${id}|-1">${ic('minus', 16)}</button><b>${q}</b><button data-action="cart" data-arg="${id}|1">${ic('plus', 16)}</button>`;
  }
  function pcard(p) {
    const q = S.cart[p.id] || 0;
    const badge = p.hit ? '<span class="pill rasp badge">Хит</span>' : p.seasonal ? '<span class="pill badge">Сезон</span>' : '';
    const ctl = q ? `<span class="qty">${qtyHtml(p.id)}</span>` : `<button class="iconbtn rasp" data-action="cart" data-arg="${p.id}|1">${ic('plus', 18)}</button>`;
    return `<div class="pcard">${badge}<img class="img" src="${p.img}" alt="" loading="lazy" data-action="product" data-arg="${p.id}"><div class="pbody"><div class="pname" data-action="product" data-arg="${p.id}">${p.name}</div><div class="pdesc">${p.desc}</div><div class="pfoot"><span class="price">${fmt(p.price)}</span>${ctl}</div></div></div>`;
  }

  /* ---------- screens ---------- */
  function rHome() {
    const L = levelInfo(), u = S.user, C = 2 * Math.PI * 34, drop = D.drop, left = S.drop.left;
    const ring = `<div class="ring"><svg width="84" height="84" viewBox="0 0 84 84"><circle class="track" cx="42" cy="42" r="34" stroke-width="8" fill="none"/><circle class="bar" cx="42" cy="42" r="34" stroke-width="8" fill="none" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-target="${(C * (1 - L.pct)).toFixed(1)}"/></svg><div class="val">${u.visits}<span>визитов</span></div></div>`;
    const nextTxt = L.next ? `Ещё ${L.toNext} ${plural(L.toNext, ['визит', 'визита', 'визитов'])} до уровня «${L.next.name}»` : 'Максимальный уровень';
    const weekly = D.products.filter(p => p.cat === 'cookies').slice(0, 4);
    const doneM = S.missions.filter(m => m.progress >= m.total).length;
    const gotC = S.collection.items.filter(i => i.got).length;
    const dropBtn = S.drop.reserved
      ? `<button class="btn white" data-action="dropqr">${ic('check', 18)} Забронировано · показать QR</button>`
      : `<button class="btn white" data-action="reserve">Забронировать</button>`;
    return topbar() + `
      <h1 class="greet">${greet()}, ${esc(u.name)}</h1>
      <section class="status" data-action="tab" data-arg="club">
        <div class="row between">
          <div><span class="pill rasp">${ic('crown', 14)} ${L.cur.name}</span><div class="balance">${fmt(u.balance)}<small>бонусов</small></div><p class="small muted" style="margin-top:6px">${nextTxt}</p></div>
          ${ring}
        </div>
      </section>
      <div class="quick">
        <button data-action="qr"><span class="ico dark">${ic('qr')}</span>Моя карта</button>
        <button data-action="tab" data-arg="shop"><span class="ico">${ic('bag')}</span>С собой</button>
        <button data-action="gift"><span class="ico">${ic('gift')}</span>Подарить</button>
      </div>
      <section class="section">
        <div class="drop">
          <img src="${drop.img}" alt="">
          <div class="body">
            <span class="pill ghost">${ic('flame', 14)} ${drop.label}</span>
            <h2>${drop.title}</h2>
            <p class="sub">${drop.subtitle}</p>
            <div class="meta"><span class="timer" id="drop-timer">--:--:--</span><span class="small">до конца дропа</span></div>
            <div class="row between small"><span>Осталось ${left} из ${drop.total}</span><span>${Math.round(left / drop.total * 100)}%</span></div>
            <div class="stock"><i style="width:${left / drop.total * 100}%"></i></div>
            ${dropBtn}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Вкусы недели</h2><button class="link" data-action="tab" data-arg="shop">Всё меню</button></div>
        <div class="strip">${weekly.map(pcard).join('')}</div>
      </section>
      <section class="section"><div class="grid">
        <div class="card" data-action="tab" data-arg="club"><div class="row"><span class="iconbtn">${ic('flame', 18)}</span><b class="small">Миссии</b></div><div class="display bold" style="font-size:22px;margin:10px 0 6px">${doneM}/${S.missions.length}</div><div class="prog"><i style="width:${doneM / S.missions.length * 100}%"></i></div></div>
        <div class="card" data-action="tab" data-arg="club"><div class="row"><span class="iconbtn">${ic('sparkle', 18)}</span><b class="small">Коллекция</b></div><div class="display bold" style="font-size:22px;margin:10px 0 6px">${gotC}/${S.collection.items.length}</div><div class="prog gold"><i style="width:${gotC / S.collection.items.length * 100}%"></i></div></div>
      </div></section>
      <section class="section"><div class="founder"><span class="fi">${ic('crown')}</span><div><b>Основатель №${u.founderNo}</b><span>Вы с нами с первого месяца. Плюс 2% к бонусам навсегда</span></div></div></section>`;
  }

  function rShop() {
    const list = D.products.filter(p => S.cat === 'all' || p.cat === S.cat);
    return topbar() + `<h1 class="page-title">Меню</h1>
      <div class="chips">${D.categories.map(c => `<button class="chip ${S.cat === c.id ? 'on' : ''}" data-action="cat" data-arg="${c.id}">${c.name}</button>`).join('')}</div>
      <div class="grid">${list.map(pcard).join('')}</div>
      <p class="demo-note">Предзаказ с собой: заберите без очереди. Цены в демо условные</p>`;
  }

  function rClub() {
    const L = levelInfo();
    const colors = ['#EBA6BC', '#D63D73', '#D9A441', '#1B1517'];
    const levels = D.levels.map((l, k) => `<div class="level ${k === L.i ? 'cur' : ''} ${k > L.i ? 'locked' : ''}"><span class="lvl-dot" style="background:${colors[k]}"></span><div class="grow"><div class="ln">${l.name}${k === L.i ? ' <span class="xs muted">· вы здесь</span>' : ''}</div><div class="lp">${l.perks.join(' · ')}</div></div><span class="lc">${l.cashback}%</span></div>`).join('');
    const missions = S.missions.map(m => { const done = m.progress >= m.total; return `<div class="mission ${done ? 'done' : ''}" data-action="mission" data-arg="${m.id}"><span class="mi">${ic(done ? 'check' : m.icon, 20)}</span><div class="grow"><div class="mt">${m.title}</div><div class="mr">${m.reward}</div><div class="prog" style="margin-top:6px"><i style="width:${m.progress / m.total * 100}%"></i></div></div><span class="mp">${m.progress}/${m.total}</span></div>`; }).join('');
    const coll = S.collection.items.map(i => { const p = prod(i.id); return `<div class="ci ${i.got ? '' : 'lock'}"><img src="${p.img}" alt="">${i.got ? `<span class="ck">${ic('check', 14)}</span>` : `<span class="lk">${ic('lock', 22)}</span>`}<span class="nm">${p.name}</span></div>`; }).join('');
    const got = S.collection.items.filter(i => i.got).length;
    const secret = D.secret.map(s => { const open = L.i >= s.level; return `<div class="si"><img src="${s.img}" alt=""><span class="lock">${ic(open ? 'check' : 'lock', 16)}</span><div class="st"><b>${s.name}</b><span>${open ? 'Открыто для вас' : s.hint}</span></div></div>`; }).join('');
    return topbar() + `<h1 class="page-title">Клуб</h1>
      <div class="card"><div class="section-head" style="margin-bottom:12px"><h2>Уровни</h2><span class="pill">${S.user.visits} ${plural(S.user.visits, ['визит', 'визита', 'визитов'])}</span></div><div class="levels">${levels}</div><p class="xs muted" style="margin-top:12px">Бонусы списываются, уровень остаётся. Статус считается по визитам за год</p></div>
      <section class="section"><div class="section-head"><h2>Миссии</h2><span class="link">${S.missions.filter(m => m.progress >= m.total).length}/${S.missions.length} выполнено</span></div><div class="card">${missions}</div></section>
      <section class="section"><div class="section-head"><h2>${S.collection.title}</h2><span class="link">${got}/${S.collection.items.length}</span></div><div class="card"><div class="coll">${coll}</div><p class="small muted" style="margin-top:12px">Соберите все шесть вкусов: ${S.collection.reward.toLowerCase()}</p></div></section>
      <section class="section"><div class="section-head"><h2>Секретное меню</h2><span class="link">с уровня «Крем»</span></div><div class="secret">${secret}</div></section>
      <section class="section"><div class="card dark"><div class="row"><span class="iconbtn" style="background:rgba(246,205,217,.14);color:var(--pink)">${ic('users')}</span><div class="grow"><b>Пригласи друга</b><div class="small" style="opacity:.85">Другу 150 ₽ на первый заказ, вам 150 ₽ после его покупки</div></div></div><button class="btn white" style="margin-top:14px" data-action="refer">${ic('share', 18)} Отправить приглашение</button></div></section>
      <section class="section"><div class="card"><div class="row"><span class="iconbtn rasp">${ic('gift')}</span><div class="grow"><b>Подарить печенье</b><div class="small muted">Оплатите и отправьте карточку другу. Он покажет QR на кассе</div></div></div><button class="btn ghost" style="margin-top:14px" data-action="gift">Выбрать подарок</button></div></section>`;
  }

  function rOrders() {
    const active = S.orders.filter(o => o.status !== 'done'), hist = S.orders.filter(o => o.status === 'done'), sub = D.subscription;
    const names = { cook: 'Готовим', ready: 'Готов', done: 'Выдан' };
    const li = o => `<div class="li" data-action="order" data-arg="${o.id}"><span class="lic">${ic(o.status === 'done' ? 'bag' : 'cup', 20)}</span><div class="grow"><div class="row between"><b class="small">Заказ ${o.id}</b><span class="status-tag ${o.status}">${names[o.status]}</span></div><div class="xs muted ellipsis">${o.items}</div><div class="xs muted">${o.date}</div></div><b class="display small">${fmt(o.sum)}</b></div>`;
    const activeBlock = active.length
      ? `<div class="card"><div class="section-head" style="margin-bottom:6px"><h2>Сейчас</h2></div><div class="list">${active.map(li).join('')}</div></div>`
      : `<div class="card soft"><b>Активных заказов нет</b><p class="small muted" style="margin-top:4px">Закажите с собой и заберите без очереди</p><button class="btn dark sm" style="margin-top:12px" data-action="tab" data-arg="shop">Открыть меню</button></div>`;
    return topbar() + `<h1 class="page-title">Заказы</h1>${activeBlock}
      <section class="section"><div class="card"><div class="row"><span class="iconbtn">${ic('ticket')}</span><div class="grow"><b>${sub.title}</b><div class="small muted">Осталось ${sub.left} из ${sub.total} · экономия ${fmt(sub.saved)}</div></div></div><div class="prog" style="margin-top:12px"><i style="width:${sub.left / sub.total * 100}%"></i></div><button class="btn ghost sm" style="margin-top:12px" data-action="sub">Как это работает</button></div></section>
      <section class="section"><div class="section-head"><h2>История</h2></div><div class="card"><div class="list">${hist.map(li).join('')}</div></div></section>`;
  }

  function rProfile() {
    const u = S.user, L = levelInfo();
    const av = photo ? `<img src="${photo}" alt="">` : esc(initials(u.name));
    const tastesAll = ['клубника', 'малина', 'фисташка', 'карамель', 'шоколад', 'цитрус', 'орехи', 'кофе'];
    return topbar() + `
      <div class="card"><div class="row"><span class="avatar lg">${av}</span><div class="grow"><h2 style="font-size:20px">${esc(u.name)}</h2><div class="small muted">${u.phone}</div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><span class="pill rasp">${L.cur.name}</span><span class="pill gold">${ic('crown', 12)} Основатель №${u.founderNo}</span></div></div></div></div>
      <section class="section"><div class="card">
        <div class="prow"><div><div class="pt">День рождения</div><div class="ps">Подарок за неделю до даты</div></div><input class="input" type="date" style="width:160px;height:44px;padding:0 10px" value="${u.birthday}" data-field="birthday"></div>
        <div class="prow"><div><div class="pt">Уведомления</div><div class="ps">Дропы, миссии, готовность заказа</div></div><button class="switch ${u.notify ? 'on' : ''}" data-action="notify"></button></div>
        <div class="prow" style="display:block"><div class="pt">Что любите</div><div class="ps">Рекомендации и дропы под ваш вкус</div><div class="tastes">${tastesAll.map(t => `<button class="chip sm tag ${u.tastes.includes(t) ? 'on' : ''}" data-action="taste" data-arg="${t}">${t}</button>`).join('')}</div></div>
      </div></section>
      <section class="section"><div class="card">
        <div class="prow" data-action="home-screen"><div><div class="pt">Иконка на экран телефона</div><div class="ps">Открывать клуб в одно касание</div></div><span class="iconbtn">${ic('phone', 18)}</span></div>
        <div class="prow"><div><div class="pt">Полный экран</div><div class="ps">Без шапки Telegram</div></div><button class="switch ${S.fullscreen ? 'on' : ''}" data-action="fullscreen"></button></div>
        <div class="prow" data-action="qr"><div><div class="pt">Моя карта</div><div class="ps">QR и код ${u.code}</div></div><span class="iconbtn">${ic('qr', 18)}</span></div>
      </div></section>
      <section class="section"><div class="card">
        <div class="prow" data-action="staff-login"><div><div class="pt">Для персонала</div><div class="ps">Начисление и списание бонусов</div></div><span class="iconbtn">${ic('scan', 18)}</span></div>
        <div class="prow" data-action="reset"><div><div class="pt">Сбросить демо</div><div class="ps">Вернуть начальные данные</div></div><span class="iconbtn">${ic('close', 18)}</span></div>
      </div></section>
      <p class="version">cream cookies club · прототип 0.1 · ${inTG ? 'Telegram ' + esc(tg.platform) + ' ' + esc(tg.version) : 'браузер'}</p>`;
  }

  function rStaff() {
    const seg = S.staffSeg, ops = S.ops;
    const segs = [['accrue', 'Начислить'], ['redeem', 'Списать'], ['order', 'Выдать'], ['history', 'История']];
    const guestField = `<div class="field"><label>Гость</label><div class="row"><input class="input grow" id="st-guest" placeholder="Код CC-… или 4 цифры телефона" value="${esc(S.st.guest || '')}"><button class="iconbtn rasp" style="width:52px;height:52px;border-radius:14px;flex:none" data-action="scan">${ic('scan')}</button></div></div>`;
    let body = '';
    if (seg === 'accrue') body = `<div class="card">${guestField}<div class="field"><label>Сумма чека, ₽</label><input class="input big" id="st-sum" inputmode="numeric" placeholder="0" value="${esc(S.st.sum || '')}"></div><button class="btn primary" style="margin-top:16px" data-action="accrue">Начислить бонусы</button><p class="demo-note">Сканер открывает камеру Telegram. В браузере введите код CC-0127</p></div>`;
    else if (seg === 'redeem') body = `<div class="card">${guestField}<div class="field"><label>Списать, ₽</label><input class="input big" id="st-sum" inputmode="numeric" placeholder="0" value="${esc(S.st.sum || '')}"></div><button class="btn dark" style="margin-top:16px" data-action="redeem">Списать бонусы</button><p class="demo-note">Сумму скидки бариста вводит в чек на Эвоторе. Сверка с чеками в фазе 2</p></div>`;
    else if (seg === 'order') body = `<div class="card" style="text-align:center"><p class="muted small">Отсканируйте QR заказа у гостя</p><button class="btn primary" style="margin-top:14px" data-action="scan-order">${ic('scan', 20)} Сканировать заказ</button>${S.orders.filter(o => o.status !== 'done').map(o => `<button class="btn ghost" style="margin-top:10px" data-action="give" data-arg="${o.id}">Выдать ${o.id} · ${o.items}</button>`).join('')}</div>`;
    else body = `<div class="card">${ops.map(o => `<div class="op"><span class="ot">${o.time}</span><span class="grow ellipsis">${o.guest}<span class="xs muted"> · ${{ accrue: 'чек', redeem: 'списание', order: 'выдача' }[o.type]} ${fmt(o.sum)}</span></span><span class="ob ${o.bonus > 0 ? 'plus' : o.bonus < 0 ? 'minus' : ''}">${o.bonus > 0 ? '+' : ''}${o.bonus || ''}</span></div>`).join('')}</div>`;
    return `<div class="staff-head"><div class="row"><button class="iconbtn" data-action="staff-exit">${ic('back', 18)}</button><div><h1 style="font-size:18px">Режим бариста</h1><div class="xs muted">Смена · ${new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</div></div></div><span class="pill dark">${ops.filter(o => o.type === 'accrue').length} чеков</span></div>
      <div class="seg">${segs.map(s => `<button class="${seg === s[0] ? 'on' : ''}" data-action="seg" data-arg="${s[0]}">${s[1]}</button>`).join('')}</div>${body}`;
  }

  /* ---------- sheets ---------- */
  function openProduct(id) {
    const p = prod(id);
    openSheet(`<img class="hero" src="${p.img}" alt=""><h2>${p.full}</h2><p class="muted small">${p.desc}</p>
      <div class="tastes">${p.tags.map(t => `<span class="chip sm tag">${t}</span>`).join('')}</div>
      <div class="row between" style="margin-top:18px"><span class="display bold" style="font-size:22px">${fmt(p.price)}</span><span class="qty" id="sheet-qty">${qtyHtml(id)}</span></div>
      <div class="foot"><button class="btn primary" data-action="tocart" data-arg="${id}">${S.cart[id] ? 'Перейти к заказу' : 'Добавить в заказ'}</button></div>`);
  }
  function openCheckout() {
    const items = Object.entries(S.cart).map(kv => ({ p: prod(kv[0]), q: kv[1] }));
    if (!items.length) return;
    const sum = cartSum(), maxBonus = Math.min(S.user.balance, Math.floor(sum * 0.5)), used = S.useBonus ? maxBonus : 0;
    openSheet(`<h2>Заказ с собой</h2>
      <div class="list">${items.map(i => `<div class="li"><img src="${i.p.img}" style="width:44px;height:44px;border-radius:12px;object-fit:cover" alt=""><div class="grow"><div class="bold small">${i.p.full}</div><div class="xs muted">${i.q} × ${fmt(i.p.price)}</div></div><b class="display small">${fmt(i.p.price * i.q)}</b></div>`).join('')}</div>
      <div class="field"><label>Когда забрать</label><div class="time-chips">${['15 мин', '30 мин', '45 мин', '1 час'].map((t, k) => `<button class="chip ${(S.pickup || 0) === k ? 'on' : ''}" data-action="time" data-arg="${k}">${t}</button>`).join('')}</div></div>
      <div class="prow" style="margin-top:14px"><div><div class="pt">Списать бонусы</div><div class="ps">Доступно ${fmt(maxBonus)} из ${fmt(S.user.balance)}</div></div><button class="switch ${S.useBonus ? 'on' : ''}" data-action="usebonus"></button></div>
      <div class="row between" style="margin-top:12px"><span class="muted">Итого к оплате</span><b class="display" style="font-size:20px">${fmt(sum - used)}</b></div>
      <div class="foot"><button class="btn primary" data-action="pay">Оплатить ${fmt(sum - used)}</button></div>
      <p class="demo-note">Оплата через ЮKassa: СБП или карта, чек по 54-ФЗ. В демо деньги не списываются</p>`);
  }
  function openPay() {
    const sum = cartSum() - (S.useBonus ? Math.min(S.user.balance, Math.floor(cartSum() * 0.5)) : 0);
    openSheet(`<h2>Оплата</h2><p class="small muted">Безопасный платёж через ЮKassa</p>
      <div class="card" style="margin-top:14px"><div class="prow"><div class="row"><span class="iconbtn rasp">${ic('sbp', 18)}</span><div><div class="pt">СБП</div><div class="ps">Через приложение банка</div></div></div><span class="pill rasp">выбрано</span></div><div class="prow"><div class="row"><span class="iconbtn">${ic('card', 18)}</span><div><div class="pt">Банковская карта</div><div class="ps">Visa, Mastercard, Мир</div></div></div></div></div>
      <div class="foot"><button class="btn primary" data-action="paid">Оплатить ${fmt(sum)}</button></div><p class="demo-note">Демо: нажмите и заказ появится во вкладке «Заказы»</p>`);
  }
  function completeOrder() {
    const sum = cartSum(), used = S.useBonus ? Math.min(S.user.balance, Math.floor(sum * 0.5)) : 0;
    S.orderSeq += 1;
    const id = 'A-' + S.orderSeq, when = pickupTime();
    const items = Object.entries(S.cart).map(kv => prod(kv[0]).name + (kv[1] > 1 ? ' ×' + kv[1] : '')).join(', ');
    S.orders.unshift({ id, date: 'сегодня, ' + when, items, sum: sum - used, status: 'cook' });
    S.user.balance -= used; S.cart = {}; S.useBonus = false; S.pickup = 0; save(); hap('success'); go('orders');
    openSheet(`<div class="success"><div class="big">${ic('check', 40)}</div><h2>Заказ ${id} принят</h2><p class="muted" style="margin-top:6px">Будет готов к ${when}. Покажите QR на кассе и заберите без очереди</p><div class="qrbox qr-order" style="margin:16px auto 0;max-width:260px"><div id="qr"></div><div class="code">${id}</div></div><div class="foot"><button class="btn dark" data-action="close">Отлично</button></div></div>`);
    drawQR('qr', 'ORDER:' + id);
  }
  function openQR() {
    const u = S.user, L = levelInfo();
    openSheet(`<h2 style="text-align:center">Моя карта</h2><p class="small muted" style="text-align:center">Покажите бариста, он отсканирует</p>
      <div class="qrbox" style="margin-top:14px"><div id="qr"></div><div class="code">${u.code}</div><div class="row" style="gap:8px"><span class="pill rasp">${L.cur.name}</span><span class="pill">${fmt(u.balance)} бонусов</span></div></div>
      <p class="demo-note">Код живёт 60 секунд, переслать скриншот не получится</p>`);
    drawQR('qr', 'CC:' + u.code + ':' + Math.floor(Date.now() / 60000));
  }
  function reserveDrop() {
    if (S.drop.left <= 0) return toast('Дроп закончился');
    S.drop.left -= 1; S.drop.reserved = true; save(); hap('success'); render(); openDropQR();
  }
  function openDropQR() {
    openSheet(`<div class="success"><div class="big">${ic('flame', 40)}</div><h2>Бронь на дроп</h2><p class="muted" style="margin-top:6px">${D.drop.subtitle}. Заберите до ${D.drop.endHour}:00, покажите QR на кассе</p><div class="qrbox qr-order" style="margin:16px auto 0;max-width:260px"><div id="qr"></div><div class="code">DROP · ${S.user.code}</div></div><div class="foot"><button class="btn dark" data-action="close">Понятно</button></div></div>`);
    drawQR('qr', 'DROP:' + S.user.code);
  }
  function openGift() {
    const list = D.products.filter(p => p.cat === 'cookies' || p.cat === 'gifts');
    openSheet(`<h2>Подарить</h2><p class="small muted">Выберите, что отправить. Друг получит карточку в Telegram и покажет QR на кассе</p>
      <div class="list" style="margin-top:10px">${list.map(p => `<div class="li" data-action="gift-send" data-arg="${p.id}"><img src="${p.img}" style="width:48px;height:48px;border-radius:14px;object-fit:cover" alt=""><div class="grow"><div class="bold small">${p.full}</div><div class="xs muted">${fmt(p.price)}</div></div><span class="iconbtn rasp">${ic('share', 16)}</span></div>`).join('')}</div>`);
  }
  function sendGift(id) {
    const p = prod(id); closeSheet(); hap('success');
    toast('Подарок оплачен, отправляем карточку', true);
    openShare(`Я дарю тебе ${p.full} в cream cookies. Покажи код GIFT-7K2P на кассе и забери свой подарок`);
  }
  function openMission(id) {
    const m = S.missions.find(x => x.id === id), done = m.progress >= m.total;
    openSheet(`<h2>${m.title}</h2><p class="muted small">Награда: ${m.reward}</p><div class="prog" style="margin:14px 0 6px"><i style="width:${m.progress / m.total * 100}%"></i></div><div class="row between small"><span>${done ? 'Выполнено' : 'Прогресс засчитывается автоматически по чекам'}</span><b class="display">${m.progress}/${m.total}</b></div>
      <div class="foot">${done ? `<button class="btn ghost" data-action="close">Награда уже начислена</button>` : `<button class="btn primary" data-action="mission-plus" data-arg="${id}">Демо: засчитать шаг</button>`}</div>`);
  }
  function missionPlus(id) {
    const m = S.missions.find(x => x.id === id); if (m.progress >= m.total) return;
    m.progress += 1;
    if (m.progress >= m.total) { const add = parseInt((m.reward.match(/\d+/) || ['0'])[0], 10); S.user.balance += add; hap('success'); toast(`Миссия выполнена: ${m.reward}`, true); closeSheet(); }
    else { hap('light'); openMission(id); }
    save(); render();
  }
  function openOrder(id) {
    const o = S.orders.find(x => x.id === id); if (!o) return;
    const names = { cook: 'Готовим', ready: 'Готов к выдаче', done: 'Выдан' };
    openSheet(`<h2>Заказ ${o.id}</h2><p class="small muted">${o.date} · ${names[o.status]}</p><div class="card" style="margin-top:12px"><div class="bold small">${o.items}</div><div class="row between" style="margin-top:8px"><span class="muted small">Сумма</span><b class="display">${fmt(o.sum)}</b></div></div>
      ${o.status === 'done' ? '' : `<div class="qrbox qr-order" style="margin:16px auto 0;max-width:260px"><div id="qr"></div><div class="code">${o.id}</div></div><p class="demo-note">Покажите QR бариста при получении</p>`}`);
    if (o.status !== 'done') drawQR('qr', 'ORDER:' + o.id);
  }
  function openSub() {
    openSheet(`<h2>Абонемент</h2><p class="muted small">Десять печений по цене девяти. Деньги вперёд, печенье когда захотите, срок год.</p>
      <div class="card" style="margin-top:14px"><div class="row"><span class="iconbtn">${ic('ticket')}</span><div class="grow"><b>${D.subscription.title}</b><div class="small muted">Осталось ${D.subscription.left} из ${D.subscription.total}</div></div></div></div>
      <div class="foot"><button class="btn primary" data-action="close">Купить ещё один · ${fmt(2610)}</button></div><p class="demo-note">Для кафе это выручка сегодня и гарантированные визиты завтра</p>`);
  }
  function openStaffLogin() {
    openSheet(`<h2>Для персонала</h2><p class="small muted">Введите PIN смены</p><div class="field"><input class="input big" id="pin" type="password" inputmode="numeric" maxlength="4" placeholder="••••"></div><div class="foot"><button class="btn dark" data-action="staff-ok">Войти</button></div><p class="demo-note">Демо-PIN: 1111</p>`);
    setTimeout(() => { const i = $('#pin'); if (i) i.focus(); }, 50);
  }
  function staffOk() {
    const v = ($('#pin') || {}).value || '';
    if (v !== '1111') { hap('error'); return toast('Неверный PIN'); }
    S.staffMode = true; S.staffSeg = 'accrue'; S.st = {}; closeSheet(); hap('success'); go('staff');
  }
  function isMe(g) { const s = (g || '').toUpperCase().replace(/\s/g, ''); return s.includes('CC-0127') || s.endsWith('4217'); }
  function accrue() {
    const g = ($('#st-guest') || {}).value || '', sum = parseInt(($('#st-sum') || {}).value, 10);
    if (!g.trim()) return toast('Укажите гостя');
    if (!sum) return toast('Введите сумму чека');
    const me = isMe(g), L = levelInfo(), pct = me ? L.cur.cashback + 2 : 5, bonus = Math.round(sum * pct / 100);
    const name = me ? S.user.name + ' · ' + L.cur.name : 'Гость ' + g.trim();
    S.ops.unshift({ time: now(), guest: name, type: 'accrue', sum, bonus });
    if (me) { S.user.balance += bonus; S.user.visits += 1; const m = S.missions.find(x => x.id === 'm2'); if (m && m.progress < m.total) m.progress += 1; }
    S.st = {}; save(); hap('success'); render(); toast(`Начислено ${bonus} ₽ · ${name}`, true);
  }
  function redeem() {
    const g = ($('#st-guest') || {}).value || '', sum = parseInt(($('#st-sum') || {}).value, 10);
    if (!g.trim()) return toast('Укажите гостя');
    if (!sum) return toast('Введите сумму');
    const me = isMe(g);
    if (me && sum > S.user.balance) { hap('error'); return toast(`У гостя только ${fmt(S.user.balance)}`); }
    const name = me ? S.user.name + ' · ' + levelInfo().cur.name : 'Гость ' + g.trim();
    S.ops.unshift({ time: now(), guest: name, type: 'redeem', sum, bonus: -sum });
    if (me) S.user.balance -= sum;
    S.st = {}; save(); hap('success'); render(); toast(`Списано ${fmt(sum)}. Введите скидку ${fmt(sum)} в чек`, true);
  }
  function giveOrder(id) {
    const o = S.orders.find(x => x.id === id); if (!o) return toast('Заказ не найден');
    o.status = 'done'; S.ops.unshift({ time: now(), guest: 'Заказ ' + id, type: 'order', sum: o.sum, bonus: 0 });
    save(); hap('success'); render(); toast(`Заказ ${id} выдан`, true);
  }
  function homeScreen() {
    if (tg && inTG && tg.isVersionAtLeast('8.0') && tg.addToHomeScreen) tg.addToHomeScreen();
    else toast('Доступно в Telegram на телефоне');
  }
  function toggleFS() {
    if (!(tg && inTG && tg.isVersionAtLeast('8.0'))) return toast('Полный экран доступен в Telegram 11+');
    if (S.fullscreen) tg.exitFullscreen(); else tg.requestFullscreen();
    S.fullscreen = !S.fullscreen; save(); render();
  }
  function toggleTaste(t) {
    const i = S.user.tastes.indexOf(t); if (i >= 0) S.user.tastes.splice(i, 1); else S.user.tastes.push(t);
    save(); render();
  }

  /* ---------- render ---------- */
  const screens = { home: rHome, shop: rShop, club: rClub, orders: rOrders, profile: rProfile, staff: rStaff };
  function render() {
    const v = $('#view');
    v.innerHTML = (screens[S.tab] || rHome)();
    const n = cartCount(), showCart = n > 0 && S.tab === 'shop';
    v.classList.toggle('has-cart', showCart);
    $$('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
    const cnt = $('#cart-cnt'); cnt.textContent = n; cnt.style.display = n ? 'grid' : 'none';
    const bar = $('#cartbar'); bar.style.display = showCart ? 'flex' : 'none';
    if (showCart) { $('#cart-sum').textContent = fmt(cartSum()); $('#cart-n').textContent = n + ' ' + plural(n, ['позиция', 'позиции', 'позиций']); }
    $('.tabbar').style.display = S.tab === 'staff' ? 'none' : 'grid';
    $$('.ring .bar').forEach(b => requestAnimationFrame(() => requestAnimationFrame(() => { b.style.strokeDashoffset = b.dataset.target; })));
    tick();
  }
  function tick() {
    const el = $('#drop-timer'); if (!el) return;
    const n = new Date(), end = new Date(); end.setHours(D.drop.endHour, 0, 0, 0); if (end <= n) end.setDate(end.getDate() + 1);
    let s = Math.floor((end - n) / 1000); const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
    el.textContent = [h, m, s].map(x => String(x).padStart(2, '0')).join(':');
  }
  setInterval(tick, 1000);

  /* ---------- events ---------- */
  const actions = {
    tab: a => go(a),
    cat: a => { S.cat = a; save(); render(); },
    product: a => openProduct(a),
    cart: a => { const kv = a.split('|'), id = kv[0], d = parseInt(kv[1], 10); const q = (S.cart[id] || 0) + d; if (q <= 0) delete S.cart[id]; else S.cart[id] = q; save(); render(); const sq = $('#sheet-qty'); if (sq) sq.innerHTML = qtyHtml(id); },
    tocart: a => { if (!S.cart[a]) { S.cart[a] = 1; save(); } closeSheet(); go('shop'); toast('Добавлено в заказ'); },
    checkout: () => openCheckout(),
    time: a => { S.pickup = parseInt(a, 10); openCheckout(); },
    usebonus: () => { S.useBonus = !S.useBonus; openCheckout(); },
    pay: () => openPay(),
    paid: () => completeOrder(),
    qr: () => openQR(),
    gift: () => openGift(),
    'gift-send': a => sendGift(a),
    refer: () => openShare('Заходи в cream cookies club: 150 ₽ на первый заказ по моей ссылке и секретное меню для своих'),
    reserve: () => reserveDrop(),
    dropqr: () => openDropQR(),
    mission: a => openMission(a),
    'mission-plus': a => missionPlus(a),
    order: a => openOrder(a),
    sub: () => openSub(),
    notify: () => { S.user.notify = !S.user.notify; save(); render(); },
    taste: a => toggleTaste(a),
    'home-screen': () => homeScreen(),
    fullscreen: () => toggleFS(),
    'staff-login': () => openStaffLogin(),
    'staff-ok': () => staffOk(),
    'staff-exit': () => { S.staffMode = false; go('home'); },
    seg: a => { S.staffSeg = a; S.st = {}; render(); },
    scan: () => scan(txt => { const m = /CC-\d{4}/.exec(txt.toUpperCase()); S.st.guest = m ? m[0] : txt; render(); hap('success'); }),
    'scan-order': () => scan(txt => { const m = /ORDER:([A-Z]-\d+)/.exec(txt.toUpperCase()); if (m) giveOrder(m[1]); else toast('Это не QR заказа'); }),
    accrue: () => accrue(),
    redeem: () => redeem(),
    give: a => giveOrder(a),
    reset: () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } S = fresh(); if (tgUser && tgUser.first_name) S.user.name = tgUser.first_name; closeSheet(); render(); toast('Демо сброшено'); },
    close: () => closeSheet()
  };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-action]'); if (!t) return;
    const fn = actions[t.dataset.action]; if (!fn) return;
    hap('light'); fn(t.dataset.arg);
  });
  document.addEventListener('change', e => {
    if (e.target.dataset && e.target.dataset.field === 'birthday') { S.user.birthday = e.target.value; save(); toast('Запомнили. Подарок придёт за неделю до даты', true); }
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'st-guest') S.st.guest = e.target.value;
    if (e.target.id === 'st-sum') S.st.sum = e.target.value;
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'pin') staffOk(); });

  /* ---------- init ---------- */
  const tabs = [['home', 'Главная', 'home'], ['shop', 'Меню', 'cookie'], ['club', 'Клуб', 'star'], ['orders', 'Заказы', 'bag'], ['profile', 'Профиль', 'user']];
  $('.tabbar').innerHTML = tabs.map(t => `<button data-tab="${t[0]}"><span class="tbi">${ic(t[2], 22)}</span>${t[1]}${t[0] === 'orders' ? '<span class="cnt" id="cart-cnt" style="display:none"></span>' : ''}</button>`).join('');
  $$('.tabbar button').forEach(b => b.addEventListener('click', () => { hap('light'); go(b.dataset.tab); }));
  if (tg) {
    try {
      tg.ready(); tg.expand();
      if (tg.setHeaderColor) tg.setHeaderColor('#F6CDD9');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#F6CDD9');
      if (tg.setBottomBarColor) tg.setBottomBarColor('#FFFFFF');
      if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
      if (tg.BackButton) tg.BackButton.onClick(() => closeSheet());
      if (tg.onEvent) tg.onEvent('fullscreenChanged', () => { S.fullscreen = !!tg.isFullscreen; save(); });
    } catch (e) { /* ignore */ }
  }
  if (!inTG) document.body.classList.add('desktop');
  render();
})();
