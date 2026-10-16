export {};

interface Shield {
  charge: number;
  capacity: number;
  missingCharge: number;
}

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

const shieldEvents = new EventTarget();

function prepareShield(): Shield {
  const capacity = 10;

  const shield: Shield = {
    charge: count,
    capacity,
    missingCharge: capacity - count,
  };

  return shield;
}

function drawMeter(shield: Shield) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; i++) {
    ctx.fillStyle = i < shield.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.charge} / 10 shield`, 12, 100);
  readout.textContent = `Shield charge: ${shield.charge} / 10`;
}

function updateStats(shield: Shield) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(shield);
}

function renderStats(shield: Shield) {
  if (!panel) return;

  panel.textContent =
    `Shield charge: ${shield.charge} · Missing charge: ${shield.missingCharge}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;

  const shield = prepareShield();

  shieldEvents.dispatchEvent(
    new CustomEvent("shield-changed", { detail: shield }),
  );

  if (panel) updateStats(shield);
}

shieldEvents.addEventListener("shield-changed", (event) => {
  const shield = (event as CustomEvent<Shield>).detail;
  drawMeter(shield);
});

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(prepareShield());
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(prepareShield());
