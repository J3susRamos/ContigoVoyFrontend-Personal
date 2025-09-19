import { DeleteIcon, EditIcon } from "lucide-react";
import ActionButton from "./ActionButton";
import { ReactNode } from "react";

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

export default ActionButtons;