import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Divider } from "@heroui/react";
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
  };

  const renderFilterSection = (
    title: string,
    filterKey: keyof typeof FILTER_OPTIONS
  ) => (
    <div className="border-t border-[#9494F3] mt-4">
      <p className="pt-4 text-lg font-bold text-[#634AE2]">{title}</p>
      {FILTER_OPTIONS[filterKey].map((item, index) => (
        <div
          key={`${filterKey}-${index}`}
          className="flex items-center space-x-3 pt-2 ml-5"
        >
          <Checkbox
            id={`${filterKey}-${index}`}
            checked={localFilters[filterKey].includes(item.valor)}
            onCheckedChange={() => handleCheckboxChange(filterKey, item.valor)}
            className="text-xl rounded-2xl border-[#634AE2] checked:border-[#634AE2]"
          />
          <div className="grid">
            <label
              htmlFor={`${filterKey}-${index}`}
              className="text-md font-light text-[#634AE2]"
            >
              {item.nombre}
            </label>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-4 pb-5 md:pb-20 border-r border-[#9494F3] sm:w-[250px]">
      <Divider orientation="vertical" />

      {/* Mobile: Search and Filters button */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="relative">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            className="px-4 text-lg h-9 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#EAEAFF]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span
            className="text-[#634AE2] transition-colors absolute right-3 top-1/2 transform -translate-y-1/2"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(/<svg /, '<svg fill="currentColor" '),
            }}
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
          />
        </div>

        <button
          onClick={toggleFilters}
          className="bg-[#EAEAFF] text-[#634AE2] py-2 px-4 rounded-full text-lg font-normal transition-colors w-full flex items-center justify-between gap-x-4"
        >
          Filtros
          {isFiltersOpen ? (
            <FaChevronUp className="text-[#634AE2]" />
          ) : (
            <FaChevronDown className="text-[#634AE2]" />
          )}
        </button>
      </div>

      {/* Desktop: Search only (filters always visible) */}
      <div className="hidden sm:block">
        <div className="relative pb-2">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            className="px-4 pl-10 font-light text-lg h-9 outline-none focus:ring-0 focus:outline-none w-full rounded-full border-none placeholder:text-[#634AE2] bg-[#EAEAFF]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span
            className="text-[#634AE2] transition-colors absolute right-3 top-1/2 transform -translate-y-1/2"
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
      <div className={`${isFiltersOpen ? "block" : "hidden"} sm:block`}>

        {renderFilterSection("País de tu psicólogo", "pais")}
        {renderFilterSection("Género", "genero")}
        {renderFilterSection("Idioma", "idioma")}
        {renderFilterSection("Enfoque", "enfoque")}
      </div>
    </div>
  );
}
