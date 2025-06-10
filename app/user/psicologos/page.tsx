'use client';
import { GetPsicologos } from "@/app/apiRoutes";
import CerrarSesion from "@/components/CerrarSesion";
import LoadingPages from "@/components/LoadingPages";
import AllPsicologos from "@/components/User/psicologos/AllPsicologos";
import { PsicologoApiResponse } from "@/interface";
import { useEffect, useState } from "react";

export default function Psicologos() {
  const [data, setData] = useState<PsicologoApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await GetPsicologos();
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch psychologists');
        console.error('Error fetching psychologists:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch(error => {
      console.error("Error in fetchData:", error);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingPages />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2>Error loading psychologists</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#634AE2]">
          Psicólogos
        </h1>
        <CerrarSesion />
      </div>
      
      {data?.result && data.result.length > 0 ? (
        <AllPsicologos Data={data.result} />
      ) : (
        <div className="text-center py-8">
          <p>No psychologists found</p>
        </div>
      )}
    </div>
  );
}
