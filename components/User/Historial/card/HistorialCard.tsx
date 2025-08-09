import React from "react";
import { PatientHeader } from "../patientCard/PatientHeader";
import { PatientInfo } from "../patientCard/PatientInfo";
import { HistorialCardProps } from "../types/types";
import ActionButton from "../buttons/ActionButton";
import ActionButtons from "../buttons/ActionButtons";

export const HistorialCard: React.FC<HistorialCardProps> = ({
  onEdit,
  onDelete,
  paciente,
  info,
  children,
  onClick,
  className = ""
}) => {
  const hasInfo = info && info.length > 0;

  return (
    <div className={`
      bg-white dark:bg-gray-900 
      rounded-xl sm:rounded-2xl 
      shadow-sm hover:shadow-lg dark:shadow-gray-900/20 
      border border-gray-200 dark:border-gray-700
      transition-all duration-300 
      overflow-hidden
      group
      ${className}
    `}>
      <PatientHeader paciente={paciente} onClick={onClick} />

      {hasInfo && <PatientInfo info={info} />}

      <ActionButtons onEdit={onEdit} onDelete={onDelete}>
        {children}
      </ActionButtons>
    </div>
  );
};

export default HistorialCard;