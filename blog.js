(() => {
  const page = document.querySelector('.blog-page');
  if (!page) return;

  const heroImage = page.querySelector('.blog-sketch-visual img');
  if (heroImage) {
    heroImage.addEventListener('error', () => {
      heroImage.hidden = true;
    });
  }

  const clock = page.querySelector('[data-blog-clock]');
  if (clock) {
    const hourHand = clock.querySelector('[data-blog-hour]');
    const minuteHand = clock.querySelector('[data-blog-minute]');
    const secondHand = clock.querySelector('[data-blog-second]');
    const locationText = clock.querySelector('[data-blog-clock-location]');
    const timeText = clock.querySelector('[data-blog-clock-text]');
    const amText = clock.querySelector('[data-blog-clock-am]');
    const pmText = clock.querySelector('[data-blog-clock-pm]');

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your place';
    const placeName = timeZone.split('/').pop().replace(/_/g, ' ');
    if (locationText) locationText.textContent = placeName;

    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;
      const period = now.getHours() >= 12 ? 'pm' : 'am';

      secondHand?.style.setProperty('--clock-angle', `${seconds * 6}deg`);
      minuteHand?.style.setProperty('--clock-angle', `${(minutes * 6) + (seconds * .1)}deg`);
      hourHand?.style.setProperty('--clock-angle', `${(hours * 30) + (minutes * .5)}deg`);
      if (timeText) {
        const hour12 = now.getHours() % 12 || 12;
        timeText.textContent = `${hour12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      amText?.classList.toggle('is-crossed', period !== 'am');
      pmText?.classList.toggle('is-crossed', period !== 'pm');
      clock.setAttribute('aria-label', `Current time ${now.toLocaleTimeString()}`);
    };

    updateClock();
    setInterval(updateClock, 1000);
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
