import React from "react";
import { Icons } from "@/icons";
import {
  Input,
} from "@heroui/react";

interface NavbarProps {
  filterValue: string;
  onSearchChange: (value?: string) => void;
  onClear: () => void;
  visibleColumns?: Set<string>;
  setVisibleColumns?: (columns: Set<string>) => void;
  columns?: { name: string; uid: string; sortable?: boolean }[];
  onAddNew: () => void;
}

export const NavbarPacientes: React.FC<NavbarProps> = ({
  filterValue,
  onSearchChange,
  onClear,
  onAddNew,
}) => {
  return (
    <div className="flex w-full mt-8 z-40">
      <div className="bg-primary dark:bg-primary w-full h-[8vh] flex flex-row justify-start items-center px-4">
        <div className="flex flex-row gap-4 w-full items-center pl-12">
          {/* Icono de filtro */}
          {/* <FilterButton/>    */}

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
              input: "placeholder:text-accent-foreground dark:placeholder:text-accent-foreground",
            }}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />

          {/* Grupo de icono de agregar y botón */}
          <div className="ml-auto flex items-center gap-4 mr-12">
            <span
              className="text-primary dark:text-primary transition-colors"
              dangerouslySetInnerHTML={{
                __html: Icons.plus.replace(/<svg /, '<svg fill="currentColor"'),
              }}
              style={{
                background: "hsl(var(--card))",
                borderRadius: "9999px",
                borderColor: "hsl(var(--primary))",
              }}
            />
                
            {/* Botón de agregar nuevo paciente */}
            <button
              className="text-primary-foreground dark:text-primary-foreground font-light text-xl border-1 rounded-full px-4"
              onClick={onAddNew}
            >
              Agregar nuevo paciente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};