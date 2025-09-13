import React from 'react';
import { LucideIcon } from 'lucide-react';
import { es } from 'date-fns/locale';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  llave?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className = "",
  llave,
}) => {

  let estilos = "";

  if (llave === undefined) {
    estilos = "text-primary dark:text-[#bbbafe]";
  } else if (!llave) {
    estilos = "text-red-600 dark:text-red-400";      // Rojo para habilitados
  } else {
    estilos = "text-green-600 dark:text-green-400";  // Verde para deshabilitados
  }
  


  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors ${className}`}
    >
      <Icon className={`${estilos}`} size={30} />
      <span className={`font-light text-sm ${estilos}`}>{label}</span>
    </button>
  );
};