import { GetPacientesDisabled, GetPacientesEnabled } from "@/app/apiRoutes";
import { PacienteDisabled } from "@/interface";
import { useEffect, useState } from "react";

export const useAdminPacienteData = () => {
  const [data, setData] = useState<PacienteDisabled[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('deshabilitados');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (filterStatus === 'deshabilitados') {
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

    fetchData();
  }, [filterStatus]); // ✅ Solo depende de filterStatus

  const handleFilterChange = (newStatus: string) => {
    setFilterStatus(newStatus);
    // No necesitamos llamar fetchData aquí porque el useEffect se disparará automáticamente
  };

  // Si necesitas una función para re-fetch manual
  const refetch = () => {
    const fetchData = async () => {
      // ... misma implementación que arriba
      setLoading(true);
      setError(null);
      try {
        let response;
        if (filterStatus === 'deshabilitados') {
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
    fetchData();
  };

  return {
    data,
    error,
    loading,
    filterStatus,
    fetchData: refetch, // Exportamos la función para re-fetch manual
    handleFilterChange,
  };
};