import { estadoPsicologo } from "@/app/apiRoutes";
import showToast from "@/components/ToastStyle";

export const useModalConfirmar = (refreshData: () => void) => {
  const confirmEstado = async (estadoId: number | null, filterStatus: 'activos' | 'inactivos') => {
    try {
      await estadoPsicologo(estadoId);
      showToast("success", `El psicólogo se ${filterStatus === 'inactivos' ? 'activó' : 'desactivó'} correctamente`);
      await refreshData();
      return true; // Para indicar que se cerró el modal
    } catch (error) {
      console.error(`Error al ${filterStatus === 'inactivos' ? 'activar' : 'desactivar'} el psicólogo:`, error);
      return false;
    }
  };

  return {
    confirmEstado,
  };
}; 