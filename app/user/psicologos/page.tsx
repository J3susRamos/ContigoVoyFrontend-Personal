'use client';
import { GetPsicologos } from "@/app/apiRoutes";
import CerrarSesion from "@/components/CerrarSesion";
import AllPsicologos from "@/components/User/psicologos/AllPsicologos";
import { PsicologoApiResponse } from "@/interface";
import { useEffect, useState } from "react";

export default function Psicologos() {
  const [data, setData] = useState<PsicologoApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetPsicologos();
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch psychologists');
        console.error('Error fetching psychologists:', err);
      }
    };

    fetchData().catch(error => {
      console.error("Error in fetchData:", error);
    });
  }, []);
  return (
    <section className="bg-[#f8f8ff] dark:bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="m-5">
          <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-foreground">
            Gestión de Psicólogos
          </h1>
          <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground mt-2">
            Administra el equipo de profesionales de la salud mental.
          </p>
        </div>
        <div className="m-5">
          <CerrarSesion />
        </div>
      </div>

      {error && (
          <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg mx-5">
            <h2>Error loading psychologists</h2>
            <p>{error}</p>
          </div>
      )}
      
      <div className="mx-5">
        {data?.result && data.result.length > 0 ? (
          <AllPsicologos Data={data.result} />
        ) : (
          <div className="text-center py-8 text-primary dark:text-primary-foreground">
            <p>No se encontraron psicólogos</p>
          </div>
        )}
      </div>
    </section>
  );
}
