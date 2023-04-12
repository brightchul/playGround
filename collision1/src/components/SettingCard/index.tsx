import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useToggle } from "../../hooks";
import {
  selectConfigsById,
  useCircleConfigStore,
} from "../../stores/circleConfig";
import { configNamesEntries } from "./constants";
import FoldButton from "./foldButton";
import SettingInputNumber from "./SettingInput";
import { ConfigNamesKeysType } from "./types";
import { useSettingCardValidation } from "./validations";

interface SettingCardProps {
  id: string;
  wrapperClassName?: string;
  togglePlay: () => void;
  isPlay: boolean;
}

export default function SettingCard({
  id,
  wrapperClassName,
  isPlay,
  togglePlay,
}: SettingCardProps) {
  const {
    managers: { circles },
    config,
  } = useCircleConfigStore(selectConfigsById(id))!;

  const updateConfig = useCircleConfigStore((state) => state.updateConfig);
  const removeConfig = useCircleConfigStore((state) => state.removeConfig);

  const { control, handleSubmit, formState } = useForm<ConfigNamesKeysType>({
    defaultValues: config,
  });

  const validationRules = useSettingCardValidation(config);

  const onSubmit = (data: ConfigNamesKeysType) => {
    circles.changeConfig(data);

    if (!isPlay) {
      circles.initCircleList();
    }

    updateConfig(id, data);
    togglePlay();
  };

  useEffect(() => {
    handleSubmit(onSubmit)();
  }, []);

  const [isFold, toggleFold] = useToggle(false);

  return (
    <div
      className={`w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ${wrapperClassName}`}
    >
      <div className="absolute top-1 right-1">
        <FoldButton handleClick={toggleFold} />
      </div>
      {!isFold && (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          {configNamesEntries.map(([name, label]) => (
            <SettingInputNumber
              key={`${name}-${label}`}
              name={name}
              label={label}
              control={control}
              defaultValue={config[name]}
              rules={validationRules[name]}
            />
          ))}

          <div className="flex gap-3">
            <button
              className="mt-5 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={!formState.isValid}
            >
              {isPlay === false ? "play" : "stop"}
            </button>
            <button
              type="button"
              onClick={() => {
                circles.terminateWorker();
                removeConfig(id);
              }}
              className="mt-5 w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={!formState.isValid}
            >
              remove
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
