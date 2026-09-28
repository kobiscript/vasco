const form = document.querySelector("#group-enrollment-form");
const status = document.querySelector("#registration-status");
const downloadButton = document.querySelector("#download-registration");
const printButton = document.querySelector("#print-registration");

function selectedTrainingDays() {
  return [...form.querySelectorAll('input[name="Training days"]:checked')];
}

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
    "GROUP TRAINING ENROLLMENT",
    "",
    `Player: ${player}`,
    `Prepared: ${new Date().toLocaleDateString()}`,
    "",
  ];

  grouped.forEach((values, key) => {
    lines.push(`${key}: ${values.join(", ")}`);
  });

  lines.push("", "Submitted by the family through vdltraining.com/registration/.");
  return { player, text: lines.join("\n") };
}

function validateForm() {
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = "Please complete every required field before sending the enrollment.";
    return false;
  }

  const trainingDays = selectedTrainingDays();
  if (trainingDays.length < 2) {
    trainingDays[0]?.focus();
    form.querySelector(".training-day-choice")?.scrollIntoView({ behavior: "smooth", block: "center" });
    status.textContent = "Please select at least two weekly training days.";
    return false;
  }

  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const { player, text } = responseText();
  const subject = `Vasco Da Lor group training enrollment - ${player}`;
  const mailto = `mailto:support@VDLTraining.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  status.textContent = "Your email application is opening. Review the completed enrollment and press Send.";
  window.location.href = mailto;
});

downloadButton.addEventListener("click", () => {
  if (!validateForm()) return;
  const { player, text } = responseText();
  const safePlayer = player.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "player";
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `vasco-group-enrollment-${safePlayer}.txt`;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
  status.textContent = "A copy of the completed enrollment was downloaded to this device.";
});

printButton.addEventListener("click", () => {
  if (!validateForm()) return;
  status.textContent = "The print window is opening. Choose Save as PDF to keep a digital copy.";
  window.print();
});
