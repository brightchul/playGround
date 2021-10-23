const WIDTH = 2000;
const HEIGHT = 1000;
const circleCount = 10000;
const FFF = 16777215;
const GRID_VALUE = 200;
const POS_X = 0;
const POS_Y = 0;
const CANVAS_BACKGROUND_COLOR = "#eee";
const RADIUS_MIN = 1;
const RADIUS_MAX = 3;

const config = {
  WIDTH: 1750,
  HEIGHT: 900,
  circleCount: 10000,
  FFF: 16777215,
  GRID_VALUE: 100,
  POS_X: 0,
  POS_Y: 0,
};

const gridMap = new Map();

class Circle {
  constructor({ x, y, r, v, ang, color, ctx }) {
    Object.assign(this, { x, y, r, v, ang, color, ctx });
  }
  render() {
    const { x, y, r, color, ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  check(circleList) {
    let tempX = this.x + this.v * Math.sin(this.ang);
    let tempY = this.y + this.v * Math.cos(this.ang);

    const { ang, r } = this;
    const tempXMinusR = tempX - r;
    const tempXPlusR = tempX + r;
    const tempYMinusR = tempY - r;
    const tempYPlusR = tempY + r;

    // 캔버스 경계 충돌 확인
    if (tempXMinusR <= 0 || tempXPlusR >= WIDTH) {
      return (this.ang = Math.PI * 2 - ang);
    }
    if (tempYMinusR <= 0 || tempYPlusR >= HEIGHT) {
      return (this.ang = Math.PI - ang);
    }
    const gridFlag = true;
    let collisionOne;

    if (gridFlag) {
      // 각 그리드 별로 충돌 확인 용
      const x1 = (tempXMinusR / GRID_VALUE) | 0;
      const x2 = (tempXPlusR / GRID_VALUE) | 0;
      const y1 = (tempYMinusR / GRID_VALUE) | 0;
      const y2 = (tempYPlusR / GRID_VALUE) | 0;

      loop1: for (let i = x1; i <= x2; i++) {
        for (let j = y1; j <= y2; j++) {
          const grid = gridMap.get(`${i}-${j}`);

          if (!grid) continue;

          for (let k = 0; k < grid.length; k++) {
            if (grid[k] === this) continue;
            if (this.isCollision(tempX, tempY, r, grid[k])) {
              collisionOne = grid[k];
              break loop1;
            }
          }
        }
      }
    } else {
      // 기존 코드
      const len = circleList.length;
      for (let i = 0; i < len; i++) {
        const circle = circleList[i];
        if (this === circle) continue;
        if (this.isCollision(this.x, this.y, this.r, circle)) {
          collisionOne = circle;
          break;
        }
      }
    }

    if (collisionOne) {
      return (this.ang = Math.PI * 2 - ang);
    }
  }
  move() {
    const x = this.x + this.v * Math.sin(this.ang);
    const y = this.y + this.v * Math.cos(this.ang);
    const r = this.r;

    this.x = x;
    this.y = y;

    const x_minus_r = ((x - r) / GRID_VALUE) | 0;
    const x_plus_r = ((x + r) / GRID_VALUE) | 0;
    const y_minus_r = ((y - r) / GRID_VALUE) | 0;
    const y_plus_r = ((y + r) / GRID_VALUE) | 0;

    for (let i = x_minus_r; i <= x_plus_r; i++) {
      for (let j = y_minus_r; j <= y_plus_r; j++) {
        const key = `${i}-${j}`;
        if (!gridMap.has(key)) gridMap.set(key, []);
        gridMap.get(key).push(this);
      }
    }
  }
  isCollision(x, y, r, other) {
    return (x - other.x) ** 2 + (y - other.y) ** 2 <= (r + other.r) ** 2;
  }
}

class Canvas {
  constructor(element, height, width, posX, posY, bgColor) {
    this.container = element;
    this.canvas = document.createElement("canvas");
    this.height = this.canvas.height = height;
    this.width = this.canvas.width = width;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(posX, posY, width, height);

    this.container.appendChild(this.canvas);
  }
}

function makeCanvas() {
  const canvas = document.getElementById("canvas1");
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
  ctx.fillRect(POS_X, POS_Y, WIDTH, HEIGHT);
  return { canvas, ctx };
}

const { canvas, ctx } = makeCanvas();

const V_MIN = 1;
const V_VARIABLE = 5;

function generateRandomValues() {
  const x = (Math.random() * WIDTH) | 0;
  const y = (Math.random() * HEIGHT) | 0;
  const v = (Math.random() * V_VARIABLE + V_MIN) | 0;
  const ang = Math.random() * 6;
  const color = `#${((Math.random() * FFF) | 0).toString(16)}`;
  const r = ((Math.random() * (RADIUS_MAX - RADIUS_MIN + 1)) | 0) + RADIUS_MIN;
  return { x, y, v, ang, color, r };
}

function isOutofCanvas(x, y, r, width, height) {
  return x - r < 0 || y - r < 0 || x + r > width || y + r > height;
}

function initCirclePlace() {
  let tempList = [];

  setting: for (let i = 0; i < circleCount; ) {
    const { x, y, v, ang, color, r } = generateRandomValues();

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
  tempList = null;
  return circleList;
}

const circleList = initCirclePlace();

function run() {
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
  ctx.fillRect(POS_X, POS_Y, WIDTH, HEIGHT);

  const len = circleList.length;

  for (let i = 0; i < len; i++) {
    circleList[i].check(circleList);
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
