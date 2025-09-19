"use client";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import React from "react";
import { useModalConfirmarPacienteAdmin } from "../hooks/useModalConfirmar";
import showToastFunction from "../../../../ToastStyle";
import { pacientesDesactivar } from "@/utils/pacientesCRUD/pacientesDelete";

interface ModalConfirmarPacienteAdminProps {
  isOpen: boolean;
  onClose: () => void;
  estadoId: number;
  refreshData: () => void;
  llave: boolean;
}

const ModalConfirmarPacienteAdmin: React.FC<ModalConfirmarPacienteAdminProps> = ({
  isOpen,
  onClose,
  estadoId,
  refreshData,
  llave,
}) => {
  const { confirmEstado } = useModalConfirmarPacienteAdmin(refreshData);

  const handleConfirm = async (psicologoId: number | null) => {
    if (llave) { 
      const success = await confirmEstado(estadoId, psicologoId);
      if (success) {
        onClose();
      }
    } else {
      try {
      const pacienteData = await pacientesDesactivar(estadoId);

      if (pacienteData.state === 2) {
        showToastFunction("success", "Paciente deshabilitado correctamente");
        await refreshData();
        onClose();
        return true;
      } else {
        const errorMessage =
          pacienteData.state === 1
            ? pacienteData.result.status_message ||
              "Error al deshabilitar. Intenta nuevamente."
            : "Error de conexión. Intenta nuevamente.";
        showToastFunction("error", errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error deshabilitando paciente:", error);
      showToastFunction("error", "Error inesperado al deshabilitar paciente");
      return false;
    }
    }
  };

  return (
    <>
      {llave ? (
        <ConfirmDeleteModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={handleConfirm}
          message={`¿Estás seguro de habilitar este paciente?`}
          filterStatus="deshabilitados"
          showPsicologoSelector={true}
        />
      ) : (
        <ConfirmDeleteModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={handleConfirm}
          message={`¿Estás seguro de deshabilitar este paciente?`}
          filterStatus="habilitados"
          showPsicologoSelector={false}
        />
      )}
    </>
  );
};

export default ModalConfirmarPacienteAdmin;