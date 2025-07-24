import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors ${className}`}
    >
      <Icon className="text-primary dark:text-[#bbbafe]" size={30} />
      <span className="font-light text-sm dark:text-[#bbbafe]">{label}</span>
    </button>
  );
};