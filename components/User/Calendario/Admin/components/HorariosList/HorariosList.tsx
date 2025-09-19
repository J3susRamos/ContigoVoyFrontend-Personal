"use client";

import { Horario, Psicologo } from "../../interfaces/types";

interface HorariosListProps {
  horarios: Horario[];
  psychologists: Psicologo[];
  selectedPsychologist: string;
  loading: boolean;
  error: string | null;
  showResults: boolean;
  onRetry: () => void;
}

export default function HorariosList({
  horarios,
  psychologists,
  selectedPsychologist,
  loading,
  error,
  showResults,
  onRetry,
}: HorariosListProps) {
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    } catch {
      return time;
    }
  };

  const formatDate = (date: string) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

const getStatusColor = (estado: string) => {
  switch (estado) {
    case "disponible":
      return "border-[#D1D1F0] dark:border-[#A5A5E0] bg-[#F5F5FF] dark:bg-[#3D3D6B]/30"; // Gris morado pastel
    case "ocupado":
      return "border-[#E8B8F6] dark:border-[#D695E6] bg-[#FBF0FF] dark:bg-[#4F2D59]/30"; // Morado lila pastel
    case "bloqueado":
      return "border-[#9797F6] dark:border-[#7A7AE6] bg-[#F0F0FF] dark:bg-[#2D2D4F]/30"; // Morado pastel #9797F6
    default:
      return "border-[#E5E5E5] dark:border-[#A0A0A0] bg-[#F8F8F8] dark:bg-[#333333]/30"; // Gris pastel neutro
  }
};

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "Disponible";
      case "ocupado":
        return "Ocupado";
      case "bloqueado":
        return "Bloqueado";
      default:
        return estado || "Sin estado";
    }
  };

  const selectedPsychologistData = selectedPsychologist
    ? psychologists.find(
        (p) => p.idPsicologo.toString() === selectedPsychologist,
      )
    : null;

  if (loading) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-6 flex items-center justify-center">
        <div className="flex items-center justify-center h-40">
          <div className="text-blue-600 dark:text-blue-400 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p>Cargando horarios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-6 flex items-center justify-center">
        <div className="text-center w-full">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="text-lg font-medium">Error al cargar horarios</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!showResults) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-6 flex items-center justify-center">
        <div className="text-center w-full">
          <div className="text-gray-600 dark:text-gray-400 mb-6">
            <h3 className="text-lg font-medium mb-2">Consulta de Horarios</h3>
            <p className="text-sm">
              Selecciona un psicólogo y rango de fechas, luego presiona
              &quot;OBTENER HORARIOS&quot;
            </p>
          </div>

          {/* Información de selección actual */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mt-6 mx-auto max-w-md">
            <h4 className="text-purple-600 dark:text-blue-400 font-medium mb-2">
              Selección Actual:
            </h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <strong>Psicólogo:</strong>{" "}
                {selectedPsychologistData
                  ? `${selectedPsychologistData.nombre} ${selectedPsychologistData.apellido}`
                  : selectedPsychologist || "No seleccionado"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-purple-600 dark:text-blue-400 text-lg font-medium">
          Horarios Encontrados
        </h3>
        <button
          onClick={onRetry}
          className="text-sm text-purple-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
        >
          Actualizar
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {horarios.length > 0 ? (
          <div className="space-y-3">
            {horarios.map((horario, index) => (
              <div
                key={horario.id || index}
                className={`p-4 rounded border-l-4 ${getStatusColor(
                  horario.estado || "disponible",
                )}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-purple-700 dark:text-blue-300 font-medium mb-1">
                      {formatDate(horario.fecha)}
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>
                        <span className="text-gray-500 dark:text-gray-400">Horario:</span>{" "}
                        {formatTime(horario.horaInicio)} -{" "}
                        {formatTime(horario.horaFin)}
                      </p>
                      <p>
                        <span className="text-gray-500 dark:text-gray-400">Estado:</span>{" "}
                        <span
                          className={
                            horario.estado === "disponible"
                              ? "text-green-600 dark:text-green-400"
                              : horario.estado === "ocupado"
                                ? "text-red-600 dark:text-red-400"
                                : "text-yellow-600 dark:text-yellow-400"
                          }
                        >
                          {getStatusText(horario.estado || "disponible")}
                        </span>
                      </p>
                      {horario.paciente && (
                        <p>
                          <span className="text-gray-500 dark:text-gray-400">Paciente:</span>{" "}
                          {horario.paciente}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {horario.motivo && (
                  <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Motivo:</span>{" "}
                    {horario.motivo}
                  </div>
                )}

                {horario.notas && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Notas:</span>{" "}
                    {horario.notas}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron horarios para los criterios seleccionados
            </p>
          </div>
        )}
      </div>

      {showResults && (
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Total encontrados: {horarios.length} horarios
          </p>
        </div>
      )}
    </div>
  );
}