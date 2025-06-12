import React, { useEffect, useRef, useState } from "react";
import { Icons } from "@/icons";
import { Input, Button } from "@heroui/react";

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
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [generoSeleccionado, setGeneroSeleccionado] = useState<string[]>([]);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setMenuAbierto(false);
        setSubmenuAbierto(false);
      }
    };

    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  return (
    <div className="flex w-full mt-8 z-40">
      <div className="bg-primary dark:bg-primary w-full h-[8vh] flex flex-row justify-start items-center px-4">
        <div className="flex flex-row gap-4 w-full items-center pl-12">
          <div className="relative inline-block">
            <Button
              variant="bordered"
              className="border-none text-primary-foreground dark:text-primary-foreground font-light text-xl"
              onPress={() => setMenuAbierto(!menuAbierto)}
            >
              <span
                className="text-primary-foreground dark:text-primary-foreground transition-colors"
                dangerouslySetInnerHTML={{
                  __html: Icons.filter.replace(
                    /<svg /,
                    '<svg fill="currentColor" '
                  ),
                }}
                style={{
                  width: "1.2em",
                  height: "1.2em",
                }}
              />
              Filtrar
            </Button>
            {/* Menú principal */}
            {menuAbierto && (
              <div className="absolute z-50 flex w-max p-2 text-[#634AE2] text-lg">
                <div className="flex flex-col w-[17rem] bg-white shadow-lg rounded-xl grow-0 py-1">
                  <MenuItem
                    text="Género"
                    onClick={() => setSubmenuAbierto(!submenuAbierto)}
                  />
                  <MenuItem text="Edad" />
                  <MenuItem text="Fecha de creación" />
                  <MenuItem text="Fecha de ultima cita" />
                </div>
                {/* Submenú de género */}
                {submenuAbierto && (
                  <div className=" w-64 bg-white  shadow-xl rounded-xl p-4 pt-2 ">
                    <h3 className="mb-1 text-[#634AE2] pl-10 text-lg">
                      Género
                    </h3>
                    <div className="flex flex-col text-sm pl-10 text-gray-600">
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
                                  generoSeleccionado.filter(
                                    (item) => item !== opcion
                                  )
                                );
                              }
                            }}
                            className="appearance-none w-4 h-4 rounded-full border-2 border-[#634AE2] checked:bg-[#634AE2] checked:border-[#634AE2] mr-2"
                          />
                          {opcion}
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button
                        size="sm"
                        className="bg-[#E7E7FF] text-[#634AE2] text-md font-light rounded-2xl"
                        onPress={() => {
                          console.log("Filtro aplicado:", generoSeleccionado);
                          setSubmenuAbierto(false);
                        }}
                      >
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setGeneroSeleccionado([]);
                          setSubmenuAbierto(false);
                        }}
                        className="border-[#8888E0] border-1 text-[#634AE2] text-md font-light rounded-2xl"
                      >
                        Borrar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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

interface MenuItemProps {
  text: string;
  onClick?: () => void;
}
const MenuItem = ({ text, onClick }: MenuItemProps) => {
  return (
    <button
      className="group flex justify-between items-center px-4 py-1 hover:bg-[#9494F3] hover:text-white rounded-xl mx-1 cursor-pointer text-left"
      onClick={onClick}
    >
      {text}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-[#6C4DFF] group-hover:stroke-white"
      >
        <path
          d="M9 6L15 12L9 18"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
