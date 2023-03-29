const DEGREE_180 = Math.PI;
const DEGREE_360 = Math.PI * 2;

export type CircleInfo = {
  x: number;
  y: number;
  r: number;
  color: string;
};

export type CircleConstructorArgs = CircleInfo & {
  v: number;
  ang: number;
};

type PositionInfo = {
  leftX: number;
  rightX: number;
  lowY: number;
  highY: number;
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

  reflectXAxis() {
    this.ang = DEGREE_180 - this.ang;
  }
  reflectYAxis() {
    this.ang = DEGREE_360 - this.ang;
  }

  getPositionInfo(): PositionInfo {
    const { x, y, r } = this;

    return {
      leftX: x - r,
      rightX: x + r,
      lowY: y - r,
      highY: y + r,
    };
  }

  getNextPositionInfo(): PositionInfo {
    const { ang, x, y, v, r } = this;
    const nextX = x + v * Math.sin(ang);
    const nextY = y + v * Math.cos(ang);

    return {
      leftX: nextX - r,
      rightX: nextX + r,
      lowY: nextY - r,
      highY: nextY + r,
    };
  }
  move() {
    const { x, y, v, ang } = this;

    // 이동
    const nextX = x + v * Math.sin(ang);
    const nextY = y + v * Math.cos(ang);

    // 좌표 세팅
    this.x = nextX;
    this.y = nextY;
  }

  isCollision = (other: Circle) => {
    const { x, y, r } = this;
    return (x - other.x) ** 2 + (y - other.y) ** 2 <= (r + other.r) ** 2;
  };
}

export type CircleManagerConfig = {
  circleCount: number;
  width: number;
  height: number;
  vVariable: number;
  vMin: number;
  maxColor: number;
  radiusMax: number;
  radiusMin: number;
  gridValue: number;
};

export class CircleManager {
  circleList: Circle[];
  config: CircleManagerConfig;
  gridMap: Map<string, Circle[]>;

  constructor(config: CircleManagerConfig) {
    this.config = config;
    this.circleList = [];
    this.gridMap = new Map();

    this.initCircleList();
  }
  changeConfig(config: Partial<CircleManagerConfig>) {
    this.config = { ...this.config, ...config };
  }
  getCircleInfoList() {
    return this.circleList;
  }
  initCircleList() {
    const { circleCount, gridValue } = this.config;

    let tempList = [];

    settingLoop: for (let i = 0; i < circleCount; ) {
      const { x, y, v, ang, color, r } = this.generateRandomCircle();
      const leftX = ((x - r) / gridValue) | 0;
      const rightX = ((x + r) / gridValue) | 0;

      const circle = new Circle({ x, y, r, v, ang, color });

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

  generateRandomCircle() {
    const { width, height, vVariable, vMin, maxColor, radiusMax, radiusMin } =
      this.config;

    const r = ((Math.random() * (radiusMax - radiusMin + 1)) | 0) + radiusMin;
    const x = ((Math.random() * (width - r - r)) | 0) + r;
    const y = ((Math.random() * (height - r - r)) | 0) + r;
    const v = (Math.random() * vVariable + vMin) | 0;
    const ang = Math.random() * 6;
    const color = `#${((Math.random() * maxColor) | 0).toString(16)}`;

    return { x, y, v, ang, color, r };
  }

  moveCircles() {
    this.circleList.forEach((circle) => {
      const nextPositionInfo = circle.getNextPositionInfo();
      const checkResult = this.checkNextPosition(nextPositionInfo, circle);

      if (checkResult === "x-axis") return circle.reflectXAxis();
      if (checkResult === "y-axis") return circle.reflectYAxis();
    });
    this.gridMap.clear();
    this.circleList.forEach((circle) => {
      circle.move();
      this.setGridMap(circle);
    });
  }

  setGridMap(circle: Circle) {
    const gridMap = this.gridMap;
    const { leftX, rightX, lowY, highY } = circle.getPositionInfo();
    const gridValue = this.config.gridValue;

    const gridLeftX = (leftX / gridValue) | 0;
    const gridRightX = (rightX / gridValue) | 0;
    const gridLowY = (lowY / gridValue) | 0;
    const gridHighY = (highY / gridValue) | 0;

    for (let currentX = gridLeftX; currentX <= gridRightX; currentX++) {
      for (let currentY = gridLowY; currentY <= gridHighY; currentY++) {
        const key = `${currentX}-${currentY}`;

        if (gridMap.has(key)) {
          gridMap.get(key)!.push(circle);
        } else {
          gridMap.set(key, [circle]);
        }
      }
    }
  }

  checkNextPosition(
    { leftX, rightX, lowY, highY }: PositionInfo,
    circle: Circle
  ) {
    const { height, width, gridValue } = this.config;

    if (leftX <= 0 || rightX >= width) {
      return "y-axis";
    }
    if (lowY <= 0 || highY >= height) {
      return "x-axis";
    }

    const gridMap = this.gridMap;
    const gridLeftX = (leftX / gridValue) | 0;
    const gridRightX = (rightX / gridValue) | 0;
    const gridLowY = (lowY / gridValue) | 0;
    const gridHighY = (highY / gridValue) | 0;

    for (let currentX = gridLeftX; currentX <= gridRightX; currentX++) {
      for (let currentY = gridLowY; currentY <= gridHighY; currentY++) {
        const grid = gridMap.get(`${currentX}-${currentY}`);

        if (!grid) continue;

        for (let k = 0; k < grid.length; k++) {
          if (grid[k] === circle) continue;
          if (circle.isCollision(grid[k])) {
            return "y-axis";
          }
        }
      }
    }

    return "none";
  }
}
