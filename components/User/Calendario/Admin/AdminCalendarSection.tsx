"use client";

import { useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { CalendarDate } from "@internationalized/date";
import { usePsicoCalendar, useHorarios } from "./hooks";
import { DateRange } from "./interfaces/types";
import {
  PsychologistSelector,
  DateRangePicker,
  HorariosList,
} from "./components";

export default function AdminCalendarSection() {
  const [selectedPsychologist, setSelectedPsychologist] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Usar el hook personalizado para obtener psicólogos
  const {
    psychologists,
    loading: isLoadingPsychologists,
    error: psychologistsError,
    refetchPsychologists,
  } = usePsicoCalendar();

  // Preparar parámetros para el hook de horarios
  const startDateString = dateRange.start ? dateRange.start.toString() : "";
  const endDateString = dateRange.end ? dateRange.end.toString() : "";
  const idPsicologo = selectedPsychologist ? parseInt(selectedPsychologist) : 0;

  // Usar el hook personalizado para obtener horarios
  const {
    horarios,
    loadingHorarios,
    error: horariosError,
    refetchHorarios,
  } = useHorarios({
    idPsicologo,
    startDateString,
    endDateString,
  });

  const handleStartDateChange = (date: CalendarDate | null) => {
    setDateRange((prev) => ({ ...prev, start: date }));
    if (date && !isSelectingEndDate) {
      setIsSelectingEndDate(true);
    }
    setShowResults(false);
  };

  const handleEndDateChange = (date: CalendarDate | null) => {
    setDateRange((prev) => ({ ...prev, end: date }));
    setIsSelectingEndDate(false);
    setShowResults(false);
  };

  const clearDateRange = () => {
    setDateRange({ start: null, end: null });
    setIsSelectingEndDate(false);
    setShowResults(false);
  };

  const handlePsychologistChange = (psychologistId: string) => {
    setSelectedPsychologist(psychologistId);
    setShowResults(false);
  };

 // En AdminCalendarSection.tsx - modificar handleObtenerHorarios
const handleObtenerHorarios = async () => {
  if (dateRange.start && dateRange.end) {
    const start = new Date(dateRange.start.toString());
    const end = new Date(dateRange.end.toString());
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 31) {
      // No mostrar alert, el mensaje ya está visible en el DateRangePicker
      return;
    }
  }
  
  if (selectedPsychologist && dateRange.start && dateRange.end) {
    setShowResults(true);
    await refetchHorarios();
  } else {
    alert("Por favor selecciona un psicólogo y un rango de fechas válido");
  }
};

  const canFetchHorarios = () => {
    return (
      selectedPsychologist &&
      dateRange.start &&
      dateRange.end &&
      !isLoadingPsychologists &&
      !loadingHorarios
    );
  };

  return (
    <div className="bg-white dark:bg-background min-h-screen flex flex-col">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full mt-6 md:mt-10 mb-4 md:mb-6 px-4 md:px-8 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <h1 className="font-bold text-2xl md:text-[32px] leading-7 md:leading-[40px] text-purple-600 dark:text-title">
            Calendario de Horarios
          </h1>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-end">
          <CerrarSesion />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-4 md:px-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 md:p-6 rounded-lg max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Panel de controles izquierdo */}
            <div className="flex flex-col items-center space-y-6 lg:w-80">
              {/* Selector de psicólogo */}
              <PsychologistSelector
                psychologists={psychologists}
                selectedPsychologist={selectedPsychologist}
                onPsychologistChange={handlePsychologistChange}
                isLoading={isLoadingPsychologists}
                error={psychologistsError}
                onRetry={refetchPsychologists}
              />

              {/* Selector de rango de fechas */}
              <DateRangePicker
                dateRange={dateRange}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onClearDateRange={clearDateRange}
                isSelectingEndDate={isSelectingEndDate}
              />

              {/* Botón para obtener horarios */}
              <div className="w-full">
                <button
                  onClick={handleObtenerHorarios}
                  disabled={!canFetchHorarios()}
                  className="w-full border border-purple-600 dark:border-blue-400 text-purple-600 dark:text-blue-400 px-6 py-3 rounded hover:bg-purple-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingHorarios ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Cargando...
                    </div>
                  ) : (
                    "OBTENER HORARIOS"
                  )}
                </button>
              </div>

              {/* Información adicional */}
              <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-4">
                <h4 className="text-purple-600 dark:text-blue-400 font-medium mb-2">Información</h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p>• Selecciona un psicólogo de la lista</p>
                  <p>• Elige el rango de fechas</p>
                  <p>• Presiona el botón para ver los horarios</p>
                  <p>• Los horarios se muestran con su disponibilidad</p>
                </div>
              </div>
            </div>

            {/* Panel de resultados derecho */}
            <HorariosList
              horarios={horarios}
              psychologists={psychologists}
              selectedPsychologist={selectedPsychologist}
              loading={loadingHorarios}
              error={horariosError}
              showResults={showResults}
              onRetry={refetchHorarios}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
