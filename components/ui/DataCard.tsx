import React, { ReactNode } from "react";

type InfoItem = {
  label: string;
  value: string;
};

interface Props {
  paciente: {
    nombre: string;
    codigo: string;
  };
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  info?: InfoItem[];
  children?: ReactNode;
}

const DataCard = ({ onEdit, onDelete, paciente, info, children, onClick}: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 cursor-pointer hover:bg-[#2e2e31] p-6" onClick={onClick}>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-foreground">
            {paciente.nombre}
          </h3>
          <p className="text-sm text-gray-500 dark:text-muted-foreground">
            Código: {paciente.codigo}
          </p>
        </div>
      </div>
      {info && (
        <div className="space-y-3 mb-4 px-6">
          {info.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">{item.label}:</span>
              <span className="text-sm text-gray-900 dark:text-foreground text-right max-w-[200px]">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-around gap-2 pt-4 border-t border-gray-200 dark:border-border">
        {children}
        <button
          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
          onClick={onEdit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="currentColor"
            className="text-primary dark:text-[#bbbafe]"
          >
            <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 30.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
          </svg>
          <span className="text-xs text-primary dark:text-[#bbbafe] mt-1">
            Editar
          </span>
        </button>
        <button
          onClick={onDelete}
          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#B158FF"
          >
            <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
          </svg>
          <span className="text-xs text-[#B158FF] mt-1">Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default DataCard;
