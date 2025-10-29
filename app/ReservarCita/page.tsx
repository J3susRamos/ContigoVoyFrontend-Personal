"use client";
import { useEffect, useState, useCallback } from "react";
import ReservarComponents from "@/components/ReservarComponents";
import ReservarCitaLoading from "@/components/ReservarCita/ReservarCitaLoading";
import { GetPsicologos } from "../apiRoutes";
import { PsicologoFilters, PsicologoPreviewData } from "@/interface";

export default function ReservarCitaPage() {
  const [psicologos, setPsicologos] = useState<PsicologoPreviewData[] | null>(null);
  const [filters, setFilters] = useState<PsicologoFilters>({
    pais: [],
    genero: [],
    idioma: [],
    enfoque: [],
    especialidad: [] // ✅ INICIALIZAR LA NUEVA PROPIEDAD
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = useCallback((newFilters: PsicologoFilters, newSearchTerm?: string) => {
    console.log('🔍 [PAGE] handleFilterChange llamado con:', newFilters);
    console.log('🔍 [PAGE] Especialidades seleccionadas:', newFilters.especialidad);
    
    setPage(1);
    setFilters(newFilters);
    if (newSearchTerm !== undefined) {
      setSearchTerm(newSearchTerm);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔍 [PAGE] Llamando GetPsicologos con filtros:', filters);
        
        const data = await GetPsicologos(
          {
            pais: filters.pais || [],
            genero: filters.genero || [],
            idioma: filters.idioma || [],
            enfoque: filters.enfoque || [],
            especialidad: filters.especialidad || [] // 🔄 AGREGAR ESTO
          }, 
          searchTerm,
          page, 
          perPage
        );
        
        console.log('✅ [PAGE] Psicólogos recibidos:', data.result.data.length);
        setPsicologos(data.result.data);
        setLastPage(data.result.pagination.last_page);
        setError(null);
      } catch (error) {
        console.error("Error fetching psicologos:", error);
        setError("Error al cargar los psicólogos");
      }
    }

    fetchData();
  }, [filters, page, searchTerm, perPage]);

  return (
    <div>
      {error && (
        <p className="flex items-center justify-center h-screen">{error}</p>
      )}
      {psicologos ? (
        <ReservarComponents
          data={psicologos}
          onFilterChange={handleFilterChange}
          currentPage={page}
          setPage={setPage}
          lastPage={lastPage}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      ) : (
        <ReservarCitaLoading />
      )}
    </div>
  );
}