"use client";

import { DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { DateRange } from "../../interfaces/types";

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
      <label className="block text-blue-400 text-sm font-medium mb-2">
        Rango de Fechas
      </label>

      {/* Mostrar rango seleccionado */}
      <div className="mb-3 p-2 bg-gray-800 border border-gray-600 rounded text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{formatDateRange()}</span>
          {(dateRange.start || dateRange.end) && (
            <button
              onClick={onClearDateRange}
              className="text-red-400 hover:text-red-300 text-xs ml-2"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Selectores de fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Fecha inicio
          </label>
          <DatePicker
            value={dateRange.start}
            onChange={onStartDateChange}
            aria-label="Fecha de inicio"
            classNames={{
              inputWrapper:
                "px-3 py-2 text-sm bg-transparent border border-blue-400/50 rounded focus:border-blue-400",
              input: "text-blue-400 placeholder:text-blue-400/50",
              segment: "text-blue-400",
            }}
            calendarProps={{
              classNames: {
                base: "bg-gray-800 border border-gray-600",
                headerWrapper: "bg-gray-700",
                gridHeader: "bg-gray-700",
                cell: "text-blue-400",
              },
            }}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Fecha fin
          </label>
          <DatePicker
            value={dateRange.end}
            onChange={onEndDateChange}
            aria-label="Fecha de fin"
            minValue={dateRange.start || undefined}
            classNames={{
              inputWrapper:
                "px-3 py-2 text-sm bg-transparent border border-blue-400/50 rounded focus:border-blue-400",
              input: "text-blue-400 placeholder:text-blue-400/50",
              segment: "text-blue-400",
            }}
            calendarProps={{
              classNames: {
                base: "bg-gray-800 border border-gray-600",
                headerWrapper: "bg-gray-700",
                gridHeader: "bg-gray-700",
                cell: "text-blue-400",
              },
            }}
          />
        </div>
      </div>

      {/* Indicador visual del estado de selección */}
      {isSelectingEndDate && dateRange.start && !dateRange.end && (
        <div className="mt-2 p-2 bg-blue-900/30 border border-blue-500/50 rounded text-blue-400 text-xs">
          Ahora selecciona la fecha de fin
        </div>
      )}
    </div>
  );
}
