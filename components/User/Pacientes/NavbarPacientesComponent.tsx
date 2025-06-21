import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icons } from "@/icons";
import { Input } from "@heroui/react";
import FilterButton from "@/components/ui/Filters/FilterButton";
import { FilterMenu } from "@/components/ui/Filters/FilterMenu";
import FilterSubMenu from "@/components/ui/Filters/FilterSubMenu";
import { FiltersPaciente } from "@/components/PacientesLista/ListarPacientes";
import FilterCalendar from "@/components/ui/Filters/FilterCalendar";

interface NavbarProps {
  filterValue: string;
  onSearchChange: (value?: string) => void;
  onClear: () => void;
  visibleColumns?: Set<string>;
  setVisibleColumns?: (columns: Set<string>) => void;
  columns?: { name: string; uid: string; sortable?: boolean }[];
  onAddNew: () => void;
  filters: FiltersPaciente;
  setFilters: Dispatch<SetStateAction<FiltersPaciente>>;
  menuAbierto: boolean;
  setMenuAbierto: Dispatch<SetStateAction<boolean>>;
}

const SubmenusInitialState = {
  genero: false,
  edad: false,
  fechaUltimaCita: false,
};

export const NavbarPacientes: React.FC<NavbarProps> = ({
  filterValue,
  onSearchChange,
  onClear,
  onAddNew,
  filters,
  setFilters,
  menuAbierto,
  setMenuAbierto
}) => {
  
  const [submenus, setSubmenus] = useState(SubmenusInitialState);
  const [edadSeleccionada, setEdadSeleccionada] = useState<string[]>([]);
  const [fechaCitaSeleccionada, setFechaCitaSeleccionada] = useState<
    [string, string] | string[]
  >([]);
  const [generoSeleccionado, setGeneroSeleccionado] = useState<string[]>([]);

  useEffect(() => {
    setSubmenus({
      genero: false,
      edad: false,
      fechaUltimaCita: false,
    });
  }, [filters, menuAbierto]);

  return (
    <div className="flex w-full z-40">
      <div className="bg-[#6265f4] dark:bg-primary w-full h-[8vh] flex flex-row justify-start items-center px-4">
        <div className="flex flex-row gap-4 w-full items-center pl-12">
          {/* Icono de filtro */}
          <FilterButton menuOpen={menuAbierto} setMenuOpen={setMenuAbierto}>
            <FilterMenu
              setSubmenus={setSubmenus}
              menuItems={[
                {
                  text: "Género",
                  key: "genero",
                },
                {
                  text: "Edad",
                  key: "edad",
                },
                {
                  text: "Fecha de última cita",
                  key: "fechaUltimaCita",
                },
              ]}
            />
            {/* Submenú de genero */}
            <FilterSubMenu
              titulo="Género"
              isOpen={submenus.genero}
              value={generoSeleccionado}
              setFilters={setFilters}
              setLocalValue={setGeneroSeleccionado}
              filterKey="genero"
            >
              <div className="flex flex-col text-sm pl-10">
                {["Masculino", "Femenino", "Otros"].map((opcion) => (
                  <label
                    key={opcion}
                    className="text-[#634AE2] text-lg flex items-center gap-4"
                  >
                    <input
                      type="checkbox"
                      name="genero"
                      value={opcion}
                      checked={generoSeleccionado.includes(opcion)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGeneroSeleccionado([
                            ...generoSeleccionado,
                            opcion,
                          ]);
                        } else {
                          setGeneroSeleccionado(
                            generoSeleccionado.filter((item) => item !== opcion)
                          );
                        }
                      }}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-[#634AE2] checked:bg-[#634AE2] checked:border-[#634AE2] mr-2"
                    />
                    {opcion}
                  </label>
                ))}
              </div>
            </FilterSubMenu>
            {/* Submenú de edad */}
            <FilterSubMenu
              titulo="Edad"
              isOpen={submenus.edad}
              value={edadSeleccionada}
              setFilters={setFilters}
              setLocalValue={setEdadSeleccionada}
              filterKey="edad"
            >
              <div className="flex flex-col text-sm pl-10">
                {[
                  "0 - 10",
                  "10 - 20",
                  "20 - 30",
                  "30 - 40",
                  "40 - 50",
                  "50 - 60",
                  "60 +",
                ].map((opcion) => (
                  <label
                    key={opcion}
                    className="text-[#634AE2] text-lg flex items-center gap-4"
                  >
                    <input
                      type="checkbox"
                      name="genero"
                      value={opcion}
                      checked={edadSeleccionada.includes(opcion)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEdadSeleccionada([...edadSeleccionada, opcion]);
                        } else {
                          setEdadSeleccionada(
                            edadSeleccionada.filter((item) => item !== opcion)
                          );
                        }
                      }}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-[#634AE2] checked:bg-[#634AE2] checked:border-[#634AE2] mr-2"
                    />
                    {opcion}
                  </label>
                ))}
              </div>
            </FilterSubMenu>
            <FilterSubMenu
              titulo="Fecha de última cita"
              isOpen={submenus.fechaUltimaCita}
              setFilters={setFilters}
              value={fechaCitaSeleccionada}
              setLocalValue={setFechaCitaSeleccionada}
              filterKey="fechaUltimaCita"
            >
              <FilterCalendar
                fechaSeleccionada={fechaCitaSeleccionada}
                setFechaSeleccionada={setFechaCitaSeleccionada}
              />
            </FilterSubMenu>
          </FilterButton>

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
