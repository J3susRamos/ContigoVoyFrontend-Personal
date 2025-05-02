import React from "react";
import { Icons } from "@/icons";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

interface NavbarProps {
  filterValue: string;
  onSearchChange: (value?: string) => void;
  onClear: () => void;
  visibleColumns: Set<string>;
  setVisibleColumns: (columns: Set<string>) => void;
  columns: { name: string; uid: string; sortable?: boolean }[];
  onAddNew: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
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
          <span
            className="text-primary-foreground dark:text-primary-foreground transition-colors"
            dangerouslySetInnerHTML={{
              __html: Icons.filter.replace(/<svg /, '<svg fill="currentColor" '),
            }}
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
          />
          <Dropdown
            classNames={{
              base: "bg-none",
            }}
          >
            <DropdownTrigger className="text-primary-foreground dark:text-primary-foreground font-light text-xl">
              <Button variant="bordered" className="border-none">
                Filtrar
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Ordenar por">
              {/* DropdownItems with updated colors */}
              <DropdownItem
                key="genero"
                classNames={{
                  base: "rounded-2x1 text-base font-normal h-6 text-primary dark:text-primary-foreground data-[hover=true]:bg-primary data-[hover=true]:text-primary-foreground",
                  title: "ml-3 text-[16px]",
                }}
              >
                Genero
                <span
                  className="inline-flex items-center ml-[127px]"
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(/<svg /, '<svg fill="currentColor"'),
                  }}
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                    transform: "rotate(-90deg)",
                  }}
                />
              </DropdownItem>
              {/* Similar updates for other DropdownItems */}
            </DropdownMenu>
          </Dropdown>

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
                
            {/* Botón de agregar nueva cita */}

            <button
              className="text-primary-foreground dark:text-primary-foreground font-light text-xl border-1 rounded-full px-4"
              onClick={onAddNew}
            >
              Agregar nueva cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};