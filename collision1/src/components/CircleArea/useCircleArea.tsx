import { useEffect, useRef, useState } from "react";

import { CircleInfo } from "../../circle";
import { CircleAreaProps } from "./CircleArea";

const DEGREE_180 = Math.PI;
const DEGREE_360 = DEGREE_180 * 2;
const RAF_NONE = -1;

interface UseCircleAreaProps extends Omit<CircleAreaProps, "isPlay"> {}

export default function useCircleArea({
  height,
  width,
  posX = 0,
  posY = 0,
  bgColor,
  circleManager,
}: UseCircleAreaProps) {
  const rafRef = useRef<number>(RAF_NONE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(
    null
  );

  const renderCircle = ({ x, y, r, color }: CircleInfo) => {
    if (!canvasCtx) return;

    canvasCtx.beginPath();
    canvasCtx.arc(x, y, r, 0, DEGREE_360);
    canvasCtx.fillStyle = color;
    canvasCtx.fill();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.height = height;
    canvas.width = width;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setCanvasCtx(ctx);
    clearCanvas();

    return () => {
      stopAnimation();
    };
  }, [canvasRef.current, height, width]);

  const clearCanvas = () => {
    if (!canvasCtx) return;

    canvasCtx.fillStyle = bgColor;
    canvasCtx.fillRect(posX, posY, width, height);
  };

  const renderCanvas = () => {
    clearCanvas();
    circleManager.circleList.forEach((circle) => renderCircle(circle.info));
  };

  const runAnimation = () => {
    circleManager.moveCircles();
    renderCanvas();

    rafRef.current = requestAnimationFrame(runAnimation);
  };

  const stopAnimation = () => {
    cancelAnimationFrame(rafRef.current);
  };

  const toggleAnimation = (isPlay: boolean) => {
    if (isPlay) {
      runAnimation();
    } else {
      stopAnimation();
    }
  };

  return { canvasRef, toggleAnimation };
}
