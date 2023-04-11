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

type Circle = {
  x: number;
  y: number;
  r: number;
  v: number;
  ang: number;
  color: string;
};
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
  worker: Worker;

  constructor(config: CircleManagerConfig) {
    this.config = config;
    this.circleList = [];
    this.gridMap = new Map();

    this.initCircleList();
    this.worker = new Worker(new URL("./worker/worker1.ts", import.meta.url));
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

      const circle = { x, y, r, v, ang, color };

      for (let currentX = leftX; currentX <= rightX; currentX++) {
        if (!tempList[currentX]) {
          tempList[currentX] = [circle];
          continue;
        }

        if (
          tempList[currentX].some((tempCircle) =>
            this.isCollision(circle, tempCircle)
          )
        ) {
          continue settingLoop;
        }

        tempList[currentX].push(circle);
      }
      i++;
    }

    return (this.circleList = tempList.flat());
  }

  isCollision(circle1: any, circle2: any) {
    return (
      (circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2 <=
      (circle1.r + circle2.r) ** 2
    );
  }

  generateRandomCircle() {
    const { width, height, vVariable, vMin, maxColor, radiusMax, radiusMin } =
      this.config;

    const r = ((Math.random() * (radiusMax - radiusMin + 1)) | 0) + radiusMin;
    const x = ((Math.random() * (width - r - r)) | 0) + r;
    const y = ((Math.random() * (height - r - r)) | 0) + r;
    const v = (Math.random() * vVariable + vMin) | 0;

    const ang = (Math.random() * 360) | 0;
    const color = `#${((Math.random() * maxColor) | 0).toString(16)}`;

    return { x, y, v, ang, color, r };
  }

  async moveCircles(canvasClear: any, canvasRender: (circle: any) => void) {
    this.worker.postMessage(this.circleList);

    this.worker.onmessage = ({ data }) => {
      canvasClear();
      this.circleList = data;
      this.circleList.forEach((one) => {
        canvasRender(one);
      });
    };
  }
}
