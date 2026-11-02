(() => {
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('.culture-menu');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    menu.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  }

  const track = document.querySelector('[data-story-track]');
  const back = document.querySelector('[data-track-back]');
  const next = document.querySelector('[data-track-next]');
  const progress = document.querySelector('[data-track-progress]');

  const updateTrackProgress = () => {
    if (!track || !progress) return;
    const max = Math.max(1, track.scrollWidth - track.clientWidth);
    const ratio = Math.min(1, Math.max(0, track.scrollLeft / max));
    progress.style.transform = `translateX(${ratio * 195}%)`;
  };

  if (track && back && next) {
    const move = direction => {
      const card = track.querySelector('.lead-story');
      const distance = card ? card.getBoundingClientRect().width + 1 : track.clientWidth * .75;
      track.scrollBy({ left: direction * distance, behavior: 'smooth' });
    };
    back.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', updateTrackProgress, { passive: true });
    updateTrackProgress();
  }

  const filters = document.querySelectorAll('[data-filter]');
  const stories = document.querySelectorAll('.journal-story[data-category]');

  filters.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filters.forEach(item => item.classList.remove('active'));
      button.classList.add('active');

      stories.forEach(story => {
        const categories = story.dataset.category.split(' ');
        story.hidden = category !== 'all' && !categories.includes(category);
      });
    });
  });
})();
