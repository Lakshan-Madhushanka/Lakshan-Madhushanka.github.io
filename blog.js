(() => {
  const page = document.querySelector('.blog-page');
  if (!page) return;

  const heroImage = page.querySelector('.blog-sketch-visual img');
  if (heroImage) {
    heroImage.addEventListener('error', () => {
      heroImage.hidden = true;
    });
  }

  const categoryButtons = Array.from(page.querySelectorAll('.blog-category-chip'));
  const cards = Array.from(page.querySelectorAll('.blog-note-card'));
  if (!categoryButtons.length || !cards.length) return;

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';

      categoryButtons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');

      cards.forEach((card) => {
        const isVisible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !isVisible);
      });
    });
  });
})();
