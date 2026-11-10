const form = document.querySelector("#player-intake-form");
const status = document.querySelector("#intake-status");
const downloadButton = document.querySelector("#download-intake");
const printButton = document.querySelector("#print-intake");

function responseText() {
  const data = new FormData(form);
  const grouped = new Map();

  for (const [key, value] of data.entries()) {
    const clean = String(value).trim();
    if (!clean) continue;
    const existing = grouped.get(key) || [];
    existing.push(clean);
    grouped.set(key, existing);
  }

  const player = grouped.get("Player full name")?.[0] || "Player";
  const lines = [
    "VASCO DA LOR",
    "PERSONAL TRAINING PLAYER INTAKE AND DEVELOPMENT PROFILE",
    "",
    `Player: ${player}`,
    `Prepared: ${new Date().toLocaleDateString()}`,
    "",
  ];

  grouped.forEach((values, key) => {
    lines.push(`${key}: ${values.join(", ")}`);
  });

  lines.push("", "Submitted by the family through vdltraining.com/intake/.");
  return { player, text: lines.join("\n") };
}

function validateForm() {
  if (form.checkValidity()) return true;
  form.reportValidity();
  status.textContent = "Please complete every required field before sending the intake.";
  return false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const { player, text } = responseText();
  const subject = `Vasco Da Lor personal training intake - ${player}`;
  const mailto = `mailto:Roger@vascodalor.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  status.textContent = "Your email application is opening. Review the completed response and press Send.";
  window.location.href = mailto;
});

downloadButton.addEventListener("click", () => {
  if (!validateForm()) return;
  const { player, text } = responseText();
  const safePlayer = player.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "player";
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `vasco-intake-${safePlayer}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  status.textContent = "A copy of the completed intake was downloaded to this device.";
});

printButton.addEventListener("click", () => {
  if (!validateForm()) return;
  status.textContent = "The print window is opening. Choose Save as PDF to keep a digital copy.";
  window.print();
});
