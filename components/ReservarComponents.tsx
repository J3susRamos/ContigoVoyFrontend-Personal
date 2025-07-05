"use client";
import { PsicologoPreviewData } from "@/interface";
import ReservarComponentSearch from "./ReservarComponentSearch";
import ReservarPsiPreview from "./ReservarPsiPreview";
import { useState } from "react";

export default function ReservarComponents({
  Psicologos,
}: {
  Psicologos: PsicologoPreviewData[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    pais: [] as string[],
    genero: [] as string[],
    idioma: [] as string[],
    enfoque: [] as string[],
  });

  const filteredPsicologos = Psicologos.filter((psicologo) => {
    const filtroPaisActivo =
      filters.pais.length === 0 || filters.pais.includes(psicologo.pais);
    const filtroGeneroActivo =
      filters.genero.length === 0 || filters.genero.includes(psicologo.genero);

    // Si pasa todos los filtros seleccionados
    const pasaFiltros = filtroPaisActivo && filtroGeneroActivo;

    // Filtro por nombre (search term)
    const fullName = `${psicologo.nombre} ${psicologo.apellido}`.toLowerCase();
    const pasaBusqueda = fullName.includes(searchTerm.toLowerCase());

    // Solo incluir psicólogos que pasan ambos filtros
    return pasaFiltros && pasaBusqueda;
  });
  return (
    <div className="w-full">      {/* Hero Section con gradiente moderno */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              La mejor inversión es en{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                ti mismo
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
              ¡Comienza tu proceso hoy!
            </h2>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Agenda tu sesión con un psicólogo en línea, fácil, seguro y privado
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Profesionales certificados</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">100% confidencial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Primera sesión gratuita</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros */}          <div className="lg:w-80 flex-shrink-0">
            <ReservarComponentSearch
              onSearchChange={(term) => setSearchTerm(term)}
              setFilters={setFilters}
            />
          </div>

          {/* Grid de psicólogos */}
          <div className="flex-1">
            {filteredPsicologos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {filteredPsicologos.map((Item, index) => (
                  <div key={index} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <ReservarPsiPreview psicologo={Item} />
                  </div>
                ))}
              </div>            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.463.898-6.05 2.373a4 4 0 014.33-4.33 7.957 7.957 0 013.44 0 4 4 0 014.33 4.33A7.962 7.962 0 0118 13.291z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No se encontraron psicólogos
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Intenta ajustar tus filtros de búsqueda para encontrar el profesional ideal para ti.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      pais: [],
                      genero: [],
                      idioma: [],
                      enfoque: [],
                    });
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
