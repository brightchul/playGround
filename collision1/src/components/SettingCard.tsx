import { Button, Card, Form, Input, InputNumber } from "antd";
import { useState } from "react";
import { Control, Controller, FieldValues, useForm } from "react-hook-form";
import { CircleManagerConfig } from "../circle";
import { Config, useCircleConfigStore } from "../stores/circleConfig";
import SettingInput from "./SettingInput";

type ConfigNamesKeysType = Omit<CircleManagerConfig, "maxColor" | "gridValue">;
type ConfigNames = Record<keyof ConfigNamesKeysType, string>;
type ConfigNamesEntries = [keyof ConfigNames, string][];

const configNames: ConfigNames = {
  circleCount: "circle 개수",
  width: "캔버스 가로",
  height: "캔버스 세로",
  vVariable: "속도 구간",
  vMin: "최저 속도",
  radiusMax: "circle 최대 지름",
  radiusMin: "circle 최소 지름",
};

const configNamesEntries = Object.entries(configNames) as ConfigNamesEntries;

export default function SettingCard() {
  const oneConfigs = useCircleConfigStore((state) => state.configs)[0];
  const configs = oneConfigs.config;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<CircleManagerConfig>>({ defaultValues: configs });

  const [play, setPlay] = useState(false);

  const onSubmit = () => {
    oneConfigs.managers.canvas.toggle();
    setPlay((prev) => !prev);
  };

  return (
    <Card title="Circle Setting" style={{ maxWidth: 300 }}>
      <Form
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        onFinish={handleSubmit(onSubmit)}
      >
        {configNamesEntries.map(([name, label]) => (
          <SettingInput
            key={`${name}-${label}`}
            name={name}
            label={label}
            control={control}
            defaultValue={configs[name]}
            rules={{ required: true }}
          />
        ))}

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            {play === false ? "play" : "stop"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
