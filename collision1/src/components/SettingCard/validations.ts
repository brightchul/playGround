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

export const isNumber = (v: any) => {
  if (Number.isNaN(v)) return `숫자값만 가능합니다.`;
};

export function useSettingCardValidation(config: CircleManagerConfig) {
  const validationRules = useMemo(
    () => ({
      circleCount: {
        validate: {
          isNumber,
          required,
          positive,
          max: max(10_000),
        },
      },
      width: {
        validate: {
          isNumber,
          required,
          min: min(100),
        },
      },
      height: {
        validate: {
          isNumber,
          required,
          min: min(100),
        },
      },
      vVariable: {
        validate: {
          isNumber,
          required,
          min: min(0),
        },
      },
      vMin: {
        validate: {
          isNumber,
          required,
          min: min(1),
        },
      },
      radiusMin: {
        validate: {
          isNumber,
          required,
          positive,
          max: max(config.radiusMax),
        },
      },
      radiusMax: {
        validate: {
          isNumber,
          required,
          min: min(config.radiusMin),
        },
      },
    }),
    [config]
  );

  return validationRules;
}
