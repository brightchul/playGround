import { Button, Card, Form } from "antd";
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
  const oneConfigs = useCircleConfigStore((state) => state.configs)[0];
  const updateConfig = useCircleConfigStore((state) => state.updateConfig);
  const configs = oneConfigs.config;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<ConfigNamesKeysType>>({ defaultValues: configs });

  const validationRules = useSettingCardValidation(configs);

  const onSubmit = (data: Partial<ConfigNamesKeysType>) => {
    if (!data.height || !data.width) return;

    const { circles } = oneConfigs.managers;
    circles.changeConfig(data);

    if (!isPlay) {
      circles.initCircleList();
    }

    updateConfig(oneConfigs.id, data);
    togglePlay();
  };

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
            defaultValue={configs[name]}
            rules={validationRules[name]}
          />
        ))}

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            {isPlay === false ? "play" : "stop"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
