import { useState } from "react";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";

export interface CitaAction {
  idBoucher: string;
  idCita: string;
  comentario: string;
  numero: string;
}

export const useCitasPagadas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = parseCookies().session;

  const aceptarCita = async (
    codigo: string,
    idCita: string,
    comentario: string,
    numero: string,
  ) => {
    setIsLoading(true);
    try {
      // Primero llamamos al endpoint para habilitar el boucher
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/citas/habilitar-boucher`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            codigo: codigo,
            idCita: idCita,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error al habilitar el boucher");
      }

      const result = await response.json();

      // Verificar si la respuesta fue exitosa
      if (result.status_code === 200) {
        // Si el boucher fue aceptado exitosamente, enviar el comentario si existe
        if (comentario.trim()) {
          await enviarComentario(numero, comentario, "api/send-message-accept");
        }

        toast.success("Cita aceptada exitosamente");
        return result;
      } else {
        throw new Error(result.description || "Error al procesar la solicitud");
      }
    } catch (error) {
      console.error("Error al aceptar cita:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al aceptar la cita",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rechazarCita = async (
    codigo: string,
    comentario: string,
    numero: string
  ) => {
    setIsLoading(true);
    try {
      // Usar el endpoint cancelarBoucher existente
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/citas/rechazar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            codigo: codigo,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al rechazar el boucher");
      }

      const result = await response.json();

      // El endpoint cancelarBoucher devuelve un mensaje de éxito diferente
      if (result.status_code === 200) {
        // Enviar comentario si existe
        if (comentario.trim()) {
          await enviarComentario(numero, comentario, "api/send-message-reject");
        }

        toast.success("Cita rechazada exitosamente");
        return result;
      } else {
        throw new Error(result.message || "Error al procesar la solicitud");
      }
    } catch (error) {
      console.error("Error al rechazar cita:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al rechazar la cita"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función auxiliar para enviar comentarios a un endpoint separado
  const enviarComentario = async (
    numero: string,
    comentario: string,
    url: string,
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WHATS_BACK}${url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            telefono: numero,
            comentario: comentario,
          }),
        },
      );

      if (!response.ok) {
        console.warn(
          "Error al enviar comentario, pero la acción principal fue exitosa",
        );
      } else {
        const result = await response.json();
        console.log("Comentario enviado exitosamente:", result);
      }
    } catch (error) {
      console.warn("Error al enviar comentario:", error);
      // No lanzamos el error aquí porque el comentario es secundario
    }
  };

  return {
    aceptarCita,
    rechazarCita,
    isLoading,
  };
};
