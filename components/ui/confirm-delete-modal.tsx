import { Modal, ModalContent, ModalHeader, ModalFooter, Button } from "@heroui/react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
}

export default function ConfirmDeleteModal({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               message = "¿Estás seguro de eliminar este usuario?",
                                           }: ConfirmDeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>{message}</ModalHeader>
                <ModalFooter>
                    <Button onPress={onClose}>Cancelar</Button>
                    <Button color="danger" onPress={onConfirm}>Eliminar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}