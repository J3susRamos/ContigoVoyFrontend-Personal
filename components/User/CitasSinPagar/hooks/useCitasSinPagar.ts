import { useState } from "react";
import { toast } from "react-toastify";

export interface CitaAction {
  citaId: string;
  comentario: string;
}

export const useCitasSinPagar = () => {
  const [isLoading, setIsLoading] = useState(false);

  const aceptarCita = async (citaId: string, comentario: string) => {
    setIsLoading(true);
    try {
      // Aquí puedes reemplazar con tu endpoint real
      const response = await fetch("/api/citas/habilitar-boucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citaId,
          comentario,
          accion: "aceptar",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al aceptar la cita");
      }

      const result = await response.json();

      toast.success("Cita aceptada exitosamente");
      return result;
    } catch (error) {
      console.error("Error al aceptar cita:", error);
      toast.error("Error al aceptar la cita");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rechazarCita = async (citaId: string, comentario: string) => {
    setIsLoading(true);
    try {
      // Aquí puedes reemplazar con tu endpoint real
      const response = await fetch("/api/citas/rechazar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citaId,
          comentario,
          accion: "rechazar",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al rechazar la cita");
      }

      const result = await response.json();

      toast.success("Cita rechazada exitosamente");
      return result;
    } catch (error) {
      console.error("Error al rechazar cita:", error);
      toast.error("Error al rechazar la cita");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    aceptarCita,
    rechazarCita,
    isLoading,
  };
};
