import { ActivarPaciente } from "@/app/apiRoutes";
import showToast from "@/components/ToastStyle";

export const useModalConfirmarPacienteAdmin = (refreshData: () => void) => {
  const confirmEstado = async (estadoId: number | null, psicologoId: number | null) => {
    try {
      await ActivarPaciente(estadoId, psicologoId);
      showToast("success", `El paciente se activo correctamente`);
      await refreshData();
      return true; // Para indicar que se cerró el modal
    } catch (error) {
      console.error(`Error al activar al paciente:`, error);
      return false;
    }
  };

  return {
    confirmEstado,
  };
}; 