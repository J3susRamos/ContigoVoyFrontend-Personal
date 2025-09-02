import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { Psicologo } from "../interfaces/types";

interface UsePsicoCalendarReturn {
  psychologists: Psicologo[];
  loading: boolean;
  error: string | null;
  refetchPsychologists: () => Promise<void>;
}

export const usePsicoCalendar = (): UsePsicoCalendarReturn => {
  const [psychologists, setPsychologists] = useState<Psicologo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener token de sesión usando parseCookies
      const cookies = parseCookies();
      const sessionToken = cookies.session;

      if (!sessionToken) {
        throw new Error(
          "No se encontró token de sesión. Por favor, inicia sesión.",
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/nombre`,
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
        if (Array.isArray(data.result)) {
          const psicologosList: Psicologo[] = data.result;
          setPsychologists(psicologosList);
        } else {
          throw new Error("Formato de datos inválido recibido de la API");
        }
      } else if (response.status === 401) {
        setError("No autorizado. Por favor, inicia sesión nuevamente.");
      } else {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching psychologists:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al obtener psicólogos",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    psychologists,
    loading,
    error,
    refetchPsychologists: fetchPsychologists,
  };
};
