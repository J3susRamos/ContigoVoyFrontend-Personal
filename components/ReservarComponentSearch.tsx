import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/icons";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const FILTER_OPTIONS = {
  pais: [
    { nombre: "México", valor: "MX" },
    { nombre: "Colombia", valor: "CO" },
    { nombre: "Argentina", valor: "AR" },
    { nombre: "Perú", valor: "PE" },
    { nombre: "Chile", valor: "CL" },
  ],
  genero: [
    { nombre: "Femenino", valor: "femenino" },
    { nombre: "Masculino", valor: "masculino" },
  ],
  idioma: [
    { nombre: "Español", valor: "es" },
    { nombre: "Ingles", valor: "en" },
  ],
  enfoque: [
    { nombre: "Niños", valor: "niños" },
    { nombre: "Adolescentes", valor: "adolescentes" },
    { nombre: "Familiar", valor: "familiar" },
    { nombre: "Pareja", valor: "pareja" },
    { nombre: "Adulto", valor: "adulto" }
  ]
};

interface ReservarComponentSearchProps {
  onSearchChange: (term: string) => void;
  setFilters: Dispatch<
    SetStateAction<{
      pais: string[];
      genero: string[];
      idioma: string[];
      enfoque: string[];
    }>
  >;
}

export default function ReservarComponentSearch({
  onSearchChange,
  setFilters,
}: ReservarComponentSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [localFilters, setLocalFilters] = useState({
    pais: [] as string[],
    genero: [] as string[],
    idioma: [] as string[],
    enfoque: [] as string[]
  });

  const handleCheckboxChange = (
    filterKey: keyof typeof FILTER_OPTIONS,
    value: string
  ) => {
    setLocalFilters((prev) => {
      const currentValues = prev[filterKey];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // desmarcar
        : [...currentValues, value]; // marcar

      return {
        ...prev,
        [filterKey]: updatedValues,
      };
    });
  };

  useEffect(() => {
    setFilters(localFilters); // Esto sí está permitido
  }, [localFilters, setFilters]);

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange(term);
  };  const renderFilterSection = (
    title: string,
    filterKey: keyof typeof FILTER_OPTIONS
  ) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors duration-300">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
        {title}
      </h4>
      <div className="space-y-3">
        {FILTER_OPTIONS[filterKey].map((item, index) => (
          <div
            key={`${filterKey}-${index}`}
            className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <Checkbox
              id={`${filterKey}-${index}`}
              checked={localFilters[filterKey].includes(item.valor)}
              onCheckedChange={() => handleCheckboxChange(filterKey, item.valor)}
              className="text-lg rounded-md border-2 border-gray-300 dark:border-gray-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-indigo-500 data-[state=checked]:border-transparent"
            />
            <label
              htmlFor={`${filterKey}-${index}`}
              className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 flex-1"
            >
              {item.nombre}
            </label>
          </div>
        ))}
      </div>
    </div>
  );  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">/{/* Header del sidebar */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Encuentra tu psicólogo ideal</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Filtra por tus preferencias</p>
      </div>

      {/* Mobile: Search and Filters button */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="relative">
          <input
            name="nombre"
            type="text"
            placeholder="Buscar por nombre..."
            className="px-4 pl-12 text-base h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />          <span
            className="text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(/<svg /, '<svg fill="currentColor" '),
            }}
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
          />
        </div>        <button
          onClick={toggleFilters}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-xl text-base font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full flex items-center justify-between gap-x-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] dark:shadow-purple-900/50"
        >
          <span>Filtros avanzados</span>
          {isFiltersOpen ? (
            <FaChevronUp className="text-white" />
          ) : (
            <FaChevronDown className="text-white" />
          )}
        </button>
      </div>      {/* Desktop: Search only (filters always visible) */}
      <div className="hidden sm:block">
        <div className="relative mb-6">
          <input
            name="nombre"
            type="text"
            placeholder="Buscar por nombre..."
            className="px-4 pl-12 text-base h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span
            className="text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(/<svg /, '<svg fill="currentColor" '),
            }}
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
          />
        </div>
      </div>

      {/* Filters content */}
      <div className={`${isFiltersOpen ? "block" : "hidden"} sm:block space-y-6`}>
        {renderFilterSection("País de tu psicólogo", "pais")}
        {renderFilterSection("Género", "genero")}
        {renderFilterSection("Idioma", "idioma")}
        {renderFilterSection("Enfoque", "enfoque")}
      </div>
    </div>
  );
}
