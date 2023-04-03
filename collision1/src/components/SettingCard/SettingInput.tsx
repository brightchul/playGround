import { Form, InputNumber } from "antd";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";

interface SettingNumberInputProps<T extends FieldValues> {
  control: Control<T>;
  label: string;
  name: FieldPath<T>;
  rules: any;
  defaultValue: any;
}

export default function SettingInputNumber<T extends FieldValues>({
  control,
  label,
  name,
  rules,
  defaultValue,
}: SettingNumberInputProps<T>) {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    defaultValue,
    control,
    rules,
  });

  return (
    <Form.Item label={label} name={name}>
      <>
        <InputNumber {...field} />
        {errors[name] && <p>{errors[name]?.message?.toString()}</p>}
      </>
    </Form.Item>
  );
}
