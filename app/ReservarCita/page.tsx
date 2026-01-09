"use client";
import { useEffect, useState, useCallback } from "react";
import ReservarComponents from "@/components/ReservarComponents";
import ReservarCitaLoading from "@/components/ReservarCita/ReservarCitaLoading";
import { GetPsicologos } from "../apiRoutes";
import { PsicologoFilters, PsicologoPreviewData } from "@/interface";
import { useServiceFilter } from "@/hooks/useServiceFilter";

export default function ReservarCitaPage() {
  // 1. Obtenemos la información del servicio desde la URL
  const serviceInfo = useServiceFilter();
  
  const [psicologos, setPsicologos] = useState<PsicologoPreviewData[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // 2. Estado de filtros: Inicializamos vacíos, se llenarán con el serviceInfo
  const [filters, setFilters] = useState<PsicologoFilters>({
    pais: [],
    genero: [],
    idioma: [],
    enfoque: [],
    especialidad: []
  });

  // 3. EFECTO CRUCIAL: Sincronizar filtros si el serviceInfo (URL) cambia
  // Esto asegura que si el usuario entra directo por link, el filtro se aplique.
  useEffect(() => {
    if (serviceInfo?.enfoque) {
      console.log('🎯 [PAGE] Aplicando filtro de servicio:', serviceInfo);
      setFilters((prev) => ({
        ...prev,
        enfoque: [serviceInfo.enfoque],
      }));
    }
  }, [serviceInfo]);

  // 4. Manejador de cambios en los filtros (desde el buscador)
  const handleFilterChange = useCallback((newFilters: PsicologoFilters, newSearchTerm?: string) => {
    console.log('🔍 [PAGE] handleFilterChange llamado con:', newFilters);
    console.log('🔍 [PAGE] Filtro aplicado:', newFilters);
    
    setPage(1); // Resetear a la primera página al filtrar
    setFilters(newFilters);
    
    if (newSearchTerm !== undefined) {
      setSearchTerm(newSearchTerm);
    }
  }, []);

  // 5. EFECTO DE CARGA: Se dispara cada vez que cambian filtros, página o término de búsqueda
  // Pero esperamos a que serviceInfo se resuelva para evitar la primera carga vacía
  useEffect(() => {
    // Si venimos desde una página de servicio pero aún no tenemos el serviceInfo, esperamos
    const hasServiceParam = window.location.search.includes('serviceName=');
    const isWaitingForService = hasServiceParam && !serviceInfo;
    
    if (isWaitingForService) {
      console.log('⏳ [PAGE] Esperando serviceInfo para cargar...');
      return;
    }
    
    // Si venimos desde servicio pero el filtro aún no se ha aplicado, esperamos
    if (hasServiceParam && serviceInfo && filters.enfoque?.length === 0) {
      console.log('⏳ [PAGE] Esperando que se aplique el filtro de servicio...');
      return;
    }
    
    async function fetchData() {
      try {
        console.log('🔍 [PAGE] Llamando GetPsicologos con filtros:', filters);
        console.log('🔍 [PAGE] serviceInfo:', serviceInfo);
        
        const data = await GetPsicologos(
          {
            pais: filters.pais || [],
            genero: filters.genero || [],
            idioma: filters.idioma || [],
            enfoque: filters.enfoque || [],
            especialidad: filters.especialidad || []
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
  }, [filters, page, searchTerm, perPage, serviceInfo]);

  return (
    <div>
      {error && (
        <p className="flex items-center justify-center h-screen text-red-500 font-medium">
          {error}
        </p>
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
          // ✅ PASAMOS LOS FILTROS ACTUALES para que el buscador sepa qué marcar
          filters={filters}
          setFilters={setFilters}
        />
      ) : (
        <ReservarCitaLoading />
      )}
    </div>
  );
}