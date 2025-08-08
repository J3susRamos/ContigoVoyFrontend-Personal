import { GetPsicologos, GetPsicologosInactivos } from "@/app/apiRoutes";
import { PsicologoApiResponse } from "@/interface";
import { useEffect, useState } from "react";

export const usePsicologosData = () => {
  const [data, setData] = useState<PsicologoApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'activos' | 'inactivos'>('activos');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (filterStatus === 'activos') {
        response = await GetPsicologos();
      } else {
        response = await GetPsicologosInactivos();
      }
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
    // eslint-disable-next-line
  }, [filterStatus]);

  const handleFilterChange = (newStatus: 'activos' | 'inactivos') => {
    setFilterStatus(newStatus);
  };

  return {
    data,
    error,
    loading,
    filterStatus,
    fetchData,
    handleFilterChange,
  };
}; 