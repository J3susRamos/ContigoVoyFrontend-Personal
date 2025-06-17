import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Icons } from "@/icons";
import { Input } from "@heroui/react";
import { DayPicker, DateRange, MonthCaptionProps } from "react-day-picker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Filters } from "@/app/user/citas/page";
import { FilterMenu } from "@/components/ui/Filters/FilterMenu";
import FilterButton from "@/components/ui/Filters/FilterButton";
import FilterSubMenu from "@/components/ui/Filters/FilterSubMenu";

interface NavbarProps {
  filterValue: string;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  onSearchChange: (value?: string) => void;
  onClear: () => void;
  visibleColumns: Set<string>;
  setVisibleColumns: (columns: Set<string>) => void;
  columns: { name: string; uid: string; sortable?: boolean }[];
  onAddNew: () => void;
}

type SubmenusState = {
  genero: boolean;
  estado: boolean;
  fechaInicio: boolean;
  edad: boolean;
};

const SubmenusInitialState: SubmenusState = {
  genero: false,
  estado: false,
  fechaInicio: false,
  edad: false,
};

export const Navbar: React.FC<NavbarProps> = ({
  filterValue,
  filters,
  setFilters,
  onSearchChange,
  onClear,
  onAddNew,
}) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  // const [generoSeleccionado, setGeneroSeleccionado] = useState<string[]>([]);
  // const [edadSeleccionada, setEdadSeleccionada] = useState<string[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string[]>([]);
  const [mesActual, setMesActual] = useState(new Date());
  const [submenus, setSubmenus] = useState(SubmenusInitialState);


  const [rangoFecha, setRangoFecha] = useState<DateRange | undefined>();

  // Para aplicar filtro luego:
  const filtrarPorFecha = () => {
    if (rangoFecha?.from && rangoFecha?.to) {
      const desde = rangoFecha.from.toISOString().split("T")[0]; // yyyy-mm-dd
      const hasta = rangoFecha.to.toISOString().split("T")[0];
      console.log("Filtrando desde:", desde, "hasta:", hasta);

      setFilters((prev) => ({
        ...prev,
        fechaInicio: [desde, hasta],
      }));
    }
  };

  useEffect(() => {
    setSubmenus({
      genero: false,
      edad: false,
      estado: false,
      fechaInicio: false,
    });
  }, [filters, menuAbierto]);

  return (
    <div className="flex w-full mt-8 z-40">
      <div className="bg-primary dark:bg-primary w-full h-[8vh] flex justify-start items-center px-4">
        <div className="flex gap-4 w-full items-center pl-12">
          <FilterButton
            menuOpen={menuAbierto}
            setMenuOpen={setMenuAbierto}
            >
            <FilterMenu
              setSubmenus={setSubmenus}
              maxHeight="5rem"
              menuItems={[
                {
                  text: "Estado",
                  key: "estado",
                },
                {
                  text: "Fecha de inicio",
                  key: "fechaInicio",
                },
              ]}
              />
              {/* Submenú de género */}
              {/* <FilterSubMenu
                titulo="Género"
                isOpen={submenus.genero}
                onPressAceptar={() => {
                  setFilters((prev) => ({
                    ...prev,
                    genero: generoSeleccionado,
                  }));
                }}
                onPressBorrar={() => {
                  setGeneroSeleccionado([]);
                  setFilters((prev) => ({
                    ...prev,
                    genero: [],
                  }));
                }}
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
              </FilterSubMenu> */}

              {/* Submenú de edad */}
              {/* <FilterSubMenu
                titulo="Edad"
                isOpen={submenus.edad}
                onPressAceptar={() => {
                  setFilters((prev) => ({
                    ...prev,
                    edad: edadSeleccionada,
                  }));
                }}
                onPressBorrar={() => {
                  setEdadSeleccionada([]);
                  setFilters((prev) => ({
                    ...prev,
                    edad: [],
                  }));
                }}
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
              </FilterSubMenu> */}

              {/* Submenú de estado */}
              <FilterSubMenu
                titulo="Estado"
                isOpen={submenus.estado}
                onPressAceptar={() => {
                  setFilters((prev) => ({
                    ...prev,
                    estado: estadoSeleccionado,
                  }));
                }}
                onPressBorrar={() => {
                  setEstadoSeleccionado([]);
                  setFilters((prev) => ({
                    ...prev,
                    estado: [],
                  }));
                }}
              >
                <div className="flex flex-col text-sm pl-10">
                  {["Confirmada", "Completada", "Pendiente", "Cancelada"].map(
                    (opcion) => (
                      <label
                        key={opcion}
                        className="text-[#634AE2] text-lg flex items-center gap-4"
                      >
                        <input
                          type="checkbox"
                          name="genero"
                          value={opcion}
                          checked={estadoSeleccionado.includes(opcion)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEstadoSeleccionado([
                                ...estadoSeleccionado,
                                opcion,
                              ]);
                            } else {
                              setEstadoSeleccionado(
                                estadoSeleccionado.filter(
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

              {/* Submenú de fecha de inicio */}
              <FilterSubMenu
                titulo="Fecha de Inicio"
                isOpen={submenus.fechaInicio}
                onPressAceptar={() => {
                  filtrarPorFecha();
                }}
                onPressBorrar={() => {
                  setRangoFecha(undefined);
                  setFilters((prev) => ({
                    ...prev,
                    fechaInicio: [],
                  }));
                }}
              >
                <DayPicker
                  mode="range"
                  selected={rangoFecha}
                  onSelect={setRangoFecha}
                  numberOfMonths={1}
                  weekStartsOn={1}
                  locale={es}
                  month={mesActual}
                  onMonthChange={setMesActual}
                  hideNavigation
                  formatters={{
                    formatWeekdayName: customWeekdayFormatter,
                  }}
                  components={{
                    MonthCaption: (props) => (
                      <CustomCaption {...props} setMesActual={setMesActual} />
                    ),
                  }}
                  modifiersClassNames={{
                    selected: "bg-[#E7E7FF]",
                    range_start: "rounded-l-full",
                    range_end: "rounded-r-full",
                    today: "font-light underline",
                  }}
                  className="w-full"
                  classNames={{
                    months: "flex justify-center w-full",
                    month: "w-full",
                    weekday: "font-normal",
                    day: "px-1 text-center font-normal py-0",
                    month_grid: "w-full",
                  }}
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

const customWeekdayFormatter = (date: Date) =>
  format(date, "EEEEE", { locale: es }).toUpperCase();

type CustomCaptionProps = MonthCaptionProps & {
  setMesActual: React.Dispatch<React.SetStateAction<Date>>;
};
const CustomCaption: React.FC<CustomCaptionProps> = ({
  calendarMonth,
  setMesActual,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) =>
    es.localize.month(i as unknown as Parameters<typeof es.localize.month>[0], {
      width: "wide",
    })
  );

  return (
    <div className="grid grid-cols-[1fr_5rem] gap-2 mb-2">
      <select
        className="rounded-full px-1 py-1 bg-[#ECECFF] text-[#634AE2] focus:outline-none"
        value={calendarMonth.date.getMonth()}
        onChange={(e) =>
          setMesActual(
            new Date(calendarMonth.date.getFullYear(), Number(e.target.value))
          )
        }
      >
        {months.map((month, idx) => (
          <option key={month} value={idx}>
            {month.charAt(0).toUpperCase() + month.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="rounded-full px-2 py-1 bg-[#ECECFF] text-[#634AE2] focus:outline-none"
        value={calendarMonth.date.getFullYear()}
        onChange={(e) =>
          setMesActual(
            new Date(Number(e.target.value), calendarMonth.date.getMonth())
          )
        }
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
