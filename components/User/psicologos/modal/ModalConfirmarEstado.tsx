"use client";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import React from "react";
import { useModalConfirmar } from "../hooks/useModalConfirmar";

interface ModalConfirmarEstadoProps {
  isOpen: boolean;
  onClose: () => void;
  estadoId: number | null;
  filterStatus: 'activos' | 'inactivos';
  refreshData: () => void;
}

const ModalConfirmarEstado: React.FC<ModalConfirmarEstadoProps> = ({
  isOpen,
  onClose,
  estadoId,
  filterStatus,
  refreshData,
}) => {
  const { confirmEstado } = useModalConfirmar(refreshData);

  const handleConfirm = async () => {
    const success = await confirmEstado(estadoId, filterStatus);
    if (success) {
      onClose();
    }
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      message={`¿Estás seguro de ${filterStatus === 'inactivos' ? 'activar' : 'desactivar'} este psicólogo?`}
      filterStatus={filterStatus}
    />
  );
};

export default ModalConfirmarEstado; 