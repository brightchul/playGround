import { Button, Card, Form } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCircleConfigStore } from "../../stores/circleConfig";
import { configNamesEntries } from "./constants";
import SettingInputNumber from "./SettingInput";
import { ConfigNamesKeysType } from "./types";
import { useSettingCardValidation } from "./validations";

interface SettingCardProps {
  togglePlay: () => void;
  isPlay: boolean;
}

export default function SettingCard({ isPlay, togglePlay }: SettingCardProps) {
  const { id, config, managers } = useCircleConfigStore(
    (state) => state.configs
  )[0];

  const updateConfig = useCircleConfigStore((state) => state.updateConfig);

  const { control, handleSubmit, formState } = useForm<ConfigNamesKeysType>({
    defaultValues: config,
  });

  const validationRules = useSettingCardValidation(config);

  const onSubmit = (data: ConfigNamesKeysType) => {
    const { circles } = managers;
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
    <Card
      title="Circle Setting"
      style={{ maxWidth: 300, position: "absolute" }}
    >
      <Form
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        onFinish={handleSubmit(onSubmit)}
      >
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

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!formState.isValid}
          >
            {isPlay === false ? "play" : "stop"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
