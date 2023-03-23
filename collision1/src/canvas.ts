export class Canvas {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  ctx: CanvasRenderingContext2D;

  constructor(
    element: HTMLElement,
    height: number,
    width: number,
    posX: number,
    posY: number,
    bgColor: string
  ) {
    this.container = element;
    this.canvas = document.createElement("canvas");
    this.height = this.canvas.height = height;
    this.width = this.canvas.width = width;

    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(posX, posY, width, height);

    this.container.appendChild(this.canvas);
  }
}
