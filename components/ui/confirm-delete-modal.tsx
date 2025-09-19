import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from "@heroui/react";
import AdminPacienteFilterSelect from "@/components/User/Pacientes/Admin/filter/AdminPacienteFilterSelect";
import { useState } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (psicologoId: number | null) => void;
  message?: string;
  isProcessing?: boolean;
  filterStatus?: string;
  showPsicologoSelector?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  message = "¿Estás seguro de eliminar este usuario?",
  isProcessing,
  filterStatus,
  showPsicologoSelector = false
}: ConfirmDeleteModalProps) {
  const [selectedPsicologoId, setSelectedPsicologoId] = useState<number | null>(null);

  const handleConfirm = () => {
    if (showPsicologoSelector) {
      onConfirm(selectedPsicologoId);
    } else {
      onConfirm(null);
    }
  };

  const handleClose = () => {
    setSelectedPsicologoId(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={!isProcessing ? handleClose : undefined}>
      <ModalContent>
        <ModalHeader>{message}</ModalHeader>
        
        {showPsicologoSelector && (
          <div className="px-6 py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar psicólogo:
            </label>
            <AdminPacienteFilterSelect
              selectedPsicologoId={selectedPsicologoId}
              onPsicologoChange={setSelectedPsicologoId}
            />
          </div>
        )}
        
        <ModalFooter>
          <Button onPress={!isProcessing ? handleClose : undefined} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={handleConfirm}
            isLoading={isProcessing}
            disabled={isProcessing || (showPsicologoSelector && !selectedPsicologoId)}
          >
            { filterStatus ? 
              isProcessing
                ? "Eliminando..."
                : filterStatus === 'deshabilitados'
                  ? "Activar"
                  : "Desactivar"
            : isProcessing
              ? "Eliminando..."
              : "Deshabilitar"
            }
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
