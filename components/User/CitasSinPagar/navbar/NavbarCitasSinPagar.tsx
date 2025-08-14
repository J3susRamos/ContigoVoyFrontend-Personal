import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icons } from "@/icons";
import { Input } from "@heroui/react";
import { FilterMenu } from "@/components/ui/Filters/FilterMenu";
import FilterButton from "@/components/ui/Filters/FilterButton";
import FilterSubMenu from "@/components/ui/Filters/FilterSubMenu";
import FilterCalendar from "@/components/ui/Filters/FilterCalendar";
import { FiltersCitasSinPagar } from "@/interface";

interface NavbarProps {
  filterValue: string;
  filters: FiltersCitasSinPagar;
  setFilters: Dispatch<SetStateAction<FiltersCitasSinPagar>>;
  onSearchChange: (value?: string) => void;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const SubmenusInitialState = {
  genero: false,
  fechaInicio: false,
  edad: false,
  codigo: false,
};

export const NavbarCitasSinPagar: React.FC<NavbarProps> = ({
  filterValue,
  filters,
  setFilters,
  onSearchChange,
  menuOpen,
  setMenuOpen
}) => {

  const [submenus, setSubmenus] = useState(SubmenusInitialState);

  const [generoSeleccionado, setGeneroSeleccionado] = useState<string[]>([]);
  const [edadSeleccionada, setEdadSeleccionada] = useState<string[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<
    [string, string] | string[]
  >([]);
  const [codigo, setCodigo] = useState<string[]>([]);

  useEffect(() => {
    setSubmenus({
      genero: false,
      edad: false,
      fechaInicio: false,
      codigo: false,
    });
  }, [filters, menuOpen]);

  return (
    <div className="flex w-full">
      <div className="bg-[#6265f4] w-full h-[8vh] flex justify-start items-center px-4">
        <div className="flex gap-4 w-full items-center pl-12">
          <FilterButton menuOpen={menuOpen} setMenuOpen={setMenuOpen}>
            <FilterMenu
              setSubmenus={setSubmenus}
              menuItems={[
                {
                  text: "Género",
                  key: "genero"
                },
                {
                  text: "Edad",
                  key: "edad"
                },
                {
                  text: "Fecha de inicio",
                  key: "fechaInicio",
                },
                {
                  text: "Tipo de usuario",
                  key: "codigo",
                }
              ]}
            />

            {/* Submenú de género */}
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

            {/* Submenú de fecha de inicio */}
            <FilterSubMenu
              titulo="Fecha de Inicio"
              isOpen={submenus.fechaInicio}
              value={fechaSeleccionada}
              setFilters={setFilters}
              setLocalValue={setFechaSeleccionada}
              filterKey="fechaInicio"
            >
              <FilterCalendar
                fechaSeleccionada={fechaSeleccionada}
                setFechaSeleccionada={setFechaSeleccionada}
              />
            </FilterSubMenu>

            <FilterSubMenu
              titulo="Tipo de usuario"
              isOpen={submenus.codigo}
              value={codigo}
              setFilters={setFilters}
              setLocalValue={setCodigo}
              filterKey="codigo"
            >
              <div className="flex flex-col text-sm pl-10">
                {["Prepaciente", "Paciente"].map(
                  (opcion) => (
                    <label
                      key={opcion}
                      className="text-[#634AE2] text-lg flex items-center gap-4"
                    >
                      <input
                        type="checkbox"
                        name="codigo"
                        value={opcion}
                        checked={codigo.includes(opcion)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCodigo([
                              ...codigo,
                              opcion,
                            ]);
                          } else {
                            setCodigo(
                              codigo.filter(
                                (item) => item !== opcion
                              )
                            );
                          }
                        }}
                        className="appearance-none w-4 h-4 rounded-full border-2 border-[#634AE2] checked:bg-[#634AE2] checked:border-[#634AE2] mr-2"
                      />
                      {opcion}
                    </label>
                  )
                )}
              </div>
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
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
};
