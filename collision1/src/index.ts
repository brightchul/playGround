import { Circle, gridMap } from "./circle";
import { generateRandomValues, isOutofCanvas } from "./util";

const WIDTH = 2000;
const HEIGHT = 1000;
const circleCount = 7000;
const FFF = 16777215;
const GRID_VALUE = 200;
const POS_X = 0;
const POS_Y = 0;
const CANVAS_BACKGROUND_COLOR = "#eee";
const RADIUS_MIN = 1;
const RADIUS_MAX = 3;

function makeCanvas() {
  let canvas = document.getElementById("canvas1")! as HTMLCanvasElement;
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
  ctx.fillRect(POS_X, POS_Y, WIDTH, HEIGHT);
  return { canvas, ctx };
}

const { ctx } = makeCanvas();

const V_MIN = 1;
const V_VARIABLE = 5;

function initCirclePlace() {
  let tempList = [];

  setting: for (let i = 0; i < circleCount; ) {
    const { x, y, v, ang, color, r } = generateRandomValues(
      WIDTH,
      HEIGHT,
      V_VARIABLE,
      V_MIN,
      FFF,
      RADIUS_MAX,
      RADIUS_MIN
    );

    if (isOutofCanvas(x, y, r, WIDTH, HEIGHT)) {
      continue;
    }

    const circle1 = new Circle({ x, y, r, v, ang, color, ctx });

    const idx = ((x - r) / GRID_VALUE) | 0;
    const idx2 = ((x + r) / GRID_VALUE) | 0;

    for (let j = idx; j <= idx2; j++) {
      if (
        tempList[j] &&
        tempList[j].some((one) => circle1.isCollision(x, y, r, one))
      ) {
        continue setting;
      }
      if (!tempList[j]) {
        tempList[j] = [circle1];
      } else {
        tempList[j].push(circle1);
      }
    }

    circle1.render();
    i++;
  }

  const circleList = tempList.flat();
  // const circleList = [...tempList];

  return circleList;
}

const circleList = initCirclePlace();

function run() {
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
  ctx.fillRect(POS_X, POS_Y, WIDTH, HEIGHT);

  const len = circleList.length;

  for (let i = 0; i < len; i++) {
    circleList[i].check();
  }
  gridMap.clear();
  for (let i = 0; i < len; i++) {
    circleList[i].move();
  }

  for (let i = 0; i < len; i++) {
    circleList[i].render();
  }

  requestAnimationFrame(run);
}

run();
