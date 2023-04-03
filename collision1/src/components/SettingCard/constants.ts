import { ConfigNames, ConfigNamesEntries } from "./types";

export const configNames: ConfigNames = {
  circleCount: "circle 개수",
  width: "캔버스 가로",
  height: "캔버스 세로",
  vVariable: "속도 구간",
  vMin: "최저 속도",
  radiusMax: "circle 최대 지름",
  radiusMin: "circle 최소 지름",
};

export const configNamesEntries = Object.entries(
  configNames
) as ConfigNamesEntries;
