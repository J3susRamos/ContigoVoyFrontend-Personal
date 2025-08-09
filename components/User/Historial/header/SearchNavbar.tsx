import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ArrowDownAZ, ChevronDown, Search } from "lucide-react";

interface NavbarProps {
  filterValue: string;
  onSearchChange: (value?: string) => void;
  onClear: () => void;
  visibleColumns: Set<string>;
  setVisibleColumns: (columns: Set<string>) => void;
  columns: { name: string; uid: string; sortable?: boolean }[];
  onSortByDate: () => void;
  onSortByName: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  filterValue,
  onSearchChange,
  onClear,
  onSortByDate,
  onSortByName,
}) => {
  return (
    <div className="flex w-full">
      <div className="bg-[#6364F4] w-full min-h-[8vh] flex flex-col md:flex-row justify-start items-center py-4 md:py-0">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full items-center px-4 md:pl-8 lg:py-4">
          {/* Icono de lupa */}
          <Search className="w-5"/>
          {/* Input de búsqueda */}
          <Input
            type="text"
            placeholder="Buscar paciente"
            isClearable
            size="sm"
            radius="full"
            variant="bordered"
            className="rounded-full bg-[#EAEAFF] w-full md:w-48"
            classNames={{
              input: "placeholder:text-[#9494F3]",
            }}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          {/* Botón que abre el desplegable */}
          <Dropdown
            classNames={{
              base: "bg-none",
            }}
          >
            <DropdownTrigger className="bg-[#EAEAFF] rounded-full h-8 text-[#634AE2] text-base font-normal w-full md:w-auto">
              <Button variant="bordered" className="w-full md:w-auto">
                Ordenar por{" "}
                <ChevronDown className="inline h-4 w-4 ml-1" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Ordenar por">
              <DropdownItem
                key="nombre"
                classNames={{
                  base: "rounded-2x1 text-base font-normal h-6 text-[#634AE2] data-[hover=true]:bg-[#9494F3] data-[hover=true]:text-white inline-flex items-center",
                }}
                onPress={onSortByName}
              >
                <ArrowDownAZ className="inline h-6 w-6 mr-2" />
                Nombre
              </DropdownItem>
              <DropdownItem
                key="fecha"
                classNames={{
                  base: "rounded-2x1 text-base font-normal h-6 text-[#634AE2] data-[hover=true]:bg-[#9494F3] data-[hover=true]:text-white",
                }}
                onPress={onSortByDate}
              >
                <ArrowDownAZ className="inline h-6 w-6 mr-2" />
                Fecha
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
