import { CircleInfo } from "./circle";

const DEGREE_180 = Math.PI;
const DEGREE_360 = DEGREE_180 * 2;

type CanvasConfig = {
  element: HTMLElement;
  height: number;
  width: number;
  posX: number;
  posY: number;
  bgColor: string;
};

export class Canvas {
  #config: CanvasConfig;
  #canvas: HTMLCanvasElement;

  constructor({ element, height, width, posX, posY, bgColor }: CanvasConfig) {
    this.#config = {
      element,
      height,
      width,
      posX,
      posY,
      bgColor,
    };

    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    element.appendChild(canvas);

    this.#canvas = canvas;
    this.clear();
  }

  get height() {
    return this.#canvas.height;
  }
  get width() {
    return this.#canvas.width;
  }
  get ctx() {
    return this.#canvas.getContext("2d")!;
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
}
