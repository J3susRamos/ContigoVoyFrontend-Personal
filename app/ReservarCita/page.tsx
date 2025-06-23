"use client";
import { useEffect, useState } from "react";
import ReservarComponents from "@/components/ReservarComponents";
import { GetPsicologos } from "../apiRoutes";
import { PsicologoApiResponse } from "@/interface";

export default function BlogPage() {
  const [psicologos, setPsicologos] = useState<PsicologoApiResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Consulta Psicológica Online | Reserva tu Cita ";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Agenda tu terapia psicológica en minutos. Psicólogos online disponibles para ti. Conecta desde donde estés. Tu primera sesión es gratuita."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Agenda tu terapia psicológica en minutos. Psicólogos online disponibles para ti. Conecta desde donde estés. Tu primera sesión es gratuita.";
      document.head.appendChild(meta);
    }
    async function fetchData() {
      try {
        const data = await GetPsicologos();
        setPsicologos(data);
      } catch (error) {
        setError("Error obteniendo psicólogos");
        console.error(error);
      }
    }
    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {psicologos && <ReservarComponents Psicologos={psicologos.result} />}
    </div>
  );
}
