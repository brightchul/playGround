import { Canvas } from "./canvas";
import { CircleManager, gridMap } from "./circle";

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

const circleManager = new CircleManager({
  circleCount,
  WIDTH,
  HEIGHT,
  V_VARIABLE,
  V_MIN,
  FFF,
  RADIUS_MAX,
  RADIUS_MIN,
  GRID_VALUE,
});

const circleList = circleManager.initCirclePlace();

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
