import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import { Citas } from "@/interface";

export function useCitas() {
  const router = useRouter();
  const [citas, setCitas] = useState<Citas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Memoizar las cookies para evitar re-creación en cada render
  const { sessionToken, userRole } = useMemo(() => {
    const cookies = parseCookies();
    return {
      sessionToken: cookies["session"],
      userRole: cookies["rol"]
    };
  }, []); // Sin dependencias - solo se ejecuta una vez

  // Función para verificar autorización
  const checkAuthorization = useCallback(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const isAuth = userData.rol === "PSICOLOGO" || userRole !== "admin";

      setIsAuthorized(isAuth);

      if (!isAuth) {
        router.push("/unauthorized");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking authorization:", error);
      setIsAuthorized(false);
      router.push("/unauthorized");
      return false;
    }
  }, [router, userRole]);

  // Función para obtener citas - sin dependencia de cookies cambiantes
  const fetchCitas = useCallback(async () => {
    if (!isAuthorized || !sessionToken) return;

    try {
      setIsLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.result)) {
        const formattedCitas = data.result.map((cita: Citas) => ({
          codigo: cita.codigo,
          paciente: cita.paciente,
          fecha_inicio: cita.fecha_inicio,
          motivo: cita.motivo,
          estado: cita.estado,
          duracion: cita.duracion,
          idCita: cita.idCita,
          genero: cita.genero,
          edad: cita.edad,
        }));

        setCitas(formattedCitas);
        showToast("success", "Citas obtenidas correctamente");
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Error al obtener las citas";
      setError(errorMessage);
      showToast("error", "Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorized, sessionToken]); // Solo dependencias estables

  // Efecto para verificar autorización al montar el componente
  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]);

  // Efecto para obtener citas cuando esté autorizado
  useEffect(() => {
    if (isAuthorized === true) {
      fetchCitas();
    }
  }, [isAuthorized, fetchCitas]);

  return {
    citas,
    error,
    isLoading,
    isAuthorized,
    refetchCitas: fetchCitas,
  };
}