import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icons } from "@/icons";

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
          <span
            className="text-[#fff] transition-colors pl-0 md:pl-3 hidden md:block"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(
                /<svg /,
                '<svg fill="currentColor" '
              ),
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
            className="rounded-full bg-[#EAEAFF] w-full md:w-48 ml-0 md:ml-4"
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
                <span
                  className="pl-3"
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(
                      /<svg /,
                      '<svg fill="#634AE2"'
                    ),
                  }}
                />
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
                Nombre
                <span
                  className="inline-flex items-center ml-10"
                  dangerouslySetInnerHTML={{
                    __html: Icons.alpharrow.replace(
                      /<svg /,
                      '<svg fill="#634AE2"'
                    ),
                  }}
                />
              </DropdownItem>
              <DropdownItem
                key="fecha"
                classNames={{
                  base: "rounded-2x1 text-base font-normal h-6 text-[#634AE2] data-[hover=true]:bg-[#9494F3] data-[hover=true]:text-white",
                }}
                onPress={onSortByDate}
              >
                Fecha <span
                  className="inline-flex items-center ml-12"
                  dangerouslySetInnerHTML={{
                    __html: Icons.alpharrow.replace(
                      /<svg /,
                      '<svg fill="#634AE2"'
                    ),
                  }}
                />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
