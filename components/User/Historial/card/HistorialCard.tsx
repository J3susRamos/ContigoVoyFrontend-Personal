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
  className?: string;
}

// Componente para el header del paciente
const PatientHeader = ({
  paciente,
  onClick
}: {
  paciente: Props['paciente'];
  onClick?: () => void;
}) => (
  <div
    className={`
      flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 
      ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 rounded-t-xl sm:rounded-t-2xl' : ''}
    `}
    onClick={onClick}
  >
    <div className="min-w-0 flex-1">
      <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-foreground truncate">
        {paciente.nombre}
      </h3>
      <p className="text-sm sm:text-base text-gray-500 dark:text-muted-foreground mt-1">
        Código: <span className="font-medium">{paciente.codigo}</span>
      </p>
    </div>
    {onClick && (
      <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transform transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    )}
  </div>
);

// Componente para la información del paciente
const PatientInfo = ({ info }: { info: InfoItem[] }) => (
  <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4">
    {info.map((item, index) => (
      <div key={index} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
        <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-muted-foreground flex-shrink-0">
          {item.label}:
        </span>
        <span className="text-sm sm:text-base text-gray-900 dark:text-foreground sm:text-right break-words">
          {item.value}
        </span>
      </div>
    ))}
  </div>
);

// Componente para los botones de acción
const ActionButtons = ({
  onEdit,
  onDelete,
  children
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row justify-center sm:justify-around items-center gap-2 sm:gap-4 p-6 border-t border-gray-200 dark:border-gray-700">   

    {/* Botones de acción en mobile como fila, en desktop como columnas */}
    <div className="flex flex-row sm:flex-col lg:flex-row gap-2 sm:gap-4 w-full sm:w-auto justify-center">
      {onEdit && (
        <ActionButton
          onClick={onEdit}
          icon={<EditIcon />}
          label="Editar"
          variant="primary"
        />
      )}

      {children && (
        <div className="w-full sm:w-auto">
          {children}
        </div>
      )}

      {onDelete && (
        <ActionButton
          onClick={onDelete}
          icon={<DeleteIcon />}
          label="Eliminar"
          variant="danger"
        />
      )}
    </div>
  </div>
);

// Componente reutilizable para botones de acción
const ActionButton = ({
  onClick,
  icon,
  label,
  variant = "default"
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: "default" | "primary" | "danger";
}) => {
  const variantClasses = {
    default: "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200",
    primary: "text-primary dark:text-[#bbbafe] hover:text-primary/80 dark:hover:text-[#bbbafe]/80",
    danger: "text-[#B158FF] hover:text-[#B158FF]/80"
  };

  return (
    <button
      className={`
        flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl 
        hover:bg-gray-50 dark:hover:bg-gray-800/50 
        transition-all duration-200 transform hover:scale-105 active:scale-95
        min-w-[80px] sm:min-w-[90px]
        ${variantClasses[variant]}
      `}
      onClick={onClick}
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 mb-1 sm:mb-2">
        {icon}
      </div>
      <span className="text-xs sm:text-sm font-medium">
        {label}
      </span>
    </button>
  );
};

// Iconos optimizados
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 30.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
  </svg>
);

// Componente principal
const HistorialCard = ({
  onEdit,
  onDelete,
  paciente,
  info,
  children,
  onClick,
  className = ""
}: Props) => {
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
      {/* Header del paciente */}
      <PatientHeader paciente={paciente} onClick={onClick} />

      {/* Información del paciente */}
      {info && info.length > 0 && (
        <PatientInfo info={info} />
      )}

      {/* Botones de acción */}
      {(children || onEdit || onDelete) && (
        <ActionButtons onEdit={onEdit} onDelete={onDelete}>
          {children}
        </ActionButtons>
      )}
    </div>
  );
};

export default HistorialCard;