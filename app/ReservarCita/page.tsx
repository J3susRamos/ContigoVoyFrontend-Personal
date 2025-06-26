'use client';
import { useEffect, useState } from "react";
import ReservarComponents from "@/components/ReservarComponents";
import { GetPsicologos } from "../apiRoutes";
import { PsicologoApiResponse } from "@/interface";

export default function BlogPage() {
  const [psicologos, setPsicologos] = useState<PsicologoApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await GetPsicologos();
        setPsicologos(data);
      } catch (error) {
        setError("Error obteniendo psicólogos");
        console.error(error);
      }
    }
    fetchData().catch(error => {
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
