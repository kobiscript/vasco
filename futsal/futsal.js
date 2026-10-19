(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroVideo = document.querySelector('[data-af-hero-video]');
  const playButton = document.querySelector('[data-af-play]');
  const playIcon = document.querySelector('[data-af-play-icon]');

  if (heroVideo && playButton) {
    const updatePlayState = () => {
      const paused = heroVideo.paused;
      playButton.setAttribute('aria-label', paused ? 'Play opening Futsal video' : 'Pause opening Futsal video');
      if (playIcon) playIcon.textContent = paused ? '▶' : 'Ⅱ';
    };
    playButton.addEventListener('click', () => {
      if (heroVideo.paused) heroVideo.play().catch(() => {});
      else heroVideo.pause();
      updatePlayState();
    });
    heroVideo.addEventListener('play', updatePlayState);
    heroVideo.addEventListener('pause', updatePlayState);
    updatePlayState();
  }

  const galleryTrack = document.querySelector('[data-af-track]');
  const galleryCards = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.af-gallery-card')) : [];
  const previousButton = document.querySelector('[data-af-prev]');
  const nextButton = document.querySelector('[data-af-next]');
  const currentLabel = document.querySelector('[data-af-current]');
  const totalLabel = document.querySelector('[data-af-total]');
  const galleryProgress = document.querySelector('[data-af-progress]');
  let currentGallery = 0;
  let galleryFrame = 0;

  const updateGallery = (index) => {
    if (!galleryCards.length) return;
    currentGallery = Math.max(0, Math.min(index, galleryCards.length - 1));
    if (currentLabel) currentLabel.textContent = String(currentGallery + 1).padStart(2, '0');
    if (totalLabel) totalLabel.textContent = String(galleryCards.length).padStart(2, '0');
    if (galleryProgress) galleryProgress.style.transform = `translateX(${currentGallery * 100}%)`;
    if (previousButton) previousButton.disabled = currentGallery === 0;
    if (nextButton) nextButton.disabled = currentGallery === galleryCards.length - 1;
  };

  const moveToGallery = (index) => {
    const target = galleryCards[Math.max(0, Math.min(index, galleryCards.length - 1))];
    if (!target || !galleryTrack) return;
    galleryTrack.scrollTo({ left: target.offsetLeft - galleryTrack.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  if (galleryTrack && galleryCards.length) {
    updateGallery(0);
    previousButton?.addEventListener('click', () => moveToGallery(currentGallery - 1));
    nextButton?.addEventListener('click', () => moveToGallery(currentGallery + 1));
    galleryTrack.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveToGallery(currentGallery + (event.key === 'ArrowRight' ? 1 : -1));
    });
    galleryTrack.addEventListener('scroll', () => {
      cancelAnimationFrame(galleryFrame);
      galleryFrame = requestAnimationFrame(() => {
        const left = galleryTrack.scrollLeft;
        let closest = 0;
        let distance = Number.POSITIVE_INFINITY;
        galleryCards.forEach((card, index) => {
          const nextDistance = Math.abs(card.offsetLeft - galleryTrack.offsetLeft - left);
          if (nextDistance >= distance) return;
          distance = nextDistance;
          closest = index;
        });
        updateGallery(closest);
      });
    }, { passive: true });
    galleryTrack.querySelectorAll('video').forEach((video) => {
      video.addEventListener('play', () => {
        galleryTrack.querySelectorAll('video').forEach((otherVideo) => {
          if (otherVideo !== video) otherVideo.pause();
        });
      });
    });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) return;
  root.classList.add('af-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

  document.querySelectorAll('.af-reveal').forEach((item) => observer.observe(item));
})();
