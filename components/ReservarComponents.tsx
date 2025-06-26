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

    // Si es que pasa todos los filtros seleccionados
    const pasaFiltros = filtroPaisActivo && filtroGeneroActivo;

    // Filtro por nombre (search term)
    const fullName = `${psicologo.nombre} ${psicologo.apellido}`.toLowerCase();
    const pasaBusqueda = fullName.includes(searchTerm.toLowerCase());

    // Solo incluir psicólogos que pasan ambos filtros
    return pasaFiltros && pasaBusqueda;
  });

  return (
    <div className="w-full md:max-w-7xl mx-auto pb-10 ">
      <div className="px-4  text-[#634AE2] mx-auto  pb-5 md:pb-10">
        <h1 className="pt-10 lg:text-3xl font-bold text-center md:text-start text-2xl">
          La mejor inversión es en
          <br className="block sm:hidden" /> ti mismo
          <br className="block sm:hidden" /> ¡Comienza tu proceso hoy!
        </h1>

        <h5 className="lg:mt-3 font-light lg:text-[24px] text-center md:text-start text-base mt-1">
          Agenda tu sesión con un psicólogo en
          <br className="block sm:hidden" /> línea, fácil, seguro y privado
        </h5>
      </div>
      <div className="flex flex-col sm:flex-row gap-10 max-lg:gap-4">
        <div>
          <ReservarComponentSearch
            onSearchChange={(term) => setSearchTerm(term)}
            setFilters={setFilters}
          />
        </div>

        <div className="grid gap-8 grid-cols-2 max-lg:grid-cols-1 h-full w-full">
          {filteredPsicologos.length > 0 ? (
            filteredPsicologos.map((Item, index) => (
              <div key={index} className="sm:w-auto max-lg:px-4 w-full">
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
  );
}
