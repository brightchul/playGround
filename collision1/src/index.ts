import { Canvas } from "./canvas";
import { Circle, gridMap } from "./circle";
import { generateRandomValues, isOutofCanvas } from "./util";

const WIDTH = 2000;
const HEIGHT = 1000;
const circleCount = 7000;
const FFF = 16777215;
const GRID_VALUE = 200;
const CANVAS_BACKGROUND_COLOR = "#eee";
const RADIUS_MIN = 1;
const RADIUS_MAX = 3;

const canvasManager = new Canvas({
  element: document.getElementById("container")!,
  height: HEIGHT,
  width: WIDTH,
  posX: 0,
  posY: 0,
  bgColor: CANVAS_BACKGROUND_COLOR,
});

const V_MIN = 1;
const V_VARIABLE = 5;

function initCirclePlace() {
  let tempList = [];

  settingLoop: for (let i = 0; i < circleCount; ) {
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

    const circle1 = new Circle({ x, y, r, v, ang, color });

    const idx = ((x - r) / GRID_VALUE) | 0;
    const idx2 = ((x + r) / GRID_VALUE) | 0;

    for (let j = idx; j <= idx2; j++) {
      if (
        tempList[j] &&
        tempList[j].some((one) => circle1.isCollision(x, y, r, one))
      ) {
        continue settingLoop;
      }
      if (!tempList[j]) {
        tempList[j] = [circle1];
      } else {
        tempList[j].push(circle1);
      }
    }

    canvasManager.renderCircle(circle1.info);

    i++;
  }

  const circleList = tempList.flat();

  return circleList;
}

const circleList = initCirclePlace();

function run() {
  canvasManager.clear();

  const len = circleList.length;

  for (let i = 0; i < len; i++) {
    circleList[i].check();
  }
  gridMap.clear();
  for (let i = 0; i < len; i++) {
    circleList[i].move();
  }

  for (let i = 0; i < len; i++) {
    canvasManager.renderCircle(circleList[i].info);
  }

  requestAnimationFrame(run);
}

run();
