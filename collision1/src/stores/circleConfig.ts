import { nanoid } from "nanoid";
import { create } from "zustand";

import { CircleManager, CircleManagerConfig as CircleConfig } from "../circle";

export interface Config {
  id: string;
  config: CircleConfig;
  managers: {
    circles: CircleManager;
  };
}

interface ConfigStore {
  configs: Config[];
  addConfig: (newConfig: CircleConfig) => void;
  removeConfig: (targetConfig: Config) => void;
  updateConfig: (id: string, targetConfig: Partial<CircleConfig>) => void;
}
const FFF = 16777215;

const initConfigState = {
  circleCount: 7000,
  width: 2000,
  height: 1000,
  vVariable: 5,
  vMin: 1,
  maxColor: FFF,
  radiusMin: 1,
  radiusMax: 3,
  gridValue: 200,
};

const INIT_ID = nanoid();
export const circleManager = new CircleManager(initConfigState);

export const useCircleConfigStore = create<ConfigStore>()((set) => ({
  configs: [
    {
      id: INIT_ID,
      config: initConfigState,
      managers: {
        circles: circleManager,
      },
    },
  ],
  addConfig: (newConfig) =>
    set((state) => {
      const circles = new CircleManager({ ...newConfig, maxColor: FFF });

      return {
        configs: [
          ...state.configs,
          {
            id: nanoid(),
            config: newConfig,
            managers: { circles },
          },
        ],
      };
    }),
  updateConfig: (id, targetConfig) =>
    set((state) => {
      const prev = state.configs.find((config) => config.id === id);
      if (prev) {
        const targetKeys = Object.keys(
          targetConfig
        ) as (keyof Partial<CircleConfig>)[];

        if (targetKeys.some((key) => prev.config[key] !== targetConfig[key])) {
          prev.config = {
            ...prev.config,
            ...targetConfig,
          };
        }
      }
      return state;
    }),
  removeConfig: (targetConfig) =>
    set((state) => {
      return {
        configs: state.configs.filter(
          (config) => config.id !== targetConfig.id
        ),
      };
    }),
}));
