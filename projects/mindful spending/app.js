/* ============================================================
   Tori Gram — Portfolio Components
   Edit the two image lists below to swap in your own assets.
   ============================================================ */
const CONFIG = {
  carousel: {
    user: 'tori.gram',
    location: 'Design Spotlight',
    likes: '2,847 likes',
    caption: '<b>tori.gram</b> Swipe through the spotlight ✦ Which slide hits hardest? #design #typography',
    autoplayMs: 3000,
    images: [
      'Assets/Spotlight-02-IG.png',
      'Assets/Spotlight-03-IG.png',
      'Assets/Spotlight-05-IG.png',
      'Assets/Spotlight-06-IG.png',
      'Assets/Spotlight-07-IG.png',
    ],
  },
  book: {
    // Provide single pages (best for the realistic 2-up book) OR full spreads.
    // Demo uses the Spotlight images so the flip works out of the box.
    pages: [
      'Assets/Spotlight-02-IG.png',
      'Assets/Spotlight-03-IG.png',
      'Assets/Spotlight-05-IG.png',
      'Assets/Spotlight-06-IG.png',
      'Assets/Spotlight-07-IG.png',
    ],
  },
};

/* ============================================================
   Navigation — header, project cards & links drive the views
   ============================================================ */
const Nav = (function initNav() {
  const views = [...document.querySelectorAll('.view')];
  const back = document.getElementById('backToProjects');
  const VIEW_NAMES = ['home', 'projects', 'about', 'carousel', 'book', 'case'];
  const EXPERIENCES = ['carousel', 'book', 'case'];

  function activate(name) {
    views.forEach(v => v.classList.toggle('is-active', v.dataset.view === name));
    VIEW_NAMES.forEach(n => document.body.classList.toggle('is-' + n, n === name));
    if (back) back.hidden = !EXPERIENCES.includes(name);   // back-to-projects only inside an experience
    if (name === 'home') Home.ensure();
    if (name === 'book') Book.ensure();   // lazy-init only when visible & sized
    if (name === 'case') CaseStudy.ensure();
    window.scrollTo(0, 0);
  }

  // any element with [data-view] navigates (cards, header, links, back button)
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-view]');
    // ignore the <section class="view"> wrappers — only real nav triggers count
    if (!trigger || trigger.classList.contains('view')) return;
    e.preventDefault();
    activate(trigger.dataset.view);
  });

  return { activate };
})();

/* ============================================================
   Carousel
   ============================================================ */
(function initCarousel() {
  const cfg = CONFIG.carousel;
  const track = document.getElementById('track');
  const dotsWrap = document.getElementById('dots');
  const counter = document.getElementById('counter');
  const carousel = document.getElementById('carousel');

  document.getElementById('counterTotal').textContent = cfg.images.length;
  document.getElementById('cUser').innerHTML = `${cfg.user}<small>${cfg.location}</small>`;
  document.getElementById('cLikes').textContent = cfg.likes;
  document.getElementById('cCaption').innerHTML = cfg.caption;

  // build slides + dots
  cfg.images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel__slide';
    slide.innerHTML = `<img src="${src}" alt="slide ${i + 1}" />`;
    track.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dots__dot' + (i === 0 ? ' is-active' : '');
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });

  const slides = cfg.images.length;
  const dots = dotsWrap.children;
  let index = 0;
  let timer;

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    counter.textContent = index + 1;
    for (let i = 0; i < dots.length; i++) dots[i].classList.toggle('is-active', i === index);
  }
  function go(i) { index = (i + slides) % slides; render(); restart(); }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', prev);

  function start() { timer = setInterval(next, cfg.autoplayMs); }
  function restart() { clearInterval(timer); start(); }
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', start);
  start();

  // swipe
  let startX = null;
  carousel.addEventListener('touchstart', e => (startX = e.touches[0].clientX), { passive: true });
  carousel.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    startX = null;
  });

  // like toggle
  const likeBtn = document.getElementById('likeBtn');
  const likesEl = document.getElementById('cLikes');
  const baseLikes = parseInt(cfg.likes.replace(/[^0-9]/g, ''), 10) || 0;
  let liked = false;
  likeBtn.addEventListener('click', () => {
    liked = !liked;
    likeBtn.classList.toggle('liked', liked);
    likesEl.textContent = (baseLikes + (liked ? 1 : 0)).toLocaleString() + ' likes';
  });
})();

/* ============================================================
   Book (StPageFlip) — lazy initialised on first reveal
   ============================================================ */
const Book = (function () {
  const cfg = CONFIG.book;
  let pageFlip = null;
  const el = document.getElementById('book');
  const counterEl = document.getElementById('bookCounter');
  const prevBtn = document.getElementById('bookPrev');
  const nextBtn = document.getElementById('bookNext');

  function updateMeta() {
    if (!pageFlip) return;
    const total = pageFlip.getPageCount();
    const current = pageFlip.getCurrentPageIndex();
    counterEl.textContent = `${current + 1} / ${total}`;
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= total - 1;
  }

  function ensure() {
    if (pageFlip) return;                         // init once
    if (!window.St || !St.PageFlip) {             // library guard
      counterEl.textContent = 'page-flip failed to load';
      return;
    }
    // Init on the next frame so the now-visible container has real dimensions.
    requestAnimationFrame(() => {
      pageFlip = new St.PageFlip(el, {
        width: 440,
        height: 550,            // 4:5 single page
        size: 'stretch',
        minWidth: 280,
        maxWidth: 560,
        minHeight: 350,
        maxHeight: 700,
        drawShadow: true,
        maxShadowOpacity: 0.5,
        showCover: false,
        usePortrait: true,      // single page on narrow screens
        mobileScrollSupport: false,
        flippingTime: 700,
      });

      pageFlip.loadFromImages(cfg.pages);
      pageFlip.on('flip', updateMeta);
      pageFlip.on('init', updateMeta);
      updateMeta();
    });
  }

  prevBtn.addEventListener('click', () => pageFlip && pageFlip.flipPrev());
  nextBtn.addEventListener('click', () => pageFlip && pageFlip.flipNext());

  // keyboard arrows (only act while book view is visible)
  document.addEventListener('keydown', e => {
    if (!document.body.classList.contains('is-book') || !pageFlip) return;
    if (e.key === 'ArrowLeft') pageFlip.flipPrev();
    if (e.key === 'ArrowRight') pageFlip.flipNext();
  });

  return { ensure };
})();

/* ============================================================
   Case Study — "Mindful Spending" by Tori Webb
   Screens rebuilt in HTML/CSS to match the source Figma file,
   plus a live, clickable prototype of the full logging flow:
   Home → Add Purchase → Want/Need → Reflect → Added → History.
   ============================================================ */
const CaseStudy = (function () {
  let done = false;

  // stacked red/green/blue bowl logo
  const LOGO = `<svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="15" r="4.2" fill="#E0533C"/>
    <path d="M16 23 a8 5 0 0 0 16 0 z" fill="#3E9E7E"/>
    <path d="M10.5 30 a13.5 11 0 0 0 27 0 z" fill="#3D7FC2"/>
  </svg>`;

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
              <div class="proto-input ap-input--select" style="color:#9a9a9a">Select…</div>
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

    // hero cluster — left, center(front), right
    document.getElementById('heroPhones').innerHTML =
      phone({ title: 'Add Purchase', body: addPurchase, fab: 'next' }) +
      phone({ title: 'Mindful Spending', body: home, fab: 'none', dark: true }) +
      phone({ title: 'Budget Plan', body: budgetPlan, fab: 'prev' });

    // gallery
    const figs = [
      ['Mindful Spending', 'Dark home — five colour-coded paths', home, 'none', true],
      ['Add Purchase', 'Friction-light capture form', addPurchase, 'next', false],
      ['Add Purchase', 'The want vs. need decision', wantNeed, 'prev', false],
      ['Spending History', 'Chronological transaction feed', spendingHistory, 'none', false],
      ['Category Breakdown', 'Where the money actually goes', categoryBreakdown, 'none', false],
      ['Budget Plan', 'Over/under tracker at a glance', budgetPlan, 'prev', false],
    ];
    document.getElementById('screenGallery').innerHTML = figs.map(f =>
      `<figure class="ap-figure">${phone({ title: f[0], body: f[2], fab: f[3], dark: f[4] })}<figcaption><b>${f[0]}</b>${f[1]}</figcaption></figure>`
    ).join('');

    // design-system phone
    document.getElementById('systemPhone').innerHTML =
      phone({ title: 'Category Breakdown', body: categoryBreakdown, fab: 'none' });

    buildProto();
  }

  return { ensure };
})();

/* ============================================================
   Home — typewriter intro + sizzle reel + marquee
   ============================================================ */
const Home = (function () {
  let done = false;

  const REEL = [
    { img: 'Assets/Spotlight-02-IG.png', title: 'Design Spotlight', cat: 'Social · Editorial' },
    { img: 'Assets/Spotlight-05-IG.png', title: 'Made With Love', cat: 'Publication · Exhibition' },
    { img: 'Assets/Spotlight-03-IG.png', title: 'Reviewed', cat: 'Event Design · CGDC' },
    { img: 'Assets/Spotlight-06-IG.png', title: "It's Cold Here in Rogers Park", cat: 'Photography · Zine' },
    { img: 'Assets/Spotlight-07-IG.png', title: 'Bold Marks', cat: 'Branding · Identity' },
  ];
  const pad = n => String(n).padStart(2, '0');

  function buildReel() {
    const reel = document.getElementById('reel');
    reel.innerHTML =
      REEL.map((p, i) => `<div class="reel__slide${i === 0 ? ' on' : ''}" style="background-image:url('${p.img}')"></div>`).join('') +
      `<div class="reel__top"><span class="reel__rec">Showreel</span><span class="reel__count" id="reelCount">01 / ${pad(REEL.length)}</span></div>` +
      `<div class="reel__cap in"><div class="reel__cat" id="reelCat">${REEL[0].cat}</div><div class="reel__title" id="reelTitle">${REEL[0].title}</div></div>` +
      `<div class="reel__bar"><i></i></div>`;
    const slides = [...reel.querySelectorAll('.reel__slide')];
    const cap = reel.querySelector('.reel__cap');
    const count = reel.querySelector('#reelCount');
    const catEl = reel.querySelector('#reelCat');
    const titleEl = reel.querySelector('#reelTitle');
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('on');
      count.textContent = pad(i + 1) + ' / ' + pad(REEL.length);
      catEl.textContent = REEL[i].cat;
      titleEl.textContent = REEL[i].title;
      cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in');
    }, 2400);
  }

  function buildMarquee() {
    const m = document.getElementById('homeMarquee');
    const imgs = REEL.concat(REEL).map(p => `<img src="${p.img}" alt="" />`).join('');
    m.innerHTML = `<div class="home-marquee__track">${imgs}</div>`;
  }

  function typeIntro() {
    const lines = {
      l1: document.getElementById('htl1'),
      l2: document.getElementById('htl2'),
      l3: document.getElementById('htl3'),
    };
    const caret = document.createElement('span');
    caret.className = 'ht-caret';
    const ops = [
      { el: 'l1', text: "hi, i'm tori." },
      { el: 'l2', text: "i'm a designer." },
      { el: 'l3', text: 'you can ' },
      { el: 'l3', text: 'learn more about me', link: 'about' },
      { el: 'l3', text: ' here — and ' },
      { el: 'l3', text: 'see my work', link: 'projects' },
      { el: 'l3', text: ' here.' },
    ];
    let oi = 0;
    function nextOp() {
      if (oi >= ops.length) return;   // leave caret blinking at the end
      const op = ops[oi++];
      const line = lines[op.el];
      line.appendChild(caret);        // move caret into the active line
      const node = op.link
        ? Object.assign(document.createElement('a'), { className: 'ht-link' })
        : document.createElement('span');
      if (op.link) node.dataset.view = op.link;
      line.insertBefore(node, caret);
      let ci = 0;
      (function typeChar() {
        node.textContent = op.text.slice(0, ++ci);
        if (ci < op.text.length) {
          setTimeout(typeChar, 30 + Math.random() * 34);
        } else {
          const gap = (ops[oi] && ops[oi].el !== op.el) ? 280 : 55;
          setTimeout(nextOp, gap);
        }
      })();
    }
    nextOp();
  }

  function ensure() {
    if (done) return;
    done = true;
    buildReel();
    typeIntro();
  }

  return { ensure };
})();

/* ---- boot: land on the homepage ---- */
Nav.activate('home');
