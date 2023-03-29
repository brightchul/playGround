import { CircleInfo, CircleManager } from "./circle";

const DEGREE_180 = Math.PI;
const DEGREE_360 = DEGREE_180 * 2;

type CanvasConfig = {
  id: string;
  height: number;
  width: number;
  posX: number;
  posY: number;
  bgColor: string;
};

export class Canvas {
  #config: CanvasConfig;
  #canvas?: HTMLCanvasElement;
  #circleManager: CircleManager;
  #refNum: number = -1;

  constructor(
    { id, height, width, posX, posY, bgColor }: CanvasConfig,
    circleManager: CircleManager
  ) {
    this.#circleManager = circleManager;

    this.#config = {
      id,
      height,
      width,
      posX,
      posY,
      bgColor,
    };
  }

  init() {
    if (this.#canvas) return;
    const { id, height, width } = this.#config;
    const element = document.getElementById(id)! as HTMLElement;

    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    element.appendChild(canvas);

    this.#canvas = canvas;
    this.clear();
  }

  get height() {
    return this.#canvas?.height;
  }
  get width() {
    return this.#canvas?.width;
  }
  get ctx() {
    return this.#canvas?.getContext("2d")!;
  }

  changeSize({ height, width }: { height: number; width: number }) {
    if (!this.#canvas) return;

    this.#canvas.height = this.#config.height = height;
    this.#canvas.width = this.#config.width = width;

    this.renderCanvas();
  }

  clear() {
    const ctx = this.ctx;
    const { posX, posY, width, height, bgColor } = this.#config;

    ctx.fillStyle = bgColor;
    ctx.fillRect(posX, posY, width, height);
  }

  renderCircle({ x, y, r, color }: CircleInfo) {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, DEGREE_360);
    ctx.fillStyle = color;
    ctx.fill();
  }

  renderCanvas() {
    this.clear();
    this.#circleManager.circleList.forEach((circle) =>
      this.renderCircle(circle.info)
    );
  }

  run = () => {
    this.#circleManager.moveCircles();
    this.renderCanvas();

    this.#refNum = requestAnimationFrame(this.run);
  };

  stop() {
    cancelAnimationFrame(this.#refNum);
    this.#refNum = -1;
  }

  toggle() {
    this.#refNum === -1 ? this.run() : this.stop();
  }
}
