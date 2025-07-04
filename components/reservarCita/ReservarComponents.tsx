"use client";
import { PsicologoPreviewData } from "@/interface";
import ReservarComponentSearch from "./ReservarComponentSearch";
import ReservarPsiPreview from "./ReservarPsiPreview";
import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";

const FILTER_OPTIONS = {
  pais: [
    { nombre: "México", valor: "MX", id: 1 },
    { nombre: "Colombia", valor: "CO", id: 2 },
    { nombre: "Argentina", valor: "AR", id: 3 },
    { nombre: "Perú", valor: "PE", id: 4 },
    { nombre: "Chile", valor: "CL", id: 5 },
  ],
  genero: [
    { nombre: "Femenino", valor: "femenino", id: 1 },
    { nombre: "Masculino", valor: "masculino", id: 2 },
  ],
  idioma: [
    { nombre: "Español", valor: "es", id: 1 },
    { nombre: "Ingles", valor: "en", id: 2 },
  ],
  enfoque: [
    { nombre: "Niños", valor: "niños", id: 1 },
    { nombre: "Adolescentes", valor: "adolescentes", id: 2 },
    { nombre: "Familiar", valor: "familiar", id: 3 },
    { nombre: "Pareja", valor: "pareja", id: 4 },
    { nombre: "Adulto", valor: "adulto", id: 5 },
  ],
};

export default function ReservarComponents({
  Psicologos,
}: {
  Psicologos: PsicologoPreviewData[];
}) {
  const [filteredData, setFilteredData] =
    useState<PsicologoPreviewData[]>(Psicologos);
  const [activeCountry, setActiveCountry] = useState<number | null>(null);
  const [activeIdiom, setActiveIdiom] = useState<number | null>(null);
  const [activeApproach, setActiveApproach] = useState<number | null>(null);
  const [activeGender, setActiveGender] = useState<number | null>(null);

  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    pais: [] as string[],
    genero: [] as string[],
    idioma: [] as string[],
    enfoque: [] as string[],
  });

  const applyFilters = ({
    search = searchTerm,
    countryId = activeCountry,
    idiomId = activeIdiom,
    genderId = activeGender,
    approachId = activeApproach,
  }) => {
    let filtered = [...Psicologos];

    // Filtro por búsqueda
    if (search) {
      filtered = filtered.filter((psicologo) => {
        const fullName =
          `${psicologo.nombre} ${psicologo.apellido}`.toLowerCase();
        return fullName.toLowerCase().includes(search.toLowerCase());
      });
    }

    // Filtro por pais
    if (countryId) {
      const categoryName = FILTER_OPTIONS.pais.find(
        (p) => p.id === countryId
      )?.valor;
      filtered = filtered.filter(
        (psicologo) => psicologo.pais === categoryName
      );
    }

    // Filtro por gerero
    if (genderId) {
      const genderName = FILTER_OPTIONS.genero.find(
        (g) => g.id === genderId
      )?.valor;
      filtered = filtered.filter(
        (psicologo) => psicologo.genero === genderName
      );
    }

    // Filtro por idioma
    if (idiomId) {
      const idiomName = FILTER_OPTIONS.idioma.find(
        (i) => i.id === idiomId
      )?.valor;
      filtered = filtered.filter((psicologo) => psicologo.titulo === idiomName);
    }

    // Filtro por enfoque
    if (approachId) {
      const approachName = FILTER_OPTIONS.enfoque.find(
        (e) => e.id === approachId
      )?.valor;
      if(approachName){
        filtered = filtered.filter((psicologo) => psicologo.especialidades.includes(approachName));
      }
    }
    setFilteredData(filtered);
  };

  const handleCountryFilter = (countryId: number) => {
    const newCountryId = activeCountry === countryId ? null : countryId;
    setActiveCountry(newCountryId);
    applyFilters({countryId : newCountryId});
  };

  const handleGenderFilter = (genderId: number) => {
    const newGenderId = activeGender === genderId ? null : genderId;
    setActiveGender(newGenderId);
    applyFilters({ genderId: newGenderId });
  };

  const handleIdiomFilter = (idiomId: number) => {
    const newIdiomId = activeIdiom === idiomId ? null : idiomId;
    setActiveIdiom(newIdiomId);
    applyFilters({ idiomId: newIdiomId });
  };

  const handleApproachFilter = (approachId: number) => {
    const newApproachId = activeApproach === approachId ? null : approachId;
    setActiveApproach(newApproachId);
    applyFilters({ approachId: newApproachId });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters({search: value});
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* {Header Section} */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 ">
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
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar psicólogos..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#e0e4ff] focus:border-[#634AE2] focus:outline-none bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 text-gray-800 dark:text-white transition-all duration-300 shadow-lg"
              />
            </div>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mt-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-2xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <div className="sticky top-6">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#634AE2]/10">
                <ReservarComponentSearch
                  onCountryClick={handleCountryFilter}
                  activeCountry={activeCountry}
                  onGenderClick={handleGenderFilter}
                  activeGender={activeGender}
                  onIdiomClick={handleIdiomFilter}
                  activeIdiom={activeIdiom}
                  onApproachClick={handleApproachFilter}
                  activeApproach={activeApproach}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid gap-8 grid-cols-2 auto-rows-[320px] max-lg:grid-cols-1 w-full h-full">
            {filteredData.length > 0 ? (
              filteredData.map((Item, index) => (
                <div
                  key={index}
                  className="sm:w-auto max-lg:px-4 w-full h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#634AE2]/10"
                >
                  <ReservarPsiPreview psicologo={Item} />
                </div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center text-center  rounded-3xl bg-[#EAEAFF]">
                <p className="flex items-center justify-center text-xl font-semibold max-lg:px-4 w-full h-full  bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#634AE2]/10">
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
