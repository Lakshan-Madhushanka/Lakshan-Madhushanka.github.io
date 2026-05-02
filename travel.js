(() => {
  const page = document.querySelector('.journey-page');
  if (!page) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    page.classList.add('journey-reduced-motion');
  }

  const tableSurface = page.querySelector('.journey-table-surface');
  if (tableSurface) {
    const tableImage = new Image();
    tableImage.onload = () => tableSurface.classList.remove('table-missing');
    tableImage.onerror = () => tableSurface.classList.add('table-missing');
    tableImage.src = 'assets/hero/journey-table.jpg';
  }

  const memoryStage = page.querySelector('.journey-memory-stage');
  if (memoryStage) {
    const photoPaths = [
      'assets/journey/journey-1.jpg',
      'assets/journey/journey-2.jpg',
      'assets/journey/journey-3.jpg',
      'assets/journey/journey-4.jpg',
      'assets/journey/journey-5.jpg',
      'assets/journey/journey-6.jpg'
    ];

    const memoryPhotos = Array.from({ length: 24 }, (_, index) => {
      const figure = document.createElement('figure');
      figure.className = `journey-memory-photo drop-${index + 1}`;

      const image = document.createElement('img');
      image.className = 'journey-photo-img';
      image.src = photoPaths[index % photoPaths.length];
      image.alt = '';

      figure.appendChild(image);
      return figure;
    });

    memoryStage.querySelectorAll('.journey-memory-photo').forEach((photo) => photo.remove());
    memoryStage.append(...memoryPhotos);
  }

  const images = Array.from(page.querySelectorAll('.journey-photo-img'));
  images.forEach((image) => {
    image.addEventListener('error', () => {
      const holder = image.closest('.journey-memory-photo, .journey-card-photo, .journey-photo-card');
      if (!holder) return;
      holder.classList.add('photo-missing');
      image.hidden = true;
    });
  });
})();
