(() => {
  const page = document.querySelector('.blog-page');
  if (!page) return;

  const categoryLinks = Array.from(page.querySelectorAll('.blog-category-pad a'));
  const cards = Array.from(page.querySelectorAll('.blog-note-card'));
  if (!categoryLinks.length || !cards.length) return;

  categoryLinks.forEach((link) => {
    link.addEventListener('click', () => {
      categoryLinks.forEach((item) => item.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });
})();
