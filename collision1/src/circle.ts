import { generateRandomCircle } from "./util";

const GRID_VALUE = 200;
const WIDTH = 2000;
const HEIGHT = 1000;

const DEGREE_180 = Math.PI;
const DEGREE_360 = Math.PI * 2;

export const gridMap: Map<string, Circle[]> = new Map();

export type CircleConstructorArgs = {
  x: number;
  y: number;
  r: number;
  v: number;
  ang: number;
  color: string;
};

export type CircleInfo = {
  x: number;
  y: number;
  r: number;
  color: string;
};

export class Circle {
  x: number;
  y: number;
  r: number;
  v: number;
  ang: number;
  color: string;

  constructor({ x, y, r, v, ang, color }: CircleConstructorArgs) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = v;
    this.ang = ang;
    this.color = color;
  }

  get info(): CircleInfo {
    const { x, y, r, color } = this;
    return { x, y, r, color };
  }
  check() {
    // 이동하기후의 임시 값
    const tempX = this.x + this.v * Math.sin(this.ang);
    const tempY = this.y + this.v * Math.cos(this.ang);

    const { ang, r } = this;
    const tempXMinusR = tempX - r;
    const tempXPlusR = tempX + r;
    const tempYMinusR = tempY - r;
    const tempYPlusR = tempY + r;

    // 캔버스 경계 충돌 확인
    if (tempXMinusR <= 0 || tempXPlusR >= WIDTH) {
      this.ang = DEGREE_360 - ang;
      return;
    }
    if (tempYMinusR <= 0 || tempYPlusR >= HEIGHT) {
      this.ang = DEGREE_180 - ang;
      return;
    }

    let collisionOne;

    // 각 그리드 별로 충돌 확인 용
    const x1 = (tempXMinusR / GRID_VALUE) | 0;
    const x2 = (tempXPlusR / GRID_VALUE) | 0;
    const y1 = (tempYMinusR / GRID_VALUE) | 0;
    const y2 = (tempYPlusR / GRID_VALUE) | 0;

    loop: for (let i = x1; i <= x2; i++) {
      for (let j = y1; j <= y2; j++) {
        const grid = gridMap.get(`${i}-${j}`);

        if (!grid) continue;

        for (let k = 0; k < grid.length; k++) {
          if (grid[k] === this) continue;
          if (this.isCollision(grid[k])) {
            collisionOne = grid[k];
            break loop;
          }
        }
      }
    }

    if (collisionOne) {
      this.ang = DEGREE_360 - ang;
    }
  }
  move() {
    const { x, y, v, ang, r } = this;

    // 이동
    const nextX = x + v * Math.sin(ang);
    const nextY = y + v * Math.cos(ang);

    // 좌표 세팅
    this.x = nextX;
    this.y = nextY;

    // gridMap에 저장
    const leftX = ((nextX - r) / GRID_VALUE) | 0;
    const rightX = ((nextX + r) / GRID_VALUE) | 0;
    const lowY = ((nextY - r) / GRID_VALUE) | 0;
    const highY = ((nextY + r) / GRID_VALUE) | 0;

    for (let currentX = leftX; currentX <= rightX; currentX++) {
      for (let currentY = lowY; currentY <= highY; currentY++) {
        const key = `${currentX}-${currentY}`;

        if (gridMap.has(key)) {
          gridMap.get(key)!.push(this);
        } else {
          gridMap.set(key, [this]);
        }
      }
    }
  }

  isCollision = (other: Circle) => {
    const { x, y, r } = this;
    return (x - other.x) ** 2 + (y - other.y) ** 2 <= (r + other.r) ** 2;
  };
}

type CircleManagerConfig = {
  circleCount: number;
  WIDTH: number;
  HEIGHT: number;
  V_VARIABLE: number;
  V_MIN: number;
  FFF: number;
  RADIUS_MAX: number;
  RADIUS_MIN: number;
  GRID_VALUE: number;
};

export class CircleManager {
  circleList: Circle[];
  config: CircleManagerConfig;

  constructor(config: CircleManagerConfig) {
    this.config = config;
    this.circleList = [];
  }
  getCircleInfoList() {
    return this.circleList;
  }
  initCirclePlace() {
    const {
      circleCount,
      WIDTH,
      HEIGHT,
      V_VARIABLE,
      V_MIN,
      FFF,
      RADIUS_MAX,
      RADIUS_MIN,
      GRID_VALUE,
    } = this.config;

    let tempList = [];

    settingLoop: for (let i = 0; i < circleCount; ) {
      const { x, y, v, ang, color, r } = generateRandomCircle(
        WIDTH,
        HEIGHT,
        V_VARIABLE,
        V_MIN,
        FFF,
        RADIUS_MAX,
        RADIUS_MIN
      );

      const circle = new Circle({ x, y, r, v, ang, color });

      const leftX = ((x - r) / GRID_VALUE) | 0;
      const rightX = ((x + r) / GRID_VALUE) | 0;

      for (let currentX = leftX; currentX <= rightX; currentX++) {
        if (!tempList[currentX]) {
          tempList[currentX] = [circle];
          continue;
        }

        if (tempList[currentX].some(circle.isCollision)) {
          continue settingLoop;
        }

        tempList[currentX].push(circle);
      }
      i++;
    }

    return (this.circleList = tempList.flat());
  }
}
