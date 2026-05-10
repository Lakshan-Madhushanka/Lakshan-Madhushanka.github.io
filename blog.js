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
    const locationText = page.querySelector('[data-blog-clock-location]');
    const timeText = page.querySelector('[data-blog-clock-text]');
    const amText = page.querySelector('[data-blog-clock-am]');
    const pmText = page.querySelector('[data-blog-clock-pm]');

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

  const calendar = page.querySelector('[data-blog-calendar]');
  if (calendar) {
    const monthLabel = page.querySelector('[data-blog-calendar-month]');
    const yearLabel = page.querySelector('[data-blog-calendar-year]');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const monthName = new Intl.DateTimeFormat([], { month: 'long' }).format(today);
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (monthLabel) monthLabel.textContent = monthName;
    if (yearLabel) yearLabel.textContent = String(year);
    calendar.setAttribute('aria-label', `${monthName} ${year} calendar`);
    calendar.replaceChildren();

    dayNames.forEach((day) => {
      const item = document.createElement('span');
      item.className = 'blog-calendar-day';
      item.textContent = day;
      calendar.append(item);
    });

    for (let index = 0; index < firstDay; index += 1) {
      const empty = document.createElement('span');
      empty.className = 'blog-calendar-empty';
      empty.setAttribute('aria-hidden', 'true');
      calendar.append(empty);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const item = document.createElement('span');
      const number = document.createElement('span');
      number.className = 'blog-calendar-number';
      number.textContent = String(day);

      item.className = 'blog-calendar-date';
      item.append(number);
      if (day < today.getDate()) {
        item.classList.add('is-crossed-date');
      }
      if (day === today.getDate()) {
        item.classList.add('is-today');
        item.setAttribute('aria-current', 'date');
        item.setAttribute('aria-label', `Today, ${monthName} ${day}, ${year}`);
      }
      calendar.append(item);
    }
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
