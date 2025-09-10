import { GetPacientesDisabled, GetPacientesEnabled } from "@/app/apiRoutes";
import { PacienteDisabled } from "@/interface";
import { useEffect, useState } from "react";

export const useAdminPacienteData = () => {
  const [data, setData] = useState<PacienteDisabled[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('deshabilitados');

  const fetchData = async (status: string = filterStatus) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (status === 'deshabilitados') {
        response = await GetPacientesDisabled();
      } else {
        response = await GetPacientesEnabled();
      }
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar pacientes';
      setError(errorMessage);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newStatus:string) => {
    setFilterStatus(newStatus);
    fetchData(newStatus);
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  return {
    data,
    error,
    loading,
    filterStatus,
    fetchData,
    handleFilterChange, // ✅ Asegúrate de que esto esté incluido
  };
};