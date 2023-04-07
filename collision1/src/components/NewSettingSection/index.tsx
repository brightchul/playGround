import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  generateInitConfigState,
  useCircleConfigStore,
} from "../../stores/circleConfig";
import SettingCard from "../SettingCard";
import { configNamesEntries } from "../SettingCard/constants";
import SettingInputNumber from "../SettingCard/SettingInput";
import { ConfigNamesKeysType } from "../SettingCard/types";
import { useSettingCardValidation } from "../SettingCard/validations";

export default function NewSettingSection() {
  const initConfig = generateInitConfigState();

  const addConfig = useCircleConfigStore((state) => state.addConfig);

  const { control, handleSubmit, formState } = useForm<ConfigNamesKeysType>({
    defaultValues: initConfig,
  });

  const validationRules = useSettingCardValidation(initConfig);

  const onSubmit = (data: ConfigNamesKeysType) => {
    addConfig({ ...initConfig, ...data });
  };

  useEffect(() => {
    handleSubmit(() => {})();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap gap-3  justify-start">
          {configNamesEntries.map(([name, label]) => (
            <SettingInputNumber
              wrapperClassName={"basis-52"}
              key={`${name}-${label}`}
              name={name}
              label={label}
              control={control}
              defaultValue={initConfig[name]}
              rules={validationRules[name]}
            />
          ))}
        </div>
        <div className="text-center p-5">
          <button
            className="inline-flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={!formState.isValid}
          >
            add new circle collision
          </button>
        </div>
      </form>
    </div>
  );
}
