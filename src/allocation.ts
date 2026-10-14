export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let numOfProducers = 2;

function update() {
  const productionLevel = numOfProducers * 3;
  const consumption = 6;
  const balance = productionLevel - consumption;

  updateGraph(productionLevel, consumption, balance);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  numOfProducers = Math.max(0, numOfProducers - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  numOfProducers = Math.min(6, numOfProducers + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    numOfProducers = 2;
    update();
  };

update();

function updateGraph(
  productionLevel: number,
  consumption: number,
  balance: number,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < numOfProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < numOfProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${numOfProducers} / 6`, 18, 76);
  ctx.fillText(`Production: ${productionLevel}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, productionLevel * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
  readout.textContent =
    `Assigned: ${numOfProducers}/6 · Production: ${productionLevel} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}
