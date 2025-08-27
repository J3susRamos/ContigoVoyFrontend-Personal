import { useState } from "react";

const useSelector = (defaultValue: string = "") => {
  const [selectorValue, setSelectorValue] = useState<string>(defaultValue);
  const handleSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    f: (newValue: string) => void = () => null
  ) => {
    f(e.target.value);
    setSelectorValue(e.target.value);
  };
  return [selectorValue, handleSelectionChange] as const;
};

export default useSelector;