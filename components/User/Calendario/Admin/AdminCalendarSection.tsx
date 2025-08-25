"use client";

import { useState, useEffect } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { DatePicker } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}

interface Psicologo {
  id: string;
  nombre: string;
}

export default function AdminCalendarSection() {
  const [selectedPsychologist, setSelectedPsychologist] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [psychologists, setPsychologists] = useState<Psicologo[]>([]);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
  const [filteredCitas, setFilteredCitas] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Obtener psicólogos desde la API
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const cookies = document.cookie.split(";").reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

        const sessionToken = cookies["session"];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/lista`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.result)) {
            const psicologosList = data.result.map((psi: any) => ({
              id: psi.idPsicologo || psi.id,
              nombre: psi.nombre || `${psi.nombres} ${psi.apellidos}`,
            }));
            setPsychologists(psicologosList);
          }
        } else {
          // Fallback: extraer de citas existentes
          if (citas && citas.length > 0) {
            const uniquePsychologists = Array.from(
              new Map(
                citas
                  .filter((cita) => cita.idPsicologo)
                  .map((cita) => [
                    cita.idPsicologo,
                    {
                      id: cita.idPsicologo,
                      nombre: `Psicólogo ${cita.idPsicologo}`,
                    },
                  ]),
              ).values(),
            );
            setPsychologists(uniquePsychologists);
          }
        }
      } catch (error) {
        console.error("Error fetching psychologists:", error);
        // Fallback: extraer de citas existentes
        if (citas && citas.length > 0) {
          const uniquePsychologists = Array.from(
            new Map(
              citas
                .filter((cita) => cita.idPsicologo)
                .map((cita) => [
                  cita.idPsicologo,
                  {
                    id: cita.idPsicologo,
                    nombre: `Psicólogo ${cita.idPsicologo}`,
                  },
                ]),
            ).values(),
          );
          setPsychologists(uniquePsychologists);
        }
      }
    };

    fetchPsychologists();
  }, []);

  const handleStartDateChange = (date: CalendarDate | null) => {
    setDateRange((prev) => ({ ...prev, start: date }));
    if (date && !isSelectingEndDate) {
      setIsSelectingEndDate(true);
    }
  };

  const handleEndDateChange = (date: CalendarDate | null) => {
    setDateRange((prev) => ({ ...prev, end: date }));
    setIsSelectingEndDate(false);
  };

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

  const clearDateRange = () => {
    setDateRange({ start: null, end: null });
    setIsSelectingEndDate(false);
  };

  const handleObtenerCitas = () => {
    if (selectedPsychologist && dateRange.start && dateRange.end) {
      const startDateString = dateRange.start.toString();
      const endDateString = dateRange.end.toString();

      // Filtrar citas por psicólogo y rango de fechas
      const filtered = citas.filter((cita) => {
        const citaDate = new Date(cita.fecha_inicio);
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        return (
          cita.idPsicologo === selectedPsychologist &&
          citaDate >= startDate &&
          citaDate <= endDate
        );
      });

      setFilteredCitas(filtered);
      setShowResults(true);

      console.log("Citas filtradas:", filtered);
    } else {
      alert("Por favor selecciona un psicólogo y un rango de fechas");
    }
  };

  return (
    <div className="bg-background dark:bg-background min-h-screen flex flex-col">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full mt-6 md:mt-10 mb-4 md:mb-6 px-4 md:px-8 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <h1 className="font-bold text-2xl md:text-[32px] leading-7 md:leading-[40px] text-title dark:text-title">
            Calendario de citas
          </h1>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-end">
          <CerrarSesion />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-4 md:px-8">
        <div className="bg-gray-900 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 p-4 md:p-6 rounded-lg max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Panel de controles izquierdo */}
            <div className="flex flex-col items-center space-y-4 lg:w-80">
              {/* Selector de psicólogo */}
              <div className="w-full">
                <label className="block text-blue-400 text-sm font-medium mb-2">
                  Seleccionar Psicólogo
                </label>
                <select
                  className="w-full bg-transparent border border-blue-400 text-blue-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={selectedPsychologist}
                  onChange={(e) => setSelectedPsychologist(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="" className="bg-gray-900 text-blue-400">
                    {isLoading ? "Cargando..." : "Selecciona un psicólogo"}
                  </option>
                  {psychologists.map((psi) => (
                    <option
                      key={psi.id}
                      value={psi.id}
                      className="bg-gray-900 text-blue-400"
                    >
                      {psi.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de rango de fechas */}
              <div className="w-full border border-gray-600 dark:border-gray-700 p-4 rounded-lg bg-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-blue-400 text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Rango de Fechas
                  </h3>
                  {(dateRange.start || dateRange.end) && (
                    <button
                      onClick={clearDateRange}
                      className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Date Pickers */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Fecha inicio
                    </label>
                    <DatePicker
                      value={dateRange.start}
                      onChange={handleStartDateChange}
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
                      onChange={handleEndDateChange}
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

                {/* Mostrar rango seleccionado */}
                <div className="mt-3 p-2 bg-gray-700 rounded text-center">
                  <span className="text-xs text-blue-300">
                    {formatDateRange()}
                  </span>
                </div>
              </div>

              {/* Botón obtener */}
              <button
                onClick={handleObtenerCitas}
                disabled={
                  !selectedPsychologist ||
                  !dateRange.start ||
                  !dateRange.end ||
                  isLoading
                }
                className="w-full border border-blue-400 text-blue-400 px-6 py-2 rounded hover:bg-blue-400 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Cargando..." : "OBTENER CITAS"}
              </button>
            </div>

            {/* Separador vertical */}
            <div className="hidden lg:block w-px bg-gray-600 dark:bg-gray-700"></div>

            {/* Separador horizontal en móvil */}
            <div className="lg:hidden h-px bg-gray-600 dark:bg-gray-700"></div>

            {/* Panel principal derecho */}
            <div className="flex-1 min-h-[320px] lg:min-h-[400px]">
              <div className="border border-blue-400 rounded-lg p-4 h-full bg-gray-800 dark:bg-gray-900">
                {!showResults ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto mb-4 border-2 border-blue-400 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <p className="text-blue-400 text-lg font-medium leading-tight">
                        SE MUESTRA UN GIF
                        <br />
                        MIENTRAS NO SE
                        <br />
                        PRESIONE OBTENER
                      </p>
                      <p className="text-gray-400 text-sm mt-4">
                        Selecciona un psicólogo y rango de fechas, luego
                        presiona "OBTENER CITAS"
                      </p>

                      {/* Información de selección actual */}
                      {(selectedPsychologist || dateRange.start) && (
                        <div className="mt-4 p-3 bg-gray-700 rounded-lg text-left">
                          <h4 className="text-blue-400 text-sm font-medium mb-2">
                            Selección actual:
                          </h4>
                          {selectedPsychologist && (
                            <p className="text-xs text-gray-300 mb-1">
                              <strong>Psicólogo:</strong>{" "}
                              {psychologists.find(
                                (p) => p.id === selectedPsychologist,
                              )?.nombre || selectedPsychologist}
                            </p>
                          )}
                          {dateRange.start && (
                            <p className="text-xs text-gray-300">
                              <strong>Fechas:</strong> {formatDateRange()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-blue-400 text-lg font-medium">
                        Resultados de Citas
                      </h3>
                      <button
                        onClick={() => setShowResults(false)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        ← Volver
                      </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                      {filteredCitas.length > 0 ? (
                        <div className="space-y-3">
                          {filteredCitas.map((cita, index) => (
                            <div
                              key={cita.idCita || index}
                              className="bg-gray-700 p-3 rounded border-l-4 border-blue-400"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-blue-300 font-medium">
                                  {cita.paciente}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    cita.estado === "CONFIRMADA"
                                      ? "bg-green-600 text-green-100"
                                      : cita.estado === "PENDIENTE"
                                        ? "bg-yellow-600 text-yellow-100"
                                        : "bg-red-600 text-red-100"
                                  }`}
                                >
                                  {cita.estado}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                                <div>
                                  <span className="text-gray-400">Fecha:</span>{" "}
                                  {new Date(
                                    cita.fecha_inicio,
                                  ).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="text-gray-400">Hora:</span>{" "}
                                  {new Date(
                                    cita.fecha_inicio,
                                  ).toLocaleTimeString()}
                                </div>
                                <div>
                                  <span className="text-gray-400">
                                    Duración:
                                  </span>{" "}
                                  {cita.duracion}
                                </div>
                                <div>
                                  <span className="text-gray-400">Edad:</span>{" "}
                                  {cita.edad} años
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-300">
                                <span className="text-gray-400">Motivo:</span>{" "}
                                {cita.motivo}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 mt-8">
                          <p>
                            No se encontraron citas para los criterios
                            seleccionados
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-600">
                      <p className="text-sm text-gray-400 text-center">
                        Total encontradas: {filteredCitas.length} citas
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
