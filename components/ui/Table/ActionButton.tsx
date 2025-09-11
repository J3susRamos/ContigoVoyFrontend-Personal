import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  status?: 'habilitados' | 'deshabilitados'; // Nueva prop
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className = "",
  status = 'deshabilitados' // Valor por defecto
}) => {
  
  // Determinar colores basados en el status
  const colorStyles = status === 'deshabilitados' 
    ? 'text-green-600 dark:text-green-400'  // Verde para deshabilitados
    : 'text-red-600 dark:text-red-400';      // Rojo para habilitados



  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors ${className}`}
    >
      <Icon className={`${colorStyles}`} size={30} />
      <span className={`font-light text-sm ${colorStyles}`}>{label}</span>
    </button>
  );
};