import { useState } from "react";
import { DeletePsicologo } from "@/app/apiRoutes";
import showToast from "@/components/ToastStyle";

export const useModalEliminar = (refreshData: () => void) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: number | null) => {
    if (!id) return;
    try {
      setIsLoading(true);
      await DeletePsicologo(id);
      showToast("success", "Psicólogo eliminado correctamente");
      await refreshData();
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar psicólogo:", error);
      showToast("error", "Error interno del servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id: number) => setDeleteId(id);
  const closeDeleteModal = () => setDeleteId(null);

  return {
    deleteId,
    isLoading,
    handleDelete,
    openDeleteModal,
    closeDeleteModal,
  };
};