const GRID_VALUE = 200;
const WIDTH = 2000;
const HEIGHT = 1000;

export const gridMap: Map<string, Circle[]> = new Map();

export type CircleConstructorArgs = {
  x: number;
  y: number;
  r: number;
  v: number;
  ang: number;
  color: string;
  ctx: CanvasRenderingContext2D;
};

export class Circle {
  x: number;
  y: number;
  r: number;
  v: number;
  ang: number;
  color: string;
  ctx: CanvasRenderingContext2D;

  constructor({ x, y, r, v, ang, color, ctx }: CircleConstructorArgs) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = v;
    this.ang = ang;
    this.color = color;
    this.ctx = ctx;
  }
  render() {
    const { x, y, r, color, ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  check() {
    const tempX = this.x + this.v * Math.sin(this.ang);
    const tempY = this.y + this.v * Math.cos(this.ang);

    const { ang, r } = this;
    const tempXMinusR = tempX - r;
    const tempXPlusR = tempX + r;
    const tempYMinusR = tempY - r;
    const tempYPlusR = tempY + r;

    // 캔버스 경계 충돌 확인
    if (tempXMinusR <= 0 || tempXPlusR >= WIDTH) {
      this.ang = Math.PI * 2 - ang;
      return;
    }
    if (tempYMinusR <= 0 || tempYPlusR >= HEIGHT) {
      this.ang = Math.PI - ang;
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
          if (this.isCollision(tempX, tempY, r, grid[k])) {
            collisionOne = grid[k];
            break loop;
          }
        }
      }
    }

    if (collisionOne) {
      this.ang = Math.PI * 2 - ang;
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

        if (gridMap.has(key)) {
          gridMap.get(key)!.push(this);
        } else {
          gridMap.set(key, [this]);
        }
      }
    }
  }
  isCollision(x: number, y: number, r: number, other: Circle) {
    return (x - other.x) ** 2 + (y - other.y) ** 2 <= (r + other.r) ** 2;
  }
}
