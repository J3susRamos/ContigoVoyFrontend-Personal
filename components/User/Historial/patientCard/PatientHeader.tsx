import React from "react";
import { PatientData } from "../types/types";
import { ChevronRightIcon } from "lucide-react";

interface PatientHeaderProps {
  paciente: PatientData;
  onClick?: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ paciente, onClick }) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 
        ${isClickable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 rounded-t-xl sm:rounded-t-2xl' : ''}
      `}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-foreground truncate">
          {paciente.nombre}
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-muted-foreground mt-1">
          Código: <span className="font-medium">{paciente.codigo}</span>
        </p>
      </div>
      {isClickable && (
        <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
          <ChevronRightIcon />
        </div>
      )}
    </div>
  );
};