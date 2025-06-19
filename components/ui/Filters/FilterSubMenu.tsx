import { Button } from "@heroui/react";
import React, { ReactNode } from "react";

interface SubmenuProps {
  titulo: string;
  isOpen: boolean;
  onPressAceptar: () => void;
  onPressBorrar: () => void;
  children: ReactNode;
}

const FilterSubMenu = ({
  titulo,
  onPressAceptar,
  onPressBorrar,
  children,
  isOpen,
}: SubmenuProps) => {
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
              onPress={onPressAceptar}
            >
              Aceptar
            </Button>
            <Button
              size="sm"
              variant="light"
              onPress={onPressBorrar}
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
