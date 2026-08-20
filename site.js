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
