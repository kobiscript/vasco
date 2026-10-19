(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.futsal-scroll-progress');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateProgress = () => {
    if (!progress) return;
    const distance = root.scrollHeight - window.innerHeight;
    const value = distance > 0 ? Math.min(window.scrollY / distance, 1) : 0;
    progress.style.transform = `scaleX(${value})`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const mediaTrack = document.querySelector('[data-futsal-track]');
  const mediaCards = mediaTrack ? Array.from(mediaTrack.querySelectorAll('.futsal-media-card')) : [];
  const previousButton = document.querySelector('[data-futsal-prev]');
  const nextButton = document.querySelector('[data-futsal-next]');
  const currentLabel = document.querySelector('[data-futsal-current]');
  const totalLabel = document.querySelector('[data-futsal-total]');
  const mediaProgress = document.querySelector('[data-futsal-progress]');
  let currentMedia = 0;
  let mediaFrame = 0;

  const updateMediaControls = (index) => {
    if (!mediaCards.length) return;
    currentMedia = Math.max(0, Math.min(index, mediaCards.length - 1));
    if (currentLabel) currentLabel.textContent = String(currentMedia + 1).padStart(2, '0');
    if (totalLabel) totalLabel.textContent = String(mediaCards.length).padStart(2, '0');
    if (mediaProgress) mediaProgress.style.transform = `translateX(${currentMedia * 100}%)`;
    if (previousButton) {
      previousButton.disabled = currentMedia === 0;
      previousButton.setAttribute('aria-disabled', String(currentMedia === 0));
    }
    if (nextButton) {
      nextButton.disabled = currentMedia === mediaCards.length - 1;
      nextButton.setAttribute('aria-disabled', String(currentMedia === mediaCards.length - 1));
    }
  };

  const moveToMedia = (index) => {
    const target = mediaCards[Math.max(0, Math.min(index, mediaCards.length - 1))];
    if (!target || !mediaTrack) return;
    mediaTrack.scrollTo({ left: target.offsetLeft - mediaTrack.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  if (mediaTrack && mediaCards.length) {
    updateMediaControls(0);
    previousButton?.addEventListener('click', () => moveToMedia(currentMedia - 1));
    nextButton?.addEventListener('click', () => moveToMedia(currentMedia + 1));
    mediaTrack.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveToMedia(currentMedia + (event.key === 'ArrowRight' ? 1 : -1));
    });
    mediaTrack.addEventListener('scroll', () => {
      cancelAnimationFrame(mediaFrame);
      mediaFrame = requestAnimationFrame(() => {
        const left = mediaTrack.scrollLeft;
        let closest = 0;
        let distance = Number.POSITIVE_INFINITY;
        mediaCards.forEach((card, index) => {
          const nextDistance = Math.abs(card.offsetLeft - mediaTrack.offsetLeft - left);
          if (nextDistance >= distance) return;
          distance = nextDistance;
          closest = index;
        });
        updateMediaControls(closest);
      });
    }, { passive: true });
    mediaTrack.querySelectorAll('video').forEach((video) => {
      video.addEventListener('play', () => {
        mediaTrack.querySelectorAll('video').forEach((otherVideo) => {
          if (otherVideo !== video) otherVideo.pause();
        });
      });
    });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  root.classList.add('futsal-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  document.querySelectorAll('.futsal-reveal').forEach((item) => observer.observe(item));
})();
