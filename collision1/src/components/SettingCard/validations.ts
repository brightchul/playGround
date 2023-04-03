import { useMemo } from "react";
import { CircleManagerConfig } from "../../circle";

export const required = (v: any) => {
  if (v === null) return "필수 값입니다.";
};
export const positive = (v: number) => {
  if (v < 1) return "1이상 이어야 합니다.";
};
export const max = (maxValue: number) => (v: number) => {
  if (v > maxValue) return `${maxValue} 이하의 값이어야 합니다.`;
};
export const min = (minValue: number) => (v: number) => {
  if (v < minValue) return `${minValue} 이상의 값이어야 합니다.`;
};

export function useSettingCardValidation(configs: CircleManagerConfig) {
  const validationRules = useMemo(
    () => ({
      circleCount: {
        validate: {
          required,
          positive,
          max: max(10_000),
        },
      },
      width: {
        validate: {
          required,
          min: min(100),
        },
      },
      height: {
        validate: {
          required,
          min: min(100),
        },
      },
      vVariable: {
        validate: {
          required,
          min: min(0),
        },
      },
      vMin: {
        validate: {
          required,
          min: min(1),
        },
      },
      radiusMin: {
        validate: {
          required,
          positive,
          max: max(configs.radiusMax),
        },
      },
      radiusMax: {
        validate: {
          required,
          min: min(configs.radiusMin),
        },
      },
    }),
    [configs]
  );

  return validationRules;
}
