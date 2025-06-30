"use client";
import { PsicologoPreviewData } from "@/interface";
import ReservarComponentSearch from "./ReservarComponentSearch";
import ReservarPsiPreview from "./ReservarPsiPreview";
import { useState } from "react";
import { Search } from "lucide-react";

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
    console.log(Psicologos)
    // Solo incluir psicólogos que pasan ambos filtros
    return pasaFiltros && pasaBusqueda;
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* {Header Section} */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#634AE2] dark:text-primary pb-1 lg:pb-2 mb-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] bg-clip-text text-transparent">
              Reservar Cita
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
              <span className="font-bold">
                La mejor inversión es en ti mismo ¡Comienza tu proceso hoy!{" "}
              </span>
              <br />
              Agenda tu sesión con un psicólogo en línea, fácil, seguro y
              privado
            </p>
          </div>
          <div className="relative lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 fill-gray-100 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar psicólogos..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#e0e4ff] focus:border-[#634AE2] focus:outline-none bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 text-gray-800 dark:text-white transition-all duration-300 shadow-lg"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-10 max-lg:gap-4">
          <div>
            <ReservarComponentSearch
              onSearchChange={(term) => setSearchTerm(term)}
              setFilters={setFilters}
            />
          </div>
          {/* <div className="grid gap-8 grid-cols-2 max-lg:grid-cols-1 h-full w-full">
          {filteredPsicologos.map((Item, index) => (
            <div key={index} className="sm:w-auto max-lg:px-4 w-full">
              <ReservarPsiPreview psicologo={Item} />
            </div>
          ))}
        </div> */}
          <div className="grid gap-8 grid-cols-2 max-lg:grid-cols-1 h-full w-full">
            {filteredPsicologos.length > 0 ? (
              filteredPsicologos.map((Item, index) => (
                <div
                  key={index}
                  className="sm:w-auto max-lg:px-4 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#634AE2]/10"
                >
                  <ReservarPsiPreview psicologo={Item} />
                </div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center text-center p-6 rounded-xl bg-[#EAEAFF]">
                <p className="text-[#634AE2] text-xl font-semibold mb-4">
                  No se encontraron médicos disponibles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
