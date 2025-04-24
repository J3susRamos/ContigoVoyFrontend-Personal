"use client";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { DatosPacienteProps, CitasConteo } from "@/interface";
import showToast from "@/components/ToastStyle";

const CitasPaciente: React.FC<DatosPacienteProps> = ({ idPaciente }) => {
  const [citas, setCitas] = useState<CitasConteo>({
    pendientes: 0,
    canceladas: 0,
    confirmadas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const HandleGetCitas = async (idPaciente: number) => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/citas/${idPaciente}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCitas(data.result); // Asume que data.result contiene los conteos de citas
        showToast("success", "Citas obtenidas correctamente");
      } else {
        showToast("error", data.message || "Error al obtener las citas");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idPaciente) {
      HandleGetCitas(idPaciente);
    }
  }, [idPaciente]);

  if (loading) {
    return <div>Cargando citas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex gap-4 rounded-t-3xl bg-background p-6 mt-2">
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">{citas.pendientes}</div>
          <div className="text-lg font-light text-center pt-2">Citas pendientes</div>
        </div>
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">{citas.canceladas}</div>
          <div className="text-lg font-light text-center pt-2">Citas canceladas</div>
        </div>
      </div>
      <div className="flex gap-4 rounded-b-3xl bg-background p-6">
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">{citas.confirmadas}</div>
          <div className="text-lg font-light text-center pt-2">Citas confirmadas</div>
        </div>
        <div className="bg-[#634AE2] text-white p-4 rounded-2xl w-48">
          <div className="text-2xl font-bold text-center">0</div>
          <div className="text-lg font-light text-center pt-2">Citas ausencias</div>
        </div>
      </div>
    </div>
  );
};

export default CitasPaciente;