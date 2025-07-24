"use client";

import React, { ReactNode } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface RowProps {
  values: string[];
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
  showActions?: boolean;
}

const Row: React.FC<RowProps> = ({
  values,
  onClick,
  onDelete,
  onEdit,
  children,
  showActions = true
}) => {
  return (
    <>
      <td className="pl-9 py-4 text-2xl rounded-l-[27px]" onClick={onClick}>
        ●
      </td>
      {values.map((item, index) => (
        <td key={index} className="px-2 py-4" onClick={onClick}>
          {item}
        </td>
      ))}
      <td className="py-4 pr-5 rounded-r-[27px]">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-row items-center justify-center gap-x-4">
            {children}
            {showActions && (
              <>
                {onEdit && (
                  <ActionButton
                    icon={Edit3}
                    label="Editar"
                    onClick={onEdit}
                  />
                )}
                {onDelete && (
                  <ActionButton
                    icon={Trash2}
                    label="Eliminar"
                    onClick={onDelete}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </td>
    </>
  );
};

export default Row;