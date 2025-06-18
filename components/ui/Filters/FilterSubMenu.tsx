import { Button } from "@heroui/react";
import React, { ReactNode } from "react";

interface SubmenuProps<T, K extends keyof T> {
  titulo: string;
  isOpen: boolean;
  filterKey: K;
  value: T[K];
  setFilters: React.Dispatch<React.SetStateAction<T>>;
  setLocalValue: React.Dispatch<React.SetStateAction<T[K]>>;
  children: ReactNode;
}

const FilterSubMenu = <T, K extends keyof T>({
  titulo,
  filterKey,
  value,
  setFilters,
  setLocalValue,
  children,
  isOpen,
}: SubmenuProps<T, K>) => {
  const handleAceptar = () => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleBorrar = () => {
    const emptyValue =
      Array.isArray(value) ? [] : typeof value === "boolean" ? false : undefined;

    setLocalValue(emptyValue as T[K]);
    setFilters((prev) => ({
      ...prev,
      [filterKey]: emptyValue as T[K],
    }));
  };
  return (
    <>
      {isOpen && (
        <div className="w-60 bg-white  shadow-xl rounded-xl py-4 px-2 pt-2 ">
          <h3 className="mb-1 text-[#634AE2] pl-10 text-lg">{titulo}</h3>
          {children}
          <div className="flex justify-between mt-3">
            <Button
              size="sm"
              className="bg-[#E7E7FF] text-[#634AE2] text-md px-5 font-light rounded-2xl"
              onPress={handleAceptar}
            >
              Aceptar
            </Button>
            <Button
              size="sm"
              variant="light"
              onPress={handleBorrar}
              className="border-[#8888E0] border-1 text-[#634AE2] px-5 text-md font-light rounded-2xl"
            >
              Borrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSubMenu;
