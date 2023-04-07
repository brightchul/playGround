import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  selectConfigsById,
  useCircleConfigStore,
} from "../../stores/circleConfig";
import { configNamesEntries } from "./constants";
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

  return (
    <div
      className={`w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ${wrapperClassName}`}
    >
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

        <div>
          <button
            className="mt-5 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={!formState.isValid}
          >
            {isPlay === false ? "play" : "stop"}
          </button>
        </div>
      </form>
    </div>
  );
}
