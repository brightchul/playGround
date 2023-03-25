import { Canvas } from "./canvas";
import { CircleManager } from "./circle";

const FFF = 16777215;

const canvasManager = new Canvas({
  element: document.getElementById("container")!,
  height: 1000,
  width: 2000,
  posX: 0,
  posY: 0,
  bgColor: "#eee",
});

const circleManager = new CircleManager({
  circleCount: 7000,
  width: 2000,
  height: 1000,
  vVariable: 5,
  vMin: 1,
  maxColor: FFF,
  radiusMin: 1,
  radiusMax: 3,
  gridValue: 200,
});

function run() {
  canvasManager.clear();
  circleManager.moveCircles();

  circleManager.circleList.forEach((circle) =>
    canvasManager.renderCircle(circle.info)
  );

  requestAnimationFrame(run);
}

run();
