import { memo, useEffect, useRef, useState } from "react";

import { CircleManager } from "../../circle";
import useCircleArea from "./useCircleArea";

export interface CircleAreaProps {
  id: string;
  height: number;
  width: number;
  posX?: number;
  posY?: number;
  bgColor: string;
  circleManager: CircleManager;
  isPlay: boolean;
}

function CircleArea({ isPlay, ...props }: CircleAreaProps) {
  const { canvasRef, toggleAnimation } = useCircleArea(props);

  useEffect(() => {
    toggleAnimation(isPlay);
  }, [isPlay]);

  return (
    <div id={props.id}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default memo(CircleArea);
