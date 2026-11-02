const cultureFilters = document.querySelectorAll("[data-culture-filter]");
const cultureStories = document.querySelectorAll("[data-culture-category]");
const cultureEmpty = document.querySelector(".culture-empty");

cultureFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.cultureFilter;
    let visibleCount = 0;

    cultureFilters.forEach((filterButton) => {
      const active = filterButton === button;
      filterButton.classList.toggle("is-active", active);
      filterButton.setAttribute("aria-pressed", String(active));
    });

    cultureStories.forEach((story) => {
      const visible = selected === "all" || story.dataset.cultureCategory === selected;
      story.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (cultureEmpty) cultureEmpty.hidden = visibleCount > 0;
  });
});
