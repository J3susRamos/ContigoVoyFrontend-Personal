import React, { Dispatch, SetStateAction } from "react";
import { Icons } from "@/icons";
import { Input } from "@heroui/react";

interface NavbarProps {
  filterValue: string;
  onSearchChange: (value?: string) => void;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavbarCitasSinPagar: React.FC<NavbarProps> = ({
  filterValue,
  onSearchChange,
}) => {
  return (
    <div className="flex w-full">
      <div className="bg-[#6265f4] w-full h-[8vh] flex justify-start items-center px-4">
        <div className="flex gap-4 w-full items-center pl-12">
          {/* Icono de lupa */}
          <span
            className="text-primary-foreground dark:text-primary-foreground transition-colors pl-6"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(/<svg /, '<svg fill="currentColor" '),
            }}
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
          />

          {/* Input de búsqueda */}
          <Input
            type="text"
            placeholder="Buscar paciente"
            isClearable
            size="sm"
            radius="full"
            variant="bordered"
            className="rounded-full bg-accent dark:bg-accent ml-4 w-48"
            classNames={{
              input:
                "placeholder:text-accent-foreground dark:placeholder:text-accent-foreground",
            }}
            value={filterValue}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
};
