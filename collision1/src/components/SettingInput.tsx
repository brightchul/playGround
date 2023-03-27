import { Form, Input } from "antd";
import { Control, FieldValues, Controller } from "react-hook-form";

interface SettingNumberInputProps {
  control: Control<FieldValues, any>;
  label: string;
  name: string;
  rules: any;
  defaultValue: any;
}

export default function SettingInput({
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
        render={({ field }) => <Input {...field} defaultValue={defaultValue} />}
      />
    </Form.Item>
  );
}
