import { useState, useCallback } from "react";

export function useToggle(
  defaultValue: boolean = false
): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(defaultValue);
  const toggleValue = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggleValue];
}
