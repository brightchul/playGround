const ANGLE_ARR = Array.from(Array.from({ length: 360 }, (v, i) => i));
const RADIAN_ARR = ANGLE_ARR.map((o) => (o / 180) * Math.PI);
const SIN_ARR = RADIAN_ARR.map((o) => Math.sin(o));
const COS_ARR = RADIAN_ARR.map((o) => Math.cos(o));

let tempMap: Map<string, Circle[]> | null = null;
let gridMap: Map<string, Circle[]> = new Map();

let height = 500;
let width = 700;
let gridValue = 200;

const NONE = "none";
const X_AXIS = "x-axis";
const Y_AXIS = "y-axis";

onmessage = (event) => {
  const nextCircleList = run(event.data);
  postMessage(nextCircleList);
};

function run(circleList: CircleList) {
  const nextCircleList = circleList.map((circle) => {
    const nextPositionInfo: NextPosition = getNextPositionInfo(circle);
    const checkResult = checkNextPosition(nextPositionInfo, circle);

    if (checkResult === "x-axis") reflectXAxis(circle);
    else if (checkResult === "y-axis") reflectYAxis(circle);

    move(circle);
    setGridMap(circle);
    return circle;
  });
  changeGridMap();

  return nextCircleList;
}

function changeGridMap() {
  gridMap.clear();
  if (tempMap) {
    gridMap = tempMap;
    tempMap = null;
  }
}

function setGridMap(circle: Circle) {
  if (tempMap === null) tempMap = new Map();

  const gridLeftX = ((circle.x - circle.r) / gridValue) | 0;
  const gridRightX = ((circle.x + circle.r) / gridValue) | 0;
  const gridLowY = ((circle.y - circle.r) / gridValue) | 0;
  const gridHighY = ((circle.y + circle.r) / gridValue) | 0;

  for (let currentX = gridLeftX; currentX <= gridRightX; currentX++) {
    for (let currentY = gridLowY; currentY <= gridHighY; currentY++) {
      const key = `${currentX}-${currentY}`;

      if (tempMap.has(key)) {
        tempMap.get(key)!.push(circle);
      } else {
        tempMap.set(key, [circle]);
      }
    }
  }
}

function move(circle: Circle) {
  const nextX = circle.x + circle.v * SIN_ARR[circle.ang];
  const nextY = circle.y + circle.v * COS_ARR[circle.ang];

  return Object.assign(circle, { x: nextX, y: nextY });
}

interface Circle {
  ang: number;
  color: string;
  x: number;
  y: number;
  v: number;
  r: number;
}

type CircleList = Circle[];

function getNextPositionInfo({ ang, x, y, v, r }: Circle) {
  const nextX = x + v * SIN_ARR[ang];
  const nextY = y + v * COS_ARR[ang];

  return {
    leftX: nextX - r,
    rightX: nextX + r,
    lowY: nextY - r,
    highY: nextY + r,
  };
}

interface NextPosition {
  leftX: number;
  rightX: number;
  lowY: number;
  highY: number;
}

function checkNextPosition(
  { leftX, rightX, lowY, highY }: NextPosition,
  circle: Circle
) {
  if (leftX <= 0 || rightX >= width) {
    return Y_AXIS;
  }
  if (lowY <= 0 || highY >= height) {
    return X_AXIS;
  }

  const gridLeftX = (leftX / gridValue) | 0;
  const gridRightX = (rightX / gridValue) | 0;
  const gridLowY = (lowY / gridValue) | 0;
  const gridHighY = (highY / gridValue) | 0;

  for (let currentX = gridLeftX; currentX <= gridRightX; currentX++) {
    for (let currentY = gridLowY; currentY <= gridHighY; currentY++) {
      const grid = gridMap.get(`${currentX}-${currentY}`);

      if (!grid) continue;

      for (let k = 0; k < grid.length; k++) {
        if (isEqual(grid[k], circle)) continue;
        if (isCollision(grid[k], circle)) {
          return Y_AXIS;
        }
      }
    }
  }

  return NONE;
}

function isEqual(circle1: Circle, circle2: Circle) {
  return (
    circle1.x === circle2.x &&
    circle1.y === circle2.y &&
    circle1.r === circle2.r
  );
}

function reflectXAxis(circle: Circle) {
  circle.ang = Math.abs(180 - circle.ang);
}
function reflectYAxis(circle: Circle) {
  circle.ang = Math.abs(360 - circle.ang);
}

function isCollision(circle1: Circle, circle2: Circle) {
  return (
    (circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2 <=
    (circle1.r + circle2.r) ** 2
  );
}
