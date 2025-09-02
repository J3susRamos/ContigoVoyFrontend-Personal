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
        if (data.success && Array.isArray(data.result)) {
          const horariosList: Horario[] = data.result.map(
            (horario: Record<string, unknown>) => ({
              id:
                horario.id ||
                horario.idHorario ||
                `${horario.idPsicologo}-${horario.fecha}-${horario.horaInicio}`,
              fecha: horario.fecha,
              horaInicio: horario.horaInicio || horario.hora_inicio,
              horaFin: horario.horaFin || horario.hora_fin,
              idPsicologo: parseInt(
                horario.idPsicologo?.toString() || idPsicologo.toString(),
              ),
              disponible: horario.disponible !== false, // Por defecto disponible
              paciente: horario.paciente || null,
              estado:
                horario.estado ||
                (horario.disponible !== false ? "disponible" : "ocupado"),
              motivo: horario.motivo || null,
              notas: horario.notas || null,
            }),
          );
          setHorarios(horariosList);
        } else if (data.result && !Array.isArray(data.result)) {
          // Si el resultado no es un array, intentar extraer el array de horarios
          const horariosArray = data.result.horarios || [];
          const horariosList: Horario[] = horariosArray.map(
            (horario: Record<string, unknown>) => ({
              id:
                horario.id ||
                horario.idHorario ||
                `${horario.idPsicologo}-${horario.fecha}-${horario.horaInicio}`,
              fecha: horario.fecha,
              horaInicio: horario.horaInicio || horario.hora_inicio,
              horaFin: horario.horaFin || horario.hora_fin,
              idPsicologo: parseInt(
                horario.idPsicologo?.toString() || idPsicologo.toString(),
              ),
              disponible: horario.disponible !== false,
              paciente: horario.paciente || null,
              estado:
                horario.estado ||
                (horario.disponible !== false ? "disponible" : "ocupado"),
              motivo: horario.motivo || null,
              notas: horario.notas || null,
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
