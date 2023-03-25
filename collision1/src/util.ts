export function isOutofCanvas(
  x: number,
  y: number,
  r: number,
  width: number,
  height: number
) {
  return x - r < 0 || y - r < 0 || x + r > width || y + r > height;
}
