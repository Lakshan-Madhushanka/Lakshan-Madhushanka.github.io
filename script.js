
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
