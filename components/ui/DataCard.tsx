import { Ban } from "lucide-react";
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
  onDisable?: () => void;
  info?: InfoItem[];
  children?: ReactNode;
  llave?: boolean;
}

const DataCard = ({ onEdit, onDisable, paciente, info, children, onClick, llave = false }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 cursor-pointer p-6" onClick={onClick}>
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
          onClick={onDisable}
          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
        >
          <Ban className="text-primary dark:text-[#bbbafe]" size={30} />
          <span className="text-xs text-primary dark:text-[#bbbafe] mt-1">{!llave ? "Deshabilitar" : "Habilitar"}</span>
        </button>
      </div>
    </div>
  );
};

export default DataCard;
