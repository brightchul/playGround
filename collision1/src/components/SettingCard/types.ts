import { CircleManagerConfig } from "../../circle";

export type ConfigNamesKeysType = Omit<
  CircleManagerConfig,
  "maxColor" | "gridValue"
>;
export type ConfigNames = Record<keyof ConfigNamesKeysType, string>;
export type ConfigNamesEntries = [keyof ConfigNames, string][];
