import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  isProcessing?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  message = "¿Estás seguro de eliminar este usuario?",
  isProcessing
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={!isProcessing ? onClose : undefined}>
      <ModalContent>
        <ModalHeader>{message}</ModalHeader>
        <ModalFooter>
          <Button onPress={!isProcessing ? onClose : undefined} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button 
            color="danger" 
            onPress={onConfirm}
            isLoading={isProcessing}
            disabled={isProcessing}
          >
            {isProcessing ? "Eliminando..." : "Eliminar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
