
// Year & theme toggle
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved === 'light') root.classList.add('light');
const btn = document.getElementById('themeToggle');
if (btn) {
  btn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}


// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// Close menu when a link is clicked (mobile)
siteNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});


// First-load animation toggle
window.addEventListener('DOMContentLoaded', () => {
  // small delay helps fonts load before animating
  setTimeout(() => document.documentElement.classList.add('page-loaded'), 60);
});

// Scroll-reveal for elements with .reveal
(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();



// First-load toggle so the .will-animate / stagger play once
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.documentElement.classList.add('page-loaded'), 60);
});

// Scroll-reveal for elements with .reveal
(function () {
  const nodes = document.querySelectorAll('.reveal');
  if (!nodes.length) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    nodes.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach(el => io.observe(el));
})();

// Make tiles tappable on touch devices (toggle open)
(function () {
  const tiles = document.querySelectorAll('.reveal-card');
  if (!tiles.length) return;

  const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
  tiles.forEach(t => {
    // Keyboard: Enter/Space toggles
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        t.classList.toggle('open');
      }
    });
    // Touch/click: only toggle on touch‑centric devices
    if (isTouch) {
      t.addEventListener('click', (e) => {
        // Don’t close immediately when clicking links inside
        if (e.target.closest('a')) return;
        t.classList.toggle('open');
      });
    }
  });
})();


// Only one collapsible open at a time
(() => {
  const cards = document.querySelectorAll('.a-card');
  cards.forEach(card => {
    card.addEventListener('toggle', () => {
      if (card.open) {
        cards.forEach(other => { if (other !== card) other.open = false; });
      }
    });
  });
})();


// Blog "news" ticker: cycles items, pauses on hover/touch
(() => {
  const list = document.querySelector('.news-card .ticker-list');
  if (!list) return;
  const items = Array.from(list.children);
  if (items.length < 2) return;

  let i = 0, paused = false;
  const area = document.querySelector('.news-card .ticker');

  // start state
  items.forEach((li, idx) => li.classList.toggle('active', idx === 0));

  const step = () => {
    if (paused) return;
    items[i].classList.remove('active');
    i = (i + 1) % items.length;
    items[i].classList.add('active');
  };

  // cycle every 3 seconds
  const id = setInterval(step, 3000);

  // pause on hover / focus within
  ['mouseenter','focusin','touchstart'].forEach(ev => area.addEventListener(ev, () => { paused = true; }, {passive:true}));
  ['mouseleave','focusout','touchend','touchcancel'].forEach(ev => area.addEventListener(ev, () => { paused = false; }, {passive:true}));
})();


// ===== Auto-populate Highlights ticker from blog.html =====
(async () => {
  const listEl = document.getElementById('blogTicker');
  if (!listEl) return;

  const makeItem = (title, anchor, active = false) =>
    `<li${active ? ' class="active"' : ''}><a class="inline" href="blog.html${anchor}">${title}</a></li>`;

  try {
    const res = await fetch('blog.html', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to fetch blog.html');
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Try several sensible structures:
    // 1) <article id="..."> with inner <h1|h2|h3|.post-title>
    // 2) Headings with their own ids: <h2 id="...">Title</h2>
    // 3) Any element with id starting "post-" where its text is the title
    let posts = [];

    // Preferred: articles with IDs
    doc.querySelectorAll('article[id]').forEach(art => {
      const titleEl = art.querySelector('h1, h2, h3, .post-title');
      const title = titleEl?.textContent?.trim();
      const id = art.id;
      const date = art.getAttribute('data-date'); // optional ISO date, e.g. 2025-08-10
      if (title && id) posts.push({ title, anchor: `#${id}`, date });
    });

    // Fallback: headings with IDs
    if (posts.length === 0) {
      doc.querySelectorAll('h2[id], h3[id]').forEach(h => {
        const title = h.textContent?.trim();
        const id = h.id;
        const date = h.getAttribute('data-date');
        if (title && id) posts.push({ title, anchor: `#${id}`, date });
      });
    }

    // Fallback: any element whose id starts with "post-"
    if (posts.length === 0) {
      doc.querySelectorAll('[id^="post-"]').forEach(el => {
        const title = el.textContent?.trim();
        const id = el.id;
        const date = el.getAttribute('data-date');
        if (title && id) posts.push({ title, anchor: `#${id}`, date });
      });
    }

    // Sort by date if provided, else keep document order (newest usually at top of blog)
    if (posts.some(p => p.date)) {
      posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }

    // Limit how many we show
    posts = posts.slice(0, 6);

    // Render
    if (posts.length) {
      listEl.innerHTML = posts.map((p, i) => makeItem(p.title, p.anchor, i === 0)).join('');
    } else {
      listEl.innerHTML = `<li class="active">Add posts to your blog to populate Highlights</li>`;
    }
  } catch (err) {
    listEl.innerHTML = `<li class="active">Couldn’t load blog posts</li>`;
    // console.warn(err);
  }
})();

/* ========= Visitor counter =========
   Uses CountAPI (free, no-signup). It increments a key and returns total.
   If the request fails (offline/adblock), falls back to a local number. */
async function initVisitorCounter() {
  const el = document.getElementById('visitorCount');
  if (!el) return;

  const endpoint = 'https://api.countapi.xyz/hit/lakshan.info/homepage'; 
  // You can change namespace/key: /hit/{namespace}/{key}

  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    const data = await res.json();
    const total = typeof data.value === 'number' ? data.value : 0;
    animateCount(el, total, 2500); // ~2.5s
  } catch (e) {
    // Fallback: persist a local pseudo-count so animation still works
    const localKey = 'visitor_local_fallback';
    const current = parseInt(localStorage.getItem(localKey) || '0', 10) + 1;
    localStorage.setItem(localKey, String(current));
    animateCount(el, current, 2000);
  }
}

// Smooth number count animation
function animateCount(node, to, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  const easeOutQuad = t => t * (2 - t);

  function frame(now) {
    const p = Math.min(1, (now - startTime) / duration);
    const eased = easeOutQuad(p);
    const value = Math.floor(start + (to - start) * eased);
    node.textContent = value.toLocaleString();
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- News ticker: hold -> slide -> hold ---
function startTicker(ul, opts = {}) {
  const rows = Array.from(ul.children);
  if (rows.length <= 1) return;

  const hold = opts.hold ?? 2600;     // how long to stay on each item (ms)
  const slide = opts.slide ?? 600;    // slide animation duration (ms)
  const easing = opts.easing ?? 'ease';

  // Ensure one-line viewport for smooth slides
  const firstHeight = rows[0].getBoundingClientRect().height || 24;
  const viewport = ul.parentElement; // .news-ticker
  viewport.style.height = firstHeight + 'px';
  viewport.style.overflow = 'hidden';

  // Prepare UL for sliding
  ul.style.willChange = 'transform, opacity';
  ul.style.transition = `transform ${slide}ms ${easing}`;
  let idx = 0;

  function step() {
    idx = (idx + 1) % rows.length;
    const h = rows[0].getBoundingClientRect().height || firstHeight;

    // slide to the next row
    ul.style.transform = `translateY(-${idx * h}px)`;

    // after the slide completes, wait 'hold' ms then move again
    setTimeout(step, hold + slide);
  }

  // initial pause before first move
  setTimeout(step, hold);
}
