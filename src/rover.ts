export {};

interface Command {
  commandName: string;
  execute(): void;
}

interface Direction {
  heading: string;
  dx: number;
  dy: number;
}

class ForwardCommand implements Command {
  commandName: string = "Forward";

  execute(): void {
    const currentDirection: Direction = directions[direction];

    x = Math.max(0, Math.min(4, x + currentDirection.dx));
    y = Math.max(0, Math.min(4, y + currentDirection.dy));

    drawRover();
  }
}

class TurnRightCommand implements Command {
  commandName: string = "Right";

  execute(): void {
    direction = (direction + 1) % 4;
    drawRover();
  }
}

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

const directions: Direction[] = [
  { heading: "North", dx: 0, dy: -1 },
  { heading: "East", dx: 1, dy: 0 },
  { heading: "South", dx: 0, dy: 1 },
  { heading: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let direction = 0;
let commandQueue: Command[] = [];

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].heading
  }`;
}

function updateQueueStatus() {
  if (commandQueue.length === 0) {
    queueStatus.textContent = "Empty";
    return;
  }

  queueStatus.textContent = "";

  commandQueue.forEach((command) => {
    if (queueStatus.textContent != "") queueStatus.textContent += " -> ";
    queueStatus.textContent += command.commandName;
  });
}

function clearQueue() {
  commandQueue = [];
  updateQueueStatus();
}

const forwardCommand: Command = new ForwardCommand();
const turnCommand: Command = new TurnRightCommand();

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  commandQueue.push(forwardCommand);
  updateQueueStatus();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  commandQueue.push(turnCommand);
  updateQueueStatus();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();

  clearQueue();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  commandQueue.forEach((command) => {
    command.execute();
  });

  clearQueue();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  clearQueue();
};

drawRover();
