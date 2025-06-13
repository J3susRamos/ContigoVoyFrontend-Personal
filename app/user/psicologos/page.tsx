"use client";

import { GetPsicologos } from "@/app/apiRoutes";
import CerrarSesion from "@/components/CerrarSesion";
import LoadingPages from "@/components/LoadingPages";
import AllPsicologos from "@/components/User/psicologos/AllPsicologos";
import { PsicologoApiResponse } from "@/interface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Psicologos() {
  const [data, setData] = useState<PsicologoApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol === "ADMIN") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.push("/unauthorized");
    }
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await GetPsicologos();
          setData(response);
        } catch (err: any) {
          let msg = "Failed to fetch psychologists";

          if (err.response?.data?.message) {
            msg = err.response.data.message;
          } else if (err instanceof Error) {
            msg = err.message;
          }

          setError(msg);
          console.error("Error fetching psychologists:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthorized]);

  if (isAuthorized === null || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingPages />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 text-center">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#634AE2]">Psicólogos</h1>
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
