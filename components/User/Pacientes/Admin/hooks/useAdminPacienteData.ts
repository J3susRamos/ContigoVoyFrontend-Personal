import { GetPacientesDisabled } from "@/app/apiRoutes";
import { PacienteDisabled } from "@/interface";
import { useEffect, useState } from "react";

export const useAdminPacienteData = () => {
  const [data, setData] = useState<PacienteDisabled[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      response = await GetPacientesDisabled();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch psychologists');
      console.error('Error fetching psychologists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    error,
    loading,
    fetchData,
  };
}; 