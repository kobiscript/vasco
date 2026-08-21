document.querySelectorAll("video").forEach((video) => {
  const wrap = video.closest(".film-player, .video-wrap");

  video.addEventListener("loadedmetadata", () => {
    const previewTime = Number(video.dataset.previewTime || 0);
    if (previewTime > 0 && video.currentTime === 0 && previewTime < video.duration) {
      video.currentTime = previewTime;
    }
  }, { once: true });

  video.addEventListener("loadeddata", () => {
    wrap?.classList.remove("has-error");
  });

  video.addEventListener("error", () => {
    wrap?.classList.add("has-error");
  });

  video.load();
});

const progressionSection = document.querySelector(".progression-section");
const progressionFilters = document.querySelectorAll(".progress-filter [data-filter]");
const progressionCards = document.querySelectorAll(".progress-film-card[data-category]");

progressionFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    progressionFilters.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    progressionSection?.classList.toggle("is-filtered", selected !== "all");
    progressionCards.forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
    });
  });
});

const seasonTabs = document.querySelectorAll(".season-tabs [data-season]");
const seasonPanels = document.querySelectorAll(".season-panel[data-season-panel]");

seasonTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedSeason = tab.dataset.season;

    seasonTabs.forEach((seasonTab) => {
      const isActive = seasonTab === tab;
      seasonTab.classList.toggle("active", isActive);
      seasonTab.setAttribute("aria-selected", String(isActive));
    });

    seasonPanels.forEach((panel) => {
      panel.hidden = panel.dataset.seasonPanel !== selectedSeason;
    });
  });
});
