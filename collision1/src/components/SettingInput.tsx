import { Form, InputNumber } from "antd";
import { Control, FieldValues, Controller } from "react-hook-form";

interface SettingNumberInputProps {
  control: Control<FieldValues, any>;
  label: string;
  name: string;
  rules: any;
  defaultValue: any;
}

export default function SettingInputNumber({
  control,
  label,
  name,
  rules,
  defaultValue,
}: SettingNumberInputProps) {
  return (
    <Form.Item label={label} name={name}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <InputNumber {...field} defaultValue={defaultValue} />
        )}
      />
    </Form.Item>
  );
}
