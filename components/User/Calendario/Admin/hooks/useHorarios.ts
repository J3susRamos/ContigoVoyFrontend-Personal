import { useState } from "react";
import { Horario } from "../interfaces/types";
import { parseCookies } from "nookies";

interface useHorariosProps {
  idPsicologo: number | string;
  startDateString: string;
  endDateString: string;
}

interface useHorarioReturn {
  horarios: Horario[];
  loadingHorarios: boolean;
  error: string | null;
  refetchHorarios: () => Promise<void>;
}

export const useHorarios = ({
  idPsicologo,
  startDateString,
  endDateString,
}: useHorariosProps): useHorarioReturn => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loadingHorarios, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //desde aqui modifiqué (martin)
  
 const fetchHorarios = async () => {
  try {
    setLoading(true);
    setError(null);

    const sessionToken = parseCookies().session;

    if (!sessionToken) {
      throw new Error("No session token found");
    }

    // Construir la URL con parámetros de consulta
    const queryParams = new URLSearchParams({
      idPsicologo: idPsicologo.toString(),
      fechaInicio: startDateString,
      fechaFin: endDateString,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/disponibilidad/listar?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      
      // ✅ CORRECCIÓN: El backend devuelve {message: "...", data: [...]}
      if (data.data && Array.isArray(data.data)) {
        const horariosList: Horario[] = data.data.map(
          (horario: Record<string, unknown>) => ({
            id: horario.idDisponibilidad?.toString() || 
                `${horario.idPsicologo}-${horario.fecha}-${horario.hora_inicio}`,
            fecha: horario.fecha as string,
            horaInicio: horario.hora_inicio as string,  // ← hora_inicio
            horaFin: horario.hora_fin as string,        // ← hora_fin
            idPsicologo: parseInt(
              horario.idPsicologo?.toString() || idPsicologo.toString(),
            ),
            disponible: true, // Por defecto disponible (ya que son horarios de disponibilidad)
            paciente: null,   // No hay paciente en disponibilidad
            estado: "disponible", // Estado por defecto
            motivo: null,
            notas: horario.turno || null, // Usar el turno como notas si existe
          }),
        );
        setHorarios(horariosList);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } else if (response.status === 401) {
      setError("No autorizado. Por favor, inicia sesión nuevamente.");
    } else if (response.status === 404) {
      setError(
        "No se encontraron horarios para el psicólogo y fechas seleccionadas.",
      );
      setHorarios([]);
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error("Error fetching horarios:", error);
    setError(
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener horarios",
    );
  } finally {
    setLoading(false);
  }
};

  return {
    horarios,
    loadingHorarios,
    error,
    refetchHorarios: fetchHorarios,
  };
};
