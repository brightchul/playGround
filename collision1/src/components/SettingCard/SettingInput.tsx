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
    <div>
      <p className="flex items-center">
        <label
          className="w-6/12 block text-sm font-medium text-gray-900"
          htmlFor={name}
        >
          {label}
        </label>
        <input
          className="w-6/12 block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1"
          type="number"
          {...field}
          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
        />
      </p>
      {errors[name] && (
        <p className="text-red-500 text-xs">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
}
