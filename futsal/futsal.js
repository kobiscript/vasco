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
