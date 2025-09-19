"use client";

import { DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { DateRange } from "../../interfaces/types";
import { useState, useEffect } from "react"; // ← Agregar estos imports

interface DateRangePickerProps {
  dateRange: DateRange;
  onStartDateChange: (date: CalendarDate | null) => void;
  onEndDateChange: (date: CalendarDate | null) => void;
  onClearDateRange: () => void;
  isSelectingEndDate: boolean;
}

export default function DateRangePicker({
  dateRange,
  onStartDateChange,
  onEndDateChange,
  onClearDateRange,
  isSelectingEndDate,
}: DateRangePickerProps) {
  const [rangeError, setRangeError] = useState<string>(""); // ← Estado para el error

  // Función para calcular días entre fechas
  const calculateDaysDifference = (start: CalendarDate | null, end: CalendarDate | null): number => {
    if (!start || !end) return 0;
    
    const startDate = new Date(start.toString());
    const endDate = new Date(end.toString());
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Función para obtener fecha máxima (31 días desde start)
  const getMaxEndDate = (startDate: CalendarDate | null): CalendarDate | undefined => {
    if (!startDate) return undefined;
    return startDate.add({ days: 31 });
  };

  // Validar el rango cuando cambien las fechas
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const daysDifference = calculateDaysDifference(dateRange.start, dateRange.end);
      
      if (daysDifference > 31) {
        setRangeError("El período máximo para seleccionar es de 31 días");
      } else {
        setRangeError("");
      }
    } else {
      setRangeError("");
    }
  }, [dateRange.start, dateRange.end]);

  const formatDateRange = () => {
    if (dateRange.start && dateRange.end) {
      const startDate = dateRange.start.toString();
      const endDate = dateRange.end.toString();
      return `${startDate} - ${endDate}`;
    } else if (dateRange.start) {
      return `Desde: ${dateRange.start.toString()}`;
    }
    return "Selecciona un rango de fechas";
  };

  return (
    <div className="w-full">
      <label className="block text-purple-600 dark:text-blue-400 text-sm font-medium mb-2">
        Rango de Fechas
      </label>

      {/* Mostrar rango seleccionado */}
      <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">{formatDateRange()}</span>
          {(dateRange.start || dateRange.end) && (
            <button
              onClick={onClearDateRange}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs ml-2"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Selectores de fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Fecha inicio
          </label>
          <DatePicker
            value={dateRange.start}
            onChange={onStartDateChange}
            aria-label="Fecha de inicio"
            classNames={{
              inputWrapper:
                "px-3 py-2 text-sm bg-white dark:bg-transparent border border-blue-600 dark:border-blue-400/50 rounded focus:border-blue-600 dark:focus:border-blue-400",
              input: "text-gray-800 dark:text-blue-400 placeholder:text-gray-500 dark:placeholder:text-blue-400/50",
              segment: "text-gray-800 dark:text-blue-400",
            }}
            calendarProps={{
              classNames: {
                base: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
                headerWrapper: "bg-gray-100 dark:bg-gray-700",
                gridHeader: "bg-gray-100 dark:bg-gray-700",
                cell: "text-gray-800 dark:text-blue-400",
              },
            }}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Fecha fin
          </label>
          <DatePicker
            value={dateRange.end}
            onChange={onEndDateChange}
            aria-label="Fecha de fin"
            minValue={dateRange.start || undefined}
            maxValue={getMaxEndDate(dateRange.start)} // ← Limitar a 31 días
            classNames={{
              inputWrapper:
                "px-3 py-2 text-sm bg-white dark:bg-transparent border border-blue-600 dark:border-blue-400/50 rounded focus:border-blue-600 dark:focus:border-blue-400",
              input: "text-gray-800 dark:text-blue-400 placeholder:text-gray-500 dark:placeholder:text-blue-400/50",
              segment: "text-gray-800 dark:text-blue-400",
            }}
            calendarProps={{
              classNames: {
                base: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
                headerWrapper: "bg-gray-100 dark:bg-gray-700",
                gridHeader: "bg-gray-100 dark:bg-gray-700",
                cell: "text-gray-800 dark:text-blue-400",
              },
            }}
          />
        </div>
      </div>

      {/* Mensaje de error en rojo */}
      {rangeError && (
        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/50 rounded text-red-600 dark:text-red-400 text-xs font-medium">
          ⚠️ {rangeError}
        </div>
      )}

      {/* Indicador visual del estado de selección */}
      {isSelectingEndDate && dateRange.start && !dateRange.end && (
        <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 border border-purple-300 dark:border-blue-500/50 rounded text-purple-600 dark:text-blue-400 text-xs">
          Ahora selecciona la fecha de fin
        </div>
      )}
    </div>
  );
}