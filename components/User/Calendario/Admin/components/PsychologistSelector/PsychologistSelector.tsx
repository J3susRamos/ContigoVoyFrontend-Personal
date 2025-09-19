"use client";

import { Psicologo } from "../../interfaces/types";

interface PsychologistSelectorProps {
  psychologists: Psicologo[];
  selectedPsychologist: string;
  onPsychologistChange: (psychologistId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function PsychologistSelector({
  psychologists,
  selectedPsychologist,
  onPsychologistChange,
  isLoading,
  error,
  onRetry,
}: PsychologistSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-purple-600 dark:text-blue-400 text-sm font-medium mb-2">
        Seleccionar Psicólogo
      </label>

      {error && (
        <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/50 rounded text-red-600 dark:text-red-400 text-sm">
          <p>Error al cargar psicólogos: {error}</p>
          <button
            onClick={onRetry}
            className="mt-1 text-xs text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <select
        className="w-full bg-white dark:bg-transparent border border-purple-600 dark:border-blue-400 text-gray-800 dark:text-blue-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all"
        value={selectedPsychologist}
        onChange={(e) => onPsychologistChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-blue-400">
          {isLoading ? "Cargando..." : "Selecciona un psicólogo"}
        </option>
        {psychologists.map((psi) => (
          <option
            key={psi.idPsicologo}
            value={psi.idPsicologo}
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-blue-400"
          >
            {psi.nombre} {psi.apellido}
          </option>
        ))}
      </select>
    </div>
  );
}