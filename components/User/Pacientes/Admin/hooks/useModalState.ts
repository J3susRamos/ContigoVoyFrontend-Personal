import { useState } from "react";

export const useModalState = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [estadoId, setEstadoId] = useState<number>(0);

  const openEditModal = (id: number) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
  };

  const openEstadoModal = (id: number) => {
    setEstadoId(id);
    setIsEstadoModalOpen(true);
  };

  const closeEstadoModal = () => {
    setIsEstadoModalOpen(false);
    setEstadoId(0);
  };

  return {
    isEditModalOpen,
    isEstadoModalOpen,
    selectedId,
    estadoId,
    openEditModal,
    closeEditModal,
    openEstadoModal,
    closeEstadoModal,
  };
}; 