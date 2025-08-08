"use client";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import React from "react";
import { useModalConfirmarPacienteAdmin } from "../hooks/useModalConfirmar";

interface ModalConfirmarPacienteAdminProps {
  isOpen: boolean;
  onClose: () => void;
  estadoId: number | null;
  refreshData: () => void;
}

const ModalConfirmarPacienteAdmin: React.FC<ModalConfirmarPacienteAdminProps> = ({
  isOpen,
  onClose,
  estadoId,
  refreshData,
}) => {
  const { confirmEstado } = useModalConfirmarPacienteAdmin(refreshData);

  const handleConfirm = async (psicologoId: number | null) => {
    const success = await confirmEstado(estadoId, psicologoId);
    if (success) {
      onClose();
    }
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      message={`¿Estás seguro de habilitar este paciente?`}
      filterStatus="inactivos"
      showPsicologoSelector={true}
    />
  );
};

export default ModalConfirmarPacienteAdmin; 