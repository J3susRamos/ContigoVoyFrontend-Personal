"use client";
import { useEffect, useState } from "react";
import ReservarComponents from "@/components/ReservarComponents";
import { GetPsicologos } from "../apiRoutes";
import { PsicologoFilters, PsicologoPreviewData } from "@/interface";

export default function BlogPage() {
  const [psicologos, setPsicologos] = useState<PsicologoPreviewData[] | null>(
    null
  );
  const [filters, setFilters] = useState<PsicologoFilters>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (newFilters: PsicologoFilters, newSearchTerm?: string) => {
    setPage(1);
    setFilters(newFilters);
    if (newSearchTerm !== undefined) {
      setSearchTerm(newSearchTerm);
    }
  };

  useEffect(() => {
    const loadPsicologos = async () => {
      const normalizedFilters = {
        pais: filters.pais || [],
        genero: filters.genero || [],
        idioma: filters.idioma || [],
        enfoque: filters.enfoque || [],
      };
      const result = await GetPsicologos(normalizedFilters, searchTerm, page, perPage);
      
      if (result) {
        setPsicologos(result.data);
        setLastPage(result.pagination.last_page);
      } else {
        setPsicologos([]);
        setError("No se pudieron cargar los psicólogos. Intenta nuevamente.");
      }
    };
  
    loadPsicologos();
  }, [filters, searchTerm, page, perPage]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600 p-4 mx-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400 dark:text-red-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
      {psicologos && <ReservarComponents data={psicologos} onFilterChange={handleFilterChange} currentPage={page} setPage={setPage} lastPage={lastPage} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>}
    </div>
  );
}
