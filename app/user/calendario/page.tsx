"use client";

import showToast from "@/components/ToastStyle";
import CalendarioMain from "@/components/User/Calendario/CalendarioMain";
import { Citas } from "@/interface";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useCallback, useEffect, useState } from "react";

export default function Calendario() {
  const cookies = parseCookies();
  const router = useRouter();
  const [citas, setCitas] = useState<Citas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const handleGetCitas = useCallback(async () => {
    try {
      setError(null);
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        setError("Error al obtener las citas");
        showToast("error", "Error al obtener las citas");
        return;
      }
      const data = await response.json();
      console.log(data);

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
        setError("Formato de respuesta inválido");
        showToast("error", "Formato de respuesta inválido");
      }
    } catch (error) {
      console.error(error);
      setError("Error al obtener las citas");
      showToast("error", "Error de conexión. Intenta nuevamente.");
    }
  }, [cookies]);

  useEffect(() => {
      if (isAuthorized) {
        handleGetCitas();
      }
    }, [isAuthorized]);

  useEffect(() => {
      const cookies = parseCookies();
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
  
      const isAuth = userData.rol === "PSICOLOGO" || cookies["rol"] !== "admin";
      setIsAuthorized(isAuth);
  
      if (!isAuth) {
        router.push("/unauthorized");
      }
    }, [router]);
  
  return (
    <div className="h-screen">
      {
        error ? 
        <div className="flex items-center justify-center h-full">
          <div className="text-lg font-medium text-destructive dark:text-destructive">
            {error}
          </div>
        </div>
          : <CalendarioMain citas={citas} />
      }
    </div>
  );
}
