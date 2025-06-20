import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateRange, DayPicker, MonthCaptionProps } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
    fechaSeleccionada: [string, string] | string[];
    setFechaSeleccionada: Dispatch<SetStateAction<[string, string] | string[]>>;
}

const FilterCalendar = ({ setFechaSeleccionada, fechaSeleccionada }: Props) => {
  const [mesActual, setMesActual] = useState(new Date());
  
  const convertirArrayAFecha = (fechas: [string, string] | string[]): DateRange | undefined => {
    if (!Array.isArray(fechas)) return undefined;
    if (fechas.length < 2) return undefined;
    const desdeStr = fechas[0];
    const hastaStr = fechas[1];
  
    if (!desdeStr || !hastaStr) return undefined;
  
    // Forzar fechas locales
    const crearFechaLocal = (str: string) => {
      const [year, month, day] = str.split("-").map(Number);
      return new Date(year, month - 1, day);
    };
  
    const desde = crearFechaLocal(desdeStr);
    const hasta = crearFechaLocal(hastaStr);
  
    if (isNaN(desde.getTime()) || isNaN(hasta.getTime())) return undefined;
    console.log({
        from: desde,
        to: hasta,
      });
    
  
    return {
      from: desde,
      to: hasta,
    };
  };

  const [rangoFecha, setRangoFecha] = useState<DateRange | undefined>(
    convertirArrayAFecha(fechaSeleccionada)
  );

  useEffect(() => {
    if (rangoFecha?.from && rangoFecha?.to) {
        try {
          const desde = new Date(rangoFecha.from).toISOString().split("T")[0];
          const hasta = new Date(rangoFecha.to).toISOString().split("T")[0];
          setFechaSeleccionada([desde, hasta]);
          console.log([desde, hasta]);
          
        } catch (error) {
          console.error("Error al convertir fechas:", error);
        }
      }
  }, [rangoFecha, setFechaSeleccionada]);


  return (
    <>
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
    </>
  );
};

export default FilterCalendar;

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
