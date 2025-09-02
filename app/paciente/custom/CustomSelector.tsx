import { Select, SelectItem } from "@heroui/react";

type SelectorItem = { key: string; label: string };

type CustomSelectorProps<T extends readonly SelectorItem[]> = {
  items: T;
  value: T[number]["key"];
  handleSelectionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
};

const CustomSelector = <T extends readonly SelectorItem[]>({
  items,
  value,
  handleSelectionChange,
  label,
}: CustomSelectorProps<T>) => {
  return (
    <Select
      className="w-full sm:max-w-scv12"
      classNames={{
        trigger: "text-card-foreground shadow bg-card border",
      }}
      items={items}
      label={label}
      selectedKeys={[String(value)]}
      labelPlacement="outside"
      placeholder=" "
      onChange={handleSelectionChange}
    >
      {(items) => <SelectItem key={items.key}>{items.label}</SelectItem>}
    </Select>
  );
};

export default CustomSelector

