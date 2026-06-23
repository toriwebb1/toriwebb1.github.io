/* Mindful Spending — standalone case study (extracted from app.js) */

const CaseStudy = (function () {
  let done = false;

  // stacked red/green/blue bowl logo
  const LOGO = `<img src="logo.png" alt="Mindful Spending" style="width:100%;height:100%;object-fit:contain;display:block;" />`;

  // line icons for the home menu
  const ICON = {
    add: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    spend: '<svg viewBox="0 0 24 24"><polyline points="3 16 9 10 13 14 21 6"/><polyline points="15 6 21 6 21 12"/></svg>',
    price: '<svg viewBox="0 0 24 24"><path d="M20 13l-7 7-9-9V4h7z"/><circle cx="8.5" cy="8.5" r="1.3"/></svg>',
    budget: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="14" r="1.1"/></svg>',
    mindful: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3z"/></svg>',
    gauge: '<svg viewBox="0 0 24 24"><path d="M4 14a8 8 0 0 1 16 0"/><path d="M12 14l4-2.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  };

  const tile = (bg, ink, icon, label, go) =>
    `<div class="ap-tile${ink ? ' ap-tile--ink' : ''}"${go ? ` data-go="${go}"` : ''} style="background:${bg}">
      <span class="ap-tile__ico">${icon}</span>
      <span class="ap-tile__label">${label}</span>
      <span class="ap-tile__chev">${ICON.chev}</span>
    </div>`;

  function phone({ title, body, fab = 'next', dark = false }) {
    const fabBtn = fab === 'none' ? ''
      : `<button class="ap__fab ap__fab--${fab}">${fab === 'prev' ? '‹' : '→'}</button>`;
    return `<div class="ap${dark ? ' ap--dark' : ''}"><div class="ap__screen">
      <div class="ap__notch"></div>
      <div class="ap__bar">
        <span class="ap__logo">${LOGO}</span>
        <span class="ap__title">${title}</span>
        <span class="ap__menu">&#9776;</span>
      </div>
      <div class="ap__body">${body}</div>
      ${fabBtn}
    </div></div>`;
  }

  /* ---- static screen bodies (for hero + gallery) ---- */
  const home = `
    <div class="ap-home">
      ${tile('var(--coral)', false, ICON.add, 'Log A Purchase', 'add')}
      ${tile('var(--pink)', false, ICON.spend, 'Check Spending')}
      ${tile('var(--yellow)', true, ICON.price, 'Price Match')}
      ${tile('var(--blue)', true, ICON.budget, 'Budget Plan')}
      ${tile('var(--peri)', false, ICON.mindful, 'Mindful Spending')}
      <div class="ap-home__rule"></div>
      <div class="ap-tracker">
        <div class="ap-tracker__top"><span class="ap-tracker__ico">${ICON.gauge}</span><small>Budget Tracker</small></div>
        <b>$214 left of your budget</b>
        <div class="ap-progress"><i></i></div>
      </div>
    </div>`;

  const addPurchase = `
    <div class="ap-label">Purchase Amount</div>
    <div class="ap-input">$</div>
    <div class="ap-label">Product</div>
    <div class="ap-input"></div>
    <div class="ap-label">Store / Location</div>
    <div class="ap-input ap-input--select"></div>
    <div class="ap-label">Amount of Items</div>
    <div class="ap-input"></div>`;

  const wantNeed = `
    <div class="wn">
      <h3>Was this a want<br>or a need?</h3>
      <div class="wn__btn wn__btn--want">Want</div>
      <div class="wn__btn wn__btn--need">Need</div>
    </div>`;

  const txns = [
    ['Uber', 'April 25', '-18.42'], ['Starbucks', 'April 24', '-6.69'],
    ['Apple', 'April 24', '-10.99'], ['Amazon', 'April 22', '-24.87'],
    ['Chipotle', 'April 20', '-14.92'], ['Target', 'April 19', '-56.34'],
    ['Blick Art', 'April 19', '-33.48'], ['ALDI', 'April 18', '-48.11'],
    ['Sweetgreen', 'April 17', '-15.76'],
  ];
  const spendingHistory = txns.map(t =>
    `<div class="ap-row"><div class="ap-row__l"><b>${t[0]}</b><small>${t[1]}, 2026</small></div><div class="ap-neg">${t[2]}</div></div>`
  ).join('');

  const cats = [
    ['Grocery', '-278.40'], ['Food/Drink', '-504.68'], ['Art Supplies', '-113.55'],
    ['Shopping/Entertainment', '-289.07'], ['Transportation/Other', '-76.00'],
  ];
  const categoryBreakdown = `
    ${cats.map(c => `<div class="ap-row"><div class="ap-row__l"><b>${c[0]}</b></div><div class="ap-neg">${c[1]}</div></div>`).join('')}
    <div class="ap-pie"></div>
    <div class="ap-legend">
      <span><i style="background:var(--green)"></i>Grocery 22%</span>
      <span><i style="background:var(--blue)"></i>Food/Drink 22%</span>
      <span><i style="background:var(--peri)"></i>Shopping 23%</span>
      <span><i style="background:var(--pink)"></i>Art Supplies 9%</span>
      <span><i style="background:var(--yellow)"></i>Transport 18%</span>
      <span><i style="background:var(--coral)"></i>Subscriptions 6%</span>
    </div>`;

  const budgetPlan = `
    <div class="ap-bp">
      <div class="ap-bpcard">
        <span class="blob blob--tr"></span><span class="blob blob--r"></span><span class="blob blob--bl"></span>
        <small>Monthly Spending</small>
        <b>$1261.70</b>
        <span class="ap-bpcard__budget">My Budget <i>&rarr;</i></span>
      </div>
      <div class="ap-bpstat">
        <div><small>Money left of budget</small><b class="over">-311.70 Over</b></div>
        <div><small>Time left of budget</small><b>0 days</b></div>
      </div>
      <div class="ap-tile" style="background:var(--blue);justify-content:center">Check Budget Plan</div>
      <div class="ap-tile" style="background:var(--blue);justify-content:center">Create New Budget Plan</div>
    </div>`;

  /* ---- shared bits ---- */
  const seedTx = [
    { n: 'Target', d: 'April 19', a: '-56.34', t: 'need' },
    { n: 'Starbucks', d: 'April 24', a: '-6.69', t: 'want' },
    { n: 'ALDI', d: 'April 18', a: '-48.11', t: 'need' },
  ];
  function txRow(t, isNew) {
    const c = t.t === 'want' ? 'var(--coral)' : 'var(--green)';
    return `<div class="ap-row${isNew ? ' ap-row--new' : ''}"><div class="ap-row__l"><b><span class="ap-row__tag" style="background:${c}"></span>${t.n}</b><small>${t.d}, 2026</small></div><div class="ap-neg">${t.a}</div></div>`;
  }
  // five gray circular sentiment faces (drawn, matching the source)
  function faces() {
    const mouths = ['M8 16 Q12 12.5 16 16', 'M8.5 15.4 Q12 13.8 15.5 15.4', 'M8.5 15 H15.5', 'M8.5 14.6 Q12 16.2 15.5 14.6', 'M8 14 Q12 17.5 16 14'];
    return mouths.map((m, i) =>
      `<span class="face" data-act="emoji" data-i="${i}"><svg viewBox="0 0 24 24"><circle class="fc" cx="12" cy="12" r="11"/><circle class="fe" cx="9" cy="10" r="1"/><circle class="fe" cx="15" cy="10" r="1"/><path class="fm" d="${m}"/></svg></span>`
    ).join('');
  }
  function qBlock(id, label, opts) {
    return `<div class="rl">${label}</div><div class="qgroup">${opts.map(o => `<div class="qbtn" data-act="answer" data-q="${id}" data-v="${o}">${o}</div>`).join('')}</div>`;
  }

  /* ============================================================
     Live prototype — full branching flow
     ============================================================ */
  function buildProto() {
    const el = document.getElementById('proto');
    el.className = 'ap ap--live';
    el.innerHTML = `<div class="ap__screen">
      <div class="ap__notch"></div>
      <div class="ap__bar">
        <span class="ap__logo">${LOGO}</span>
        <span class="ap__title" id="pTitle">Mindful Spending</span>
        <span class="ap__menu">&#9776;</span>
      </div>
      <div class="ap__body"><div class="proto-stage" id="pStage"></div></div>
      <button class="ap__fab ap__fab--prev" id="pBack" hidden>&lsaquo;</button>
      <button class="ap__fab ap__fab--next" id="pNext" hidden>&rarr;</button>
    </div>`;

    const titleEl = el.querySelector('#pTitle');
    const stage = el.querySelector('#pStage');
    const back = el.querySelector('#pBack');
    const next = el.querySelector('#pNext');
    const dots = [...document.querySelectorAll('#pdots i')];
    const dotIndex = { home: 0, add: 1, wn: 2, reflect: 3, diary: 3, added: 4, spending: 5 };

    const state = { amount: '', product: '', type: null, emoji: null, answers: {} };
    let items = seedTx.slice();
    let committed = false;
    let cur = 'home';

    function reset() {
      state.amount = ''; state.product = ''; state.type = null; state.emoji = null; state.answers = {};
      committed = false;
    }
    function commit() {
      if (committed) return; committed = true;
      const amt = parseFloat(state.amount);
      const product = (state.product || '').trim() || 'New purchase';
      const display = '-' + (isNaN(amt) ? '0.00' : amt.toFixed(2));
      items.forEach(t => (t.isNew = false));
      items.unshift({ n: product, d: 'April 25', a: display, t: state.type || 'want', isNew: true });
    }

    /* screen definitions: { title, dark, body, back, next, after } */
    const screens = {
      home: () => ({
        title: 'Mindful Spending', dark: true, body: home,
      }),
      add: () => ({
        title: 'Add Purchase', back: 'home', next: 'wn',
        body: `
          <div class="ap-label">Purchase Amount</div>
          <div class="proto-amount"><span>$</span><input id="fAmount" inputmode="decimal" placeholder="0.00" value="${state.amount}"></div>
          <div class="ap-label">Product</div>
          <input class="proto-input" id="fProduct" placeholder="What did you buy?" value="${state.product}">
          <div class="ap-label">Store / Location</div>
          <input class="proto-input" id="fStore" placeholder="Where?">
          <div class="ap-label">Amount of Items</div>
          <input class="proto-input" id="fItems" inputmode="numeric" placeholder="1">`,
        after() {
          stage.querySelector('#fAmount').oninput = e => (state.amount = e.target.value);
          stage.querySelector('#fProduct').oninput = e => (state.product = e.target.value);
        },
      }),
      wn: () => ({
        title: 'Add Purchase', back: 'add',
        body: `
          <div class="wn">
            <h3>Was this a want<br>or a need?</h3>
            <div class="wn__btn wn__btn--want" data-act="choose" data-type="want">Want</div>
            <div class="wn__btn wn__btn--need" data-act="choose" data-type="need">Need</div>
          </div>`,
      }),
      reflect: () => {
        const isWant = state.type === 'want';
        const accent = isWant ? 'var(--coral)' : 'var(--green)';
        const reasonLabel = isWant ? 'What did you want this for?' : 'What did you need this for?';
        const questions = isWant ? `
          ${qBlock('waited', 'Could this have waited?', ['yes', 'no'])}
          ${qBlock('use', 'Will you use this?', ['yes', 'no'])}
          ${qBlock('price', 'Did you try to price match?', ['yes', 'no'])}
          ${qBlock('remember', 'If you didn’t buy this now, would you still remember it in a week?', ['yes', 'no', 'maybe'])}` : '';
        return {
          title: 'Add Purchase', back: 'wn',
          body: `
            <div class="reflect" style="--accent:${accent}">
              <div class="rl rl--first">Category</div>
              <select class="proto-input proto-select">
                <option value="" disabled selected>Select…</option>
                <option>Grocery</option>
                <option>Food / Drink</option>
                <option>Art Supplies</option>
                <option>Shopping / Entertainment</option>
                <option>Transportation</option>
                <option>Subscriptions / Other</option>
              </select>
              <div class="rl">${reasonLabel}</div>
              <textarea class="proto-note" style="height:52px"></textarea>
              ${questions}
              <div class="rl">How do you feel about this purchase?</div>
              <div class="proto-emoji">${faces()}</div>
              <button class="ap-btn ap-btn--ghost" data-go="diary">Elaborate more</button>
              <button class="ap-btn" data-go="added">Done</button>
            </div>`,
          after() {
            Object.entries(state.answers).forEach(([q, v]) => {
              const b = stage.querySelector(`.qbtn[data-q="${q}"][data-v="${v}"]`);
              if (b) b.classList.add('sel');
            });
            if (state.emoji != null) {
              const f = stage.querySelectorAll('.face')[state.emoji];
              if (f) f.classList.add('sel');
            }
          },
        };
      },
      diary: () => ({
        title: 'Add Purchase', back: 'reflect',
        body: `
          <div class="diary-title">Spending Diary</div>
          <textarea class="proto-note diary-note" placeholder="Write a little about this purchase…"></textarea>
          <button class="ap-btn" data-go="added">Done</button>`,
      }),
      added: () => ({
        title: 'Add Purchase',
        body: `
          <div class="added">
            <div class="added__check"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>
            <h3>Purchase Added!</h3>
            <p class="added__sub">Logged as a <b style="color:${state.type === 'need' ? 'var(--green)' : 'var(--coral)'}">${state.type || 'want'}</b></p>
            <button class="ap-btn" data-go="home">Done</button>
            <button class="ap-btn ap-btn--ghost" data-go="spending">Check Spending</button>
          </div>`,
      }),
      spending: () => ({
        title: 'Spending History',
        body: `
          <div class="proto-added">${committed ? `"${(state.product || 'New purchase')}" added to your history` : ''}</div>
          ${items.map((t, i) => txRow(t, i === 0 && t.isNew)).join('')}
          <button class="ap-btn ap-btn--ghost" data-go="home">&#43; Log another purchase</button>`,
      }),
    };

    function setFab(btn, target) {
      if (!target) { btn.hidden = true; btn.onclick = null; return; }
      btn.hidden = false;
      btn.onclick = () => go(target);
    }

    function go(name) {
      if (name === 'added') commit();
      if (name === 'home') reset();
      const s = screens[name]();
      titleEl.textContent = s.title;
      el.classList.toggle('ap--dark', !!s.dark);
      stage.innerHTML = s.body;
      stage.classList.remove('slide-in'); void stage.offsetWidth; stage.classList.add('slide-in');
      dots.forEach((d, i) => d.classList.toggle('on', i === dotIndex[name]));
      setFab(back, s.back);
      setFab(next, s.next);
      if (s.after) s.after();
      cur = name;
    }

    // delegated interactions inside the stage
    stage.addEventListener('click', e => {
      const act = e.target.closest('[data-act]');
      if (act) {
        const a = act.dataset.act;
        if (a === 'choose') {
          state.type = act.dataset.type;
          stage.querySelectorAll('.wn__btn').forEach(x => x.classList.toggle('sel', x === act));
          setTimeout(() => go('reflect'), 200);
        } else if (a === 'emoji') {
          state.emoji = +act.dataset.i;
          stage.querySelectorAll('.face').forEach(x => x.classList.toggle('sel', x === act));
        } else if (a === 'answer') {
          state.answers[act.dataset.q] = act.dataset.v;
          act.parentElement.querySelectorAll('.qbtn').forEach(x => x.classList.toggle('sel', x === act));
        }
        return;
      }
      const g = e.target.closest('[data-go]');
      if (g) go(g.dataset.go);
    });

    go('home');
  }

  function ensure() {
    if (done) return;
    done = true;

    document.querySelectorAll('[data-logo]').forEach(e => (e.innerHTML = LOGO));

    // hero cluster — left, center(front), right (only if present)
    const heroEl = document.getElementById('heroPhones');
    if (heroEl) heroEl.innerHTML =
      phone({ title: 'Add Purchase', body: addPurchase, fab: 'next' }) +
      phone({ title: 'Mindful Spending', body: home, fab: 'none', dark: true }) +
      phone({ title: 'Budget Plan', body: budgetPlan, fab: 'prev' });

    // gallery (only if present)
    const galleryEl = document.getElementById('screenGallery');
    if (galleryEl) {
      const figs = [
        ['Mindful Spending', 'Dark home — five colour-coded paths', home, 'none', true],
        ['Add Purchase', 'Friction-light capture form', addPurchase, 'next', false],
        ['Add Purchase', 'The want vs. need decision', wantNeed, 'prev', false],
        ['Spending History', 'Chronological transaction feed', spendingHistory, 'none', false],
        ['Category Breakdown', 'Where the money actually goes', categoryBreakdown, 'none', false],
        ['Budget Plan', 'Over/under tracker at a glance', budgetPlan, 'prev', false],
      ];
      galleryEl.innerHTML = figs.map(f =>
        `<figure class="ap-figure">${phone({ title: f[0], body: f[2], fab: f[3], dark: f[4] })}<figcaption><b>${f[0]}</b>${f[1]}</figcaption></figure>`
      ).join('');
    }

    // design-system phone (only if present)
    const sysEl = document.getElementById('systemPhone');
    if (sysEl) sysEl.innerHTML =
      phone({ title: 'Category Breakdown', body: categoryBreakdown, fab: 'none' });

    if (document.getElementById('proto')) buildProto();
  }

  return { ensure };
})();

/* boot: render the case study immediately */
CaseStudy.ensure();
