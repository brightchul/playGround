export function generateRandomValues(
  width: number,
  height: number,
  vVariable: number,
  vMin: number,
  colorMax: number,
  radiusMax: number,
  radiusMin: number
) {
  const x = (Math.random() * width) | 0;
  const y = (Math.random() * height) | 0;
  const v = (Math.random() * vVariable + vMin) | 0;
  const ang = Math.random() * 6;
  const color = `#${((Math.random() * colorMax) | 0).toString(16)}`;
  const r = ((Math.random() * (radiusMax - radiusMin + 1)) | 0) + radiusMin;

  return { x, y, v, ang, color, r };
}

export function isOutofCanvas(
  x: number,
  y: number,
  r: number,
  width: number,
  height: number
) {
  return x - r < 0 || y - r < 0 || x + r > width || y + r > height;
}
